import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui'
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
import { validationSchema, initialValues } from '../../utils/validation/loginValidation';
import { userAxios } from '../../constraints/axios/userAxios';
import userApi from '../../constraints/api/userApi';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCredentials } from '../../services/redux/slices/userAuthSlice';
import { Toaster, toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { FlipWords } from '../../components/ui/flipWords';
import { motion } from "framer-motion";


function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)

  if (user) {
    return <Navigate to={'/home'} />
  }

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      // console.log(credentialResponse);
      handleGoogleLoginSuccess(credentialResponse);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });


  // const submit =  (values) => {
  //   try {
  //     // await new Promise(res => setTimeout(() => { res() }, 500))
  //     const user = userAxios.post(userApi.loginUser, values)
  //     .then((res)=>{
        
  //     })
  //     // console.log(user.data)
  //     toast.success('Login success')
  //     // await new Promise(res => setTimeout(() => { res() }, 1000))
  //     dispatch(setUserCredentials(user.data))
  //     navigate('/home')
  //   } catch (error) {
  //     if (error.response && error.response.data.error) {
  //       toast.error(error.response.data.error);
  //     }
  //   }

  // }
  const submit = async (values) => {
    try {
      await new Promise(res => setTimeout(() => { res() }, 500))
      const user = await userAxios.post(userApi.loginUser, values)      
      toast.success('Login success')
      await new Promise(res => setTimeout(() => { res() }, 1000))
      dispatch(setUserCredentials(user.data))
      navigate('/home')
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }

  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      // console.log(decoded);
      const res = await userAxios.post(userApi.googleAuth, {
        email: decoded.email,
        userName: decoded.name,
      });
      // console.log(res)
      // console.log(res.data)
      // console.log(res.data.message)
      if (res.status == 200) {
        dispatch(setUserCredentials(res.data))
        navigate('/home')
        // toast.success('Login success')
        toast.promise()
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }

  const handleKeyPress = (event, submitForm) => {
    if(event.key=='Enter'){
      event.preventDefault()
      submitForm()
    }
  }

  return (
    <>
      <Box className='BackgroundGradientAnimation'>
        <BackgroundGradientAnimation />
      </Box>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: .1,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <Box className='loginOuterBox '>
          <Toaster richColors />
          <Paper>
            <section className='login-Section '>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
              >
                {({ submitForm, isSubmitting }) => (
                  <Form onKeyDown={(event) => handleKeyPress(event, submitForm)} >
                    <Box className="flex  justify-around items-center mb-8 ">
                      <img src="OIG4.svg" alt="favicon" className="w-36 h-36 m-0  rounded-xl" />
                      <Box className='m-0 p-0'>
                        <Typography variant="h6" className="text-2xl mt-1">
                          Connect Sync
                        </Typography>
                        <Typography variant="body1" className='flex justify-center mt-1 '>
                          {/* Build */}
                          <FlipWords words={['Connect', 'Grow', 'Network', 'Share', 'Support']} />
                        </Typography>
                      </Box>
                    </Box>

                    <Field
                      component={TextField}
                      name="email"
                      variant='standard'
                      type="email"
                      label="Email"
                      size="small"
                      autoComplete="off"
                      sx={{
                        margin: '.5rem',
                        width: { sm: 250, md: 350 },
                      }}
                    />
                    <br />
                    <Field
                      component={TextField}
                      variant='standard'
                      type="password"
                      label="Password"
                      name="password"
                      size="small"
                      sx={{
                        margin: '.5rem',
                        width: { sm: 250, md: 350 },
                      }}
                    />
                    {isSubmitting && <LinearProgress />}
                    <Box className='loginBtn'>
                      <Button
                        variant="contained"
                        color="primary"
                        size='small'
                        disabled={isSubmitting}
                        onClick={submitForm}
                        sx={{
                          margin: '1rem',
                        }}
                      >
                        Login
                      </Button>
                    </Box>

                    <Box className="flex justify-center items-center">
                      <GoogleLogin
                        size='medium'
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                          console.log('Login Failed');
                        }}
                      />
                    </Box>

                    <br />
                    <Box >
                      <p> <Link className='text-blue-500 ' to={'/forgot'}>Forgot Password?</Link></p>
                    </Box>
                    <Box >
                      <p>Dont have an account? <Link className='text-blue-500 ' to={'/'}>Signup</Link></p>
                    </Box>

                  </Form>
                )}
              </Formik>
            </section>
          </Paper>
        </Box>
      </motion.div>

    </>
  )
}

export default Login