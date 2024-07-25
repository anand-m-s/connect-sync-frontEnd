import { Box, Button, LinearProgress, Paper, useTheme } from '@mui/material';
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
  const theme = useTheme()

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

      <Toaster richColors />
      <Box className='BackgroundGradientAnimation' sx={{ height: '100vh' }}>
        <BackgroundGradientAnimation />
      </Box>
      <Box className="flex items-center justify-center min-h-screen"
        sx={{ position: 'relative', zIndex: 10 }}
      >
        <Paper sx={{ padding: '2rem', background: theme => theme.palette.background.paper }}>
          <section className=''>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submit}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Box className="flex justify-center m-5">
                    <h1 className="text-2xl">Admin Login</h1>
                  </Box>
                  <Field
                    component={TextField}
                    name="email"
                    type="email"
                    label="Email"
                    size="small"
                    autoComplete="off"
                    sx={{
                      margin: '.5rem',
                      width: { sm: 250, md: 350 }
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
                      width: { sm: 250, md: 350 }
                    }}
                  />
                  {isSubmitting && <LinearProgress />}
                  <Box className="loginBtn">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                      sx={{
                        margin: '1rem'
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                  <br />
                </Form>
              )}
            </Formik>
          </section>
        </Paper>
      </Box>
    </>
  );
}

export default Login;
