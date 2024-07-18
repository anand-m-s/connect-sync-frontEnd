import { useState } from "react";
import { Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, LinearProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { adminAxios } from "../../../constraints/axios/adminAxios";
import adminApi from "../../../constraints/api/adminApi";
import { uploadFileToSignedUrl } from "../../../constraints/axios/uploadFileToSignedUrl";
import { toast, Toaster } from "sonner";

const validationSchema = Yup.object({
  audio: Yup.mixed()
    .required("Audio file is required")
    .test("fileFormat", "Unsupported Format", (value) => value && ["audio/mp3", "audio/mpeg"].includes(value.type)),
  description: Yup.string().required("Description is required"),
  caption: Yup.string().required("Caption is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.mixed()
    .required("Course image is required")
    .test("fileFormat", "Unsupported Format", (value) => value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type)),
});

const Course = () => {
  const [progress, setProgress] = useState({ audio: 0, image: 0 });

  const getSignedUrlAndUpload = async (file, typeKey, progressKey) => {
    try {
      const res = await adminAxios.post(adminApi.getSignedUrl, {
        type: file.type,
        key: file.name,
      });
      const { signedUrl, fileLink } = res.data;

      await uploadFileToSignedUrl(
        signedUrl,
        file,
        file.type,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress((prevProgress) => ({
            ...prevProgress,
            [progressKey]: progress,
          }));
        },
      );
      return fileLink;
    } catch (error) {
      console.error(`Error uploading ${typeKey} file: `, error);
      throw error;
    }
  };

  const handleSubmit = async (values, formikHelpers) => {
    try {
      const audioFileLink = await getSignedUrlAndUpload(values.audio, 'audio', 'audio');
      const imageFileLink = await getSignedUrlAndUpload(values.image, 'image', 'image');

      const formData = {
        ...values,
        audio: audioFileLink,
        image: imageFileLink,
      };
      await adminAxios.post(adminApi.createCourse, formData);
      toast.info('Course added');

      formikHelpers.resetForm();
      setProgress({ audio: 0, image: 0 });
      document.getElementById('audio').value = null;
      document.getElementById('image').value = null;
    } catch (error) {
      console.error("Error uploading files: ", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      audio: null,
      description: "",
      caption: "",
      category: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values, formikHelpers) => {
      handleSubmit(values, formikHelpers);
    },
  });

  return (
    <Box flex={6}>
      <Toaster />
      <h1 className="text-xl font-bold p-7 shadow-sm">Add course</h1>

      <Box className='flex justify-center items-center h-full'>
        <Box>
          <Box className='p-2'>
            <Typography variant="h4" className="text-3xl font-bold">Create Meditation Course</Typography>
            <Typography className="text-muted-foreground">Fill out the details for your new meditation course.</Typography>
          </Box>
          <form onSubmit={formik.handleSubmit} className="flex flex-wrap gap-6 p-5">
            <div className="flex flex-col gap-4 flex-grow basis-full md:basis-1/2">
              <div className="flex flex-col gap-3">
                <TextField
                  id="audio"
                  name="audio"
                  type="file"
                  label='Audio'
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.audio && Boolean(formik.errors.audio)}
                  helperText={formik.touched.audio && formik.errors.audio}
                  onChange={(event) => {
                    formik.setFieldValue("audio", event.currentTarget.files[0]);
                  }}
                />

              </div>
              <div className="flex flex-col gap-2">
                <TextField
                  id="caption"
                  name="caption"
                  label="Caption"
                  fullWidth
                  variant="outlined"
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  error={formik.touched.caption && Boolean(formik.errors.caption)}
                  helperText={formik.touched.caption && formik.errors.caption}
                />
              </div>
              <div className="flex flex-col gap-2">
                <TextField
                  id="description"
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={1}
                  variant="outlined"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-grow basis-full md:basis-1/2">
              <FormControl variant="outlined" fullWidth className="flex flex-col gap-2">
                <InputLabel htmlFor="category">Category</InputLabel>
                <Select
                  id="category"
                  name="category"
                  label="Category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="mindfulness">Mindfulness</MenuItem>
                  <MenuItem value="breathing">Breathing Exercises</MenuItem>
                  <MenuItem value="sleep">Sleep Meditation</MenuItem>
                  <MenuItem value="stress-relief">Stress Relief</MenuItem>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <Typography variant="caption" color="error">{formik.errors.category}</Typography>
                )}
              </FormControl>
              <div className="flex flex-col gap-2">
                <TextField
                  id="image"
                  name="image"
                  type="file"
                  fullWidth
                  label='Image'
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={formik.touched.image && Boolean(formik.errors.image)}
                  helperText={formik.touched.image && formik.errors.image}
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
                {progress.audio > 0 && progress.audio < 100 && (
                  <LinearProgress variant="determinate" value={progress.audio} />
                )}
              </div>
            </div>

            <Box className='flex justify-end' style={{ width: '100%' }}>
              <Button color="primary" variant="contained" type="submit">Add Course</Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Course;
