import React from 'react';
import Box from '@mui/material/Box';
import { Button, LinearProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useModal } from '../../../context/modalContext';
import { useFormik, Form, Formik } from 'formik';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';
import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import { userAxios } from '../../../constraints/axios/userAxios';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImages } from '../../../constraints/axios/imageUpload';
import userApi from '../../../constraints/api/userApi';
import { initialValues, validationSchema } from '../../../utils/validation/postValidation';
import { Toaster, toast } from 'sonner';
import { addUserPost } from '../../../services/redux/slices/userAuthSlice'



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))



export default function BasicModal() {

  const user = useSelector((state) => state.userAuth.userInfo)

  const inputRef = useRef(null)
  const formRef = useRef(null)
  // const { open, handleClose } = useModal();

  const { modals, handleClose } = useModal()
  const [nextPage, setNextPage] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleNextPage = () => {
    if (!formik.values.images.length) {
      formik.setFieldError('images', 'At least one image is required');
      return;
    }
    setNextPage(!nextPage);
  };

  const userId = user.id
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true)
        const uploadedImageUrls = await uploadImages(values.images);
        console.log("Uploaded Image URLs:", uploadedImageUrls[0])
        console.log(values.location, values.description)
        const data = {
          userId,
          location: values.location,
          description: values.description,
          imageUrl: uploadedImageUrls
        }
        console.log(data)
        const res = await userAxios.post(userApi.savePost, data)
        console.log(res)
        console.log(res.data)
        toast.success(res.data.message)
        dispatch(addUserPost(res.data.message))
        setNextPage(false)
        resetForm()
        setLoading(false)
        handleClose('create')
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(error)
      }
    },
  });

  const handleImageChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    formik.setFieldValue('images', files);
  };

  const handleImageClick = () => {
    inputRef.current.click()
  }

  return (
    <>
      <Toaster richColors />


      <Modal
        open={modals.create}
        onClose={() => handleClose('create')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: { xs: '90%', sm: '80%', md: '60%', lg: '40%' },
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            mx: 'auto',
            my: { xs: '10%', sm: '5%' },
            overflow: 'auto',
            maxHeight: '90vh',
          }}
          className="rounded-lg"
        >
          <Box className="mb-1 flex rounded-xl p-2 justify-between items-center">
            {nextPage && (
              <IconButton onClick={handleNextPage} color="primary">
                <ArrowBackIosIcon fontSize="medium" sx={{ cursor: 'pointer' }} />
              </IconButton>
            )}
            <div className="flex justify-center items-center flex-grow">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new post
              </Typography>
            </div>
            <div>
              {!nextPage ? (
                <IconButton onClick={handleNextPage} color="primary">
                  <ArrowForwardIosIcon fontSize="medium" />
                </IconButton>
              ) : (
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  onClick={() => formRef.current.click()}
                >
                  Post
                </Button>
              )}
            </div>
          </Box>
          <hr />
          <Formik>
            {({ submitForm, isSubmitting }) => (
              <Form onSubmit={formik.handleSubmit}>
                <Box>
                  {nextPage && (
                    <Stack direction="column" className="flex justify-center items-center  p-2">
                      <Item elevation={0}>
                        <TextField
                          fullWidth
                          id="location"
                          variant="outlined"
                          name="location"
                          label="Location"
                          value={formik.values.location}
                          onChange={formik.handleChange}
                          error={formik.touched.location && Boolean(formik.errors.location)}
                          helperText={formik.touched.location && formik.errors.location}
                          margin="normal"
                        />
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="description"
                          name="description"
                          label="Description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          error={formik.touched.description && Boolean(formik.errors.description)}
                          helperText={formik.touched.description && formik.errors.description}
                          margin="normal"
                        />
                      </Item>
                    </Stack>
                  )}
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={inputRef}
                    onChange={handleImageChange}
                  />
                  <div>
                    {!nextPage && !formik.values.images.length ? (
                      <div
                        elevation={0}
                        onClick={handleImageClick}
                        className="flex justify-center items-center m-12 cursor-pointer"
                      >
                        <Typography variant='body2' className='p-4'>Click here to upload</Typography>
                        <img src="imageUpload.svg" className='w-48 h-48' alt="imageUpload" />
                      </div>
                    ) : (
                      <div className="p-2 flex justify-end cursor-pointer" onClick={handleImageClick}>
                        <p className="p-2">Choose files</p>
                        <img width="50px" height="50px" src="imageUpload.svg" alt="imageUpload" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    {formik.errors.images && <Typography color="error">{formik.errors.images}</Typography>}
                  </div>
                </Box>
                <Stack direction="row" spacing={1}>
                  {formik.values.images &&
                    formik.values.images.map((image, index) => (
                      <Item key={index} elevation={0}>
                        <img
                          className="rounded-lg"
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index}`}
                          width="250"
                          height="250"
                          style={{ marginRight: '10px', objectFit: 'cover' }}
                        />
                        <Typography>{image.name}</Typography>
                      </Item>
                    ))}
                </Stack>
                {loading && <LinearProgress />}
                {nextPage && (
                  <Button
                    sx={{ display: 'none' }}
                    disabled={isSubmitting}
                    ref={formRef}
                    onClick={submitForm}
                    color="secondary"
                    variant="contained"
                    type="submit"
                    size="small"
                  >
                    Post
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

    </>

  );
}
