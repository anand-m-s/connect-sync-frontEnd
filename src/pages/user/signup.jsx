import { Button, LinearProgress, Paper, Box, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui'
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
import { validationSchema, initialValues } from '../../utils/validation/signUpValidation';
import { userAxios } from '../../constraints/axios/userAxios';
import userApi from '../../constraints/api/userApi';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { setUserCredentials } from '../../services/redux/slices/userAuthSlice';
import { FlipWords } from '../../components/ui/flipWords';
import { motion } from "framer-motion";
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)
  if (user) {
    return <Navigate to={'/home'} />
  }
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
      handleGoogleLoginSuccess(credentialResponse);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });


  const submit = async (values) => {
    try {
      await new Promise(res => setTimeout(() => { res() }, 500))
      const response = await userAxios.post(userApi.registerUser, values)
      const data = response.data
      toast.success('registration successfull verify otp now :)')
      console.log(data)
      await new Promise(res => setTimeout(() => { res() }, 500))
      navigate(`/otp?email=${data.user.email}&userName=${data.user.userName}`)
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error.response)
        toast.error(error.response.data.message);
      }
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      console.log(decoded);
      const res = await userAxios.post(userApi.googleAuth, {
        email: decoded.email,
        userName: decoded.name,
        profilePic: decoded.picture,
      });
      console.log(res.data)
      dispatch(setUserCredentials(res.data))
      if (res.status == 200) {
        toast.success(res.data.message)
        navigate('/home')
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }

  const handleKeyPress = (event, submitForm) => {
    if (event.key == 'Enter') {
      console.log('enter')
      event.preventDefault();
      submitForm();
    }
  }
  return (
    <>

      {!isSmallScreen && (
        <Box className='BackgroundGradientAnimation'>
          <BackgroundGradientAnimation />
        </Box>
      )}
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center "
      >
        {/* <Box className='flex items-center justify-center my-10'> */}
        <Box className={`flex justify-center items-center ${isSmallScreen ? 'w-full h-full p-2 mt-10' : 'mt-12 '}`}>
        <Paper className={`w-full max-w-md  ${!isSmallScreen ? 'p-14' : ''}`} elevation={0}>
            <Toaster richColors />
            <section>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submit}
              >
                {({ submitForm, isSubmitting }) => (
                  <Form onKeyDown={(event) => handleKeyPress(event, submitForm)}>
                    <Box className="flex flex-col sm:flex-row justify-around items-center ">
                      <img src="OIG4.svg" alt="favicon" className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl" />
                      <Box className="mt-4 sm:mt-0">
                        <Typography variant="h6" className="text-xl sm:text-2xl">
                          Connect Sync
                        </Typography>
                        <Typography variant="body1" className="mt-1">
                          Build <FlipWords words={['Connect', 'Network', 'Share', 'Support']} />
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="flex flex-col items-center gap-3 mt-3">
                      <Field
                        component={TextField}
                        variant='standard'
                        name="email"
                        type="email"
                        label="Email"
                        size="small"
                        autoComplete="off"
                        className=" w-60 sm:w-80 "
                        sx={{
                          margin: '.5rem',
                          width: { xs: '90%', sm: 250, md: 350 },
                        }}
                      />
                      <Field
                        component={TextField}
                        variant='standard'
                        name="userName"
                        type="name"
                        label="User name"
                        size="small"
                        autoComplete="off"
                        className=" w-60 sm:w-80"
                        sx={{
                          margin: '.5rem',
                          width: { xs: '90%', sm: 250, md: 350 },
                        }}
                      />
                      <Field
                        component={TextField}
                        variant='standard'
                        type="password"
                        label="Password"
                        name="password"
                        size="small"
                        className=" w-60 sm:w-80"
                        sx={{
                          margin: '.5rem',
                          width: { xs: '90%', sm: 250, md: 350 },
                        }}
                      />
                      <Field
                        component={TextField}
                        variant='standard'
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        size="small"
                        className=" w-60 sm:w-80"
                        sx={{
                          margin: '.5rem',
                          width: { xs: '90%', sm: 250, md: 350 },
                        }}
                      />
                    </Box>

                    {isSubmitting && <LinearProgress className="my-2" />}

                    <Box className="flex justify-center mt-6">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                        size='small'
                      >
                        Sign Up
                      </Button>
                    </Box>

                    <Box className="flex justify-center items-center  mt-3">
                      <GoogleLogin
                        size='medium'
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => {
                          console.log('Login Failed');
                        }}
                      />
                    </Box>

                    <Box className="text-center text-sm mt-4">
                      <p>Have an account? <Link className="text-blue-500" to={'/login'}>Login</Link></p>
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
export default Signup