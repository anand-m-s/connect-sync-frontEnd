import { Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui'
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
import { validationSchema, initialValues } from '../../utils/validation/signUpValidation';
import { userAxios } from '../../constraints/axios/userAxios';
import userApi from '../../constraints/api/userApi';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function Signup() {
  const submit = async (values) => {
    try {
      await new Promise(res => setTimeout(() => { res() },500))
      const user = await userAxios.post(userApi.registerUser, values)
      console.log(user.data)
    } catch (error) {
      if(error.response && error.response.data.error){
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
            // onSubmit={(values, { setSubmitting }) => {
            //   setTimeout(() => {
            //     setSubmitting(false);
            //     alert(JSON.stringify(values, null, 2));
            //   }, 500);
            // }}
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
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  size="small"
                  sx={{
                    margin: '.5rem',
                    width: { sm: 250, md: 350 },

                  }}
                />
                <br />
                <Field
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

                />
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
                <br />

                <div className='' >
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