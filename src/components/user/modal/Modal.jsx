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
import {addUserPost} from '../../../services/redux/slices/userAuthSlice'



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
  const {modals,handleClose} = useModal()
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
      <Toaster richColors/>
      <Modal
        // open={open}
        // onClose={handleClose}
        open={modals.create}
        onClose={()=>handleClose('create')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="rounded-lg">
          <Box className='mb-1 flex rounded-xl p-2 justify-between items-center'>
            {nextPage && (
              <IconButton onClick={handleNextPage} color="primary">
                <ArrowBackIosIcon fontSize='medium' sx={{ cursor: 'pointer' }} />
              </IconButton>
            )}
            <div className='flex justify-center items-center flex-grow'>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create new post
              </Typography>
            </div>
            <div >
              {!nextPage ? <IconButton onClick={handleNextPage} color="primary">
                <ArrowForwardIosIcon fontSize='medium' />
              </IconButton> : <Button
                color="secondary"
                variant="outlined"
                size='small'
                onClick={() => formRef.current.click()}
              >
                post
              </Button>}
            </div>
          </Box>
          <hr />
          <Formik>
            {({ submitForm, isSubmitting }) => (
              <Form onSubmit={formik.handleSubmit}>
                <Box>
                  {nextPage &&
                    <Stack direction='column' className=' flex justify-center items-center border  p-2'>
                      <Item elevation={0}>
                        <TextField
                          fullWidth
                          id="location"
                          variant='outlined'
                          name="location"
                          label="Location"
                          value={formik.values.location}
                          onChange={formik.handleChange}
                          error={formik.touched.location && Boolean(formik.errors.location)}
                          helperText={formik.touched.location && formik.errors.location}
                          margin="normal"
                        />
                        <TextField
                          variant='outlined'
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
                         
                    </Stack>}
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={inputRef}
                    onChange={handleImageChange}
                  />
                  <div>
                    {!nextPage && (
                      !formik.values.images.length ? (
                        <div elevation={0} onClick={handleImageClick} className='flex justify-center items-center m-12 cursor-pointer'>
                          <h3>Click here to upload</h3>
                          <img src="data:image/jpeg;base64,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" alt="" />
                        </div>
                      ) : (
                        <div className='p-2 flex justify-end cursor-pointer' onClick={handleImageClick}>
                          <p className='p-2'>choose files</p>
                          <img width='50px' height='50px' src="data:image/jpeg;base64,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" alt="" />
                        </div>
                      )
                    )}
                  </div>
                  <div className='flex justify-center items-center'>

                    {formik.errors.images && <Typography color="error">{formik.errors.images}</Typography>}
                  </div>
                </Box>
                <Stack direction="row" spacing={1} >
                  {formik.values.images && formik.values.images.map((image, index) => (
                    <Item key={index} elevation={0}>
                      <img className='rounded-lg'
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        width="250"
                        height="250"
                        style={{ marginRight: '10px', objectFit: 'cover' }}
                      />
                      {<Typography>{image.name}</Typography>}
                    </Item>
                  ))}
                </Stack>
                {loading && <LinearProgress />}
                {nextPage && <Button
                  sx={{ display: 'none' }}
                  disabled={isSubmitting}
                  ref={formRef}
                  onClick={submitForm}
                  color="secondary"
                  variant="contained"
                  type="submit"
                  size='small'
                >
                  post
                </Button>}
              </Form>
            )}
          </Formik>
        </Box >
      </Modal >
    </>

  );
}
