import { Button, LinearProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
import { validationSchema, initialValues } from '../../utils/validation/loginValidation';
import { adminAxios } from '../../constraints/axios/adminAxios';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminCredentials } from '../../services/redux/slices/adminAuthSlice';
import { Toaster, toast } from 'sonner';
import adminApi from '../../constraints/api/adminApi';
import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectAdmin = (state) => state.adminAuth.adminInfo;
  const admin = useSelector(selectAdmin);
  console.log(admin)

  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const submit = async (values) => {
    try {
      await new Promise(res => setTimeout(() => { res() }, 500));
      const response = await adminAxios.post(adminApi.adminLogin, values);
      const adminData = response.data;
      console.log('Admin data:', adminData);
      dispatch(setAdminCredentials(adminData));
      navigate('/admin');
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  };

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
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </>
  );
}

export default Login;