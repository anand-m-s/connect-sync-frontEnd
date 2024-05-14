import { Button, LinearProgress } from '@mui/material';
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
      await new Promise(res => setTimeout(() => { res() }, 500))
      navigate(`/otp?email=${data.user.email}`)
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

      <div className='BackgroundGradientAnimation'>
        <BackgroundGradientAnimation />
      </div>
      <div className='loginOuterBox'>
        <Toaster richColors />
        <section className='login-Section border'>
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
                <div className='flex justify-center m-5'>
                  <h1 className='text-2xl'>CirleSync</h1>
                </div>

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
                <div className='loginBtn'>
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
                </div>
                <div className="flex justify-center items-center">
                  <GoogleLogin
                    size='medium'
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>

                <div className='mt-3' >
                  <p>Have an account? <Link className='text-blue-500' to={'/login'}> Login</Link></p>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>

    </>
  )
}
export default Signup