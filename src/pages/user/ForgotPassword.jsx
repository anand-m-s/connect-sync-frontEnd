// import { Box, Button, LinearProgress, Paper } from '@mui/material';
// import { Formik, Form, Field } from 'formik';
// import { TextField } from 'formik-mui';
// import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation';
// import { validationSchema, initialValues } from '../../utils/validation/forgotPasswordValidation';
// import { userAxios } from '../../constraints/axios/userAxios';
// import userApi from '../../constraints/api/userApi';
// import { Link, useNavigate } from 'react-router-dom';
// import { Toaster, toast } from 'sonner';

// function ForgotPassword() {

//     const navigate = useNavigate()
//     const submit = async (values) => {
//         try {
//           console.log(values);
//           await new Promise((res) => setTimeout(() => { res() }, 500));
//           const response = await userAxios.post(userApi.forgotPassword, values);
//           const data = response.data;
//           if(data.message=='verify otp now'){
//             toast.success(data.message)
//               await new Promise((res) => setTimeout(() => { res() }, 500));          
//               navigate(`/otp?email=${data.email}&userName=${data.userName}&forgotPassword=true`);
//           }else{
//             toast(data.message)
//           }         
//         } catch (error) {
//           if (error.response && error.response.data.error) {
//             toast.error(error.response.data.error);
//           }
//         }
//       };

//   return (
//     <>    
//       <Box className='otp-section'>
//         <Toaster richColors />
//         <Paper className='flex justify-center items-center p-5'>
//           <section className='forgotPassword-Section'>
//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={submit}
//             >
//               {({ submitForm, isSubmitting }) => (
//                 <Form>
//                   <Box className='flex justify-center m-5'>
//                     <h1 className='text-2xl'>Forgot Password</h1>
//                   </Box>

//                   <Field
//                     component={TextField}
//                     name="email"
//                     variant='standard'
//                     type="email"
//                     label="Email"
//                     size="small"
//                     autoComplete="off"
//                     sx={{
//                       margin: '.5rem',
//                       width: { sm: 250, md: 350 },
//                     }}
//                   />
//                   {isSubmitting && <LinearProgress />}
//                   <Box className='forgotPasswordBtn'>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       size='small'
//                       disabled={isSubmitting}
//                       onClick={submitForm}
//                       sx={{
//                         margin: '1rem',
//                       }}
//                     >
//                       Submit
//                     </Button>
//                   </Box>
//                   <Box>
//                     <p>Remembered your password? <Link className='text-blue-500' to={'/login'}>Login</Link></p>
//                   </Box>
//                 </Form>
//               )}
//             </Formik>
//           </section>
//         </Paper>
//       </Box>
//     </>
//   );
// }

// export default ForgotPassword;

import { Box, Button, LinearProgress, Paper } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { validationSchema, initialValues } from '../../utils/validation/forgotPasswordValidation';
import { userAxios } from '../../constraints/axios/userAxios';
import userApi from '../../constraints/api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function ForgotPassword() {
  const navigate = useNavigate();

  const submit = async (values) => {
    try {
      console.log('Submitting values:', values);
      await new Promise((res) => setTimeout(() => { res() }, 500));
      const response = await userAxios.post(userApi.forgotPassword, values);
      const data = response.data;
      console.log('API response data:', data);

      if (data.message == 'Verify OTP now') {
        toast.success(data.message);
        await new Promise((res) => setTimeout(() => { res() }, 500));
        navigate(`/otp?email=${data.email}&userName=${data.userName}&forgotPassword=true`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <>
    <Toaster richColors />
      <Box className='otp-section'>
        <Paper className='flex justify-center items-center p-5'>
          <section className='forgotPassword-Section'>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submit}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Box className='flex justify-center m-5'>
                    <h1 className='text-2xl'>Forgot Password</h1>
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
                  {isSubmitting && <LinearProgress />}
                  <Box className='forgotPasswordBtn'>
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
                      Submit
                    </Button>
                  </Box>
                  <Box>
                    <p>Remembered your password? <Link className='text-blue-500' to={'/login'}>Login</Link></p>
                  </Box>
                </Form>
              )}
            </Formik>
          </section>
        </Paper>
      </Box>
    </>
  );
}

export default ForgotPassword;

