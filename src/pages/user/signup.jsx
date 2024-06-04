import { Button, LinearProgress, Paper, Box } from '@mui/material';
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

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)
  if (user) {
    return <Navigate to={'/home'} />
  }

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
      console.log(values)
      await new Promise(res => setTimeout(() => { res() }, 500))
      const response = await userAxios.post(userApi.registerUser, values)
      const data = response.data
      toast.success('registration successfull verify otp now :)')
      console.log(data)
      await new Promise(res => setTimeout(() => { res() }, 500))
      navigate(`/otp?email=${data.user.email}&userName=${data.user.userName}`)
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
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
        profilePic:decoded.picture,
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
  return (
    <>

      <Box className='BackgroundGradientAnimation'>
        <BackgroundGradientAnimation />
      </Box>
      <Box className='loginOuterBox'>
        <Paper>
          <Toaster richColors />

          <section className='login-Section '>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submit}
            // onSubmit={(values, { setSubmitting }) => {
            //   setTimeout(() => {
            //     setSubmitting(false);
            //     alert(JSON.stringify(values, null, 2));
            //   }, 500);
            // }}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Box className='flex justify-center m-5'>
                    <h1 className='text-2xl'>Circle Sync</h1>
                  </Box>
                  <Box className='flex justify-center'>
                    <p>Build</p>
                    <FlipWords words={['Connect', 'Network', 'Share', 'Support']} />
                  </Box>

                  <Field
                    component={TextField}
                    variant='standard'
                    name="email"
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
                    name="userName"
                    type="name"
                    label="User name"
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
                  <br />
                  <Field
                    component={TextField}
                    variant='standard'
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    size="small"
                    sx={{
                      margin: '.5rem',
                      width: { sm: 250, md: 350 },
                    }}
                  />
                  {/* <Field
                  component={TextField}
                  type="text"
                  label="Phone"
                  name="phone"
                  size="small"
                  autoComplete="off"
                  sx={{
                    margin: '.5rem',
                    width: { sm: 250, md: 350 },
                    
                  }}
                  
                /> */}
                  {isSubmitting && <LinearProgress />}
                  <br />
                  <Box className='loginBtn'>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      sx={{
                        margin: '1rem',
                      }}
                    >
                      Sign Up
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

                  <Box className='mt-3' >
                    <p>Have an account? <Link className='text-blue-500' to={'/login'}> Login</Link></p>
                  </Box>
                </Form>
              )}
            </Formik>
          </section>
        </Paper>
      </Box>

    </>
  )
}
export default Signup