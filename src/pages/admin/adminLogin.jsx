import { Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui'
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
import { validationSchema, initialValues } from '../../utils/validation/loginValidation';
import { userAxios } from '../../constraints/axios/userAxios';
import userApi from '../../constraints/api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserCredentials } from '../../services/redux/slices/userAuthSlice';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';

function Login() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)


  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const submit = async (values) => {
    try {
      
      await new Promise(res => setTimeout(() => { res() }, 500))
  
      const user = await userAxios.post(userApi.loginUser, values)
      console.log(user.data)
      dispatch(setUserCredentials(user.data))
      navigate('/home')
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
        <Toaster richColors/>
        <section className='login-Section border'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <div className='flex justify-center m-5'>
                  <h1 className='text-2xl'>CirleSync</h1>
                </div>

                <Field
                  component={TextField}
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
                    Login
                  </Button>
                </div>                
                <br />

                <div className='' >
                  <p>Dont have an account? <Link className='text-blue-500 ' to={'/'}>Signup</Link></p>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>

    </>
  )
}

export default Login