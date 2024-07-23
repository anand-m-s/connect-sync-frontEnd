import React, { useState } from "react";
import { Box, Button, Typography, IconButton, LinearProgress } from "@mui/material";
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Clear from '@mui/icons-material/Clear';
import { styled, useTheme } from '@mui/material/styles';
import { userAxios } from "../../../constraints/axios/userAxios";
import userApi from "../../../constraints/api/userApi";
import { uploadFileToSignedUrl } from "../../../constraints/axios/uploadFileToSignedUrl";
import { ChatState } from "../../../context/ChatProvider";
import { useSocket } from "../../../services/socket";


const Input = styled('input')({
  display: 'none',
});

const DragNdrop = ({ onFilesSelected, width, height, setMessages, messages, toggleDragNdrop }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const { selectedChat } = ChatState();
  const theme = useTheme();
  const { socket } = useSocket()

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      delete newProgress[index];
      return newProgress;
    });
  };

  const handleFileUpload = async () => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const contentType = file.type;
        const key = `test/image/${file.name}`;
        const response = await userAxios.post(userApi.getSignedUrl, { key, contentType });
        const { signedUrl, fileLink } = response.data;
        await uploadFileToSignedUrl(
          signedUrl,
          file,
          contentType,
          // (progressEvent) => {
          //   const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //   setProgress((prevProgress) => ({
          //     ...prevProgress,
          //     [index]: progress,
          //   }));
          // },
          (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress((prevProgress) => {
              const newProgress = { ...prevProgress, [index]: progress };
              const allProgresses = Object.values(newProgress);
              const allCompleted = allProgresses.every((prog) => prog === 100);
              if (allCompleted) {
                toggleDragNdrop();
              }
              return newProgress;
            });
          },
        );
        return { fileLink, contentType };
      });

      const fileLinks = await Promise.all(uploadPromises);
      if (fileLinks) {

        const res = await userAxios.post(userApi.fileUpload, {
          files: fileLinks,
          chatId: selectedChat._id
        });
        // setMessages(prevMessages => [...prevMessages, ...res.data]);
        console.log(res.data[0])
        socket?.emit('new message', res.data[0])
        setMessages([...messages, res.data[0]])
        if (res.data) {
          onFilesSelected('uploaded')
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <section className="drag-drop" style={{ width, height, backgroundColor: theme.palette.background.paper }}>
      <Box
        className={`document-uploader ${files.length > 0 ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        sx={{
          border: `1px dashed ${files.length > 0 ? theme.palette.success.main : theme.palette.primary.main}`,
          backgroundColor: theme.palette.action.hover,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <>
          <div className="upload-info" style={{ display: 'flex', alignItems: 'center', marginBottom: theme.spacing(2) }}>
            <CloudUpload style={{ fontSize: '36px', marginRight: theme.spacing(2), color: theme.palette.primary.main }} />
            <div>
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>Drag and drop your files here</Typography>
              <Typography variant="body2">Supported files: .PDF, .DOCX, .PPTX, .TXT,Jpg,mp4</Typography>
            </div>
          </div>
          <Input
            type="file"
            id="browse"
            onChange={handleFileChange}
            accept=".pdf,.docx,.pptx,.txt,.xlsx,.mp4,.jpg,.jpeg,.png"
            multiple
          />
          <label htmlFor="browse">
            <Button variant="outlined" component="span" sx={{ mt: 2 }}>Browse files</Button>
          </label>
        </>

        {files.length > 0 && (
          <div className="file-list" style={{ width: '100%', height: '30vh', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: theme.spacing(1), marginTop: theme.spacing(2) }}>
            <div className="file-list__container" style={{ width: '100%', height: '100%' }}>
              {files.map((file, index) => (
                <div className="file-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing(1), border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius }}>
                  <div className="file-info" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(0.5), flex: 1 }}>
                    <Typography variant="body2" style={{ color: theme.palette.text.primary }}>{file.name}</Typography>
                    {progress[index] !== undefined && (
                      <>
                        <LinearProgress variant="determinate" value={progress[index]} />
                        <Typography variant="body2" sx={{ mt: 1 }}>Upload Progress: {progress[index]}%</Typography>
                      </>
                    )}
                  </div>
                  <div className="file-actions" style={{ cursor: 'pointer' }}>
                    <Clear style={{ fontSize: '18px', color: theme.palette.text.secondary, '&:hover': { color: theme.palette.error.main } }} onClick={() => handleRemoveFile(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="success-file" style={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main, marginTop: theme.spacing(1) }}>
            <CheckCircleOutline style={{ marginRight: theme.spacing(0.5) }} />
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>{files.length} file(s) selected</Typography>
          </div>
        )}

        <Box className='mt-10'>
          <Button variant="contained" color="info" size="small" onClick={handleFileUpload}>
            Upload
          </Button>
        </Box>
      </Box>
    </section>
  );
};

export default DragNdrop;


