import { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { userAxios } from "../../constraints/axios/userAxios";
import userApi from "../../constraints/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserCredentials } from "../../services/redux/slices/userAuthSlice";
import { Toaster, toast } from 'sonner';
import Paper from '@mui/material/Paper';
import { Box, LinearProgress} from "@mui/material";
import { TextField } from 'formik-mui';
import { Formik, Form, Field,} from 'formik';
import { initialValues,validationSchema } from "../../utils/validation/newPassword";


function OtpInput({
  type = "numeric",
  length = 4,
  containerClassName,
  inputClassName,
}) {
  //TODO : manage the type of otp
  const [otp, setOtp] = useState(Array(length).fill(""));
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const email = queryParams.get("email") || ""
  const userName = queryParams.get("userName") || ""
  const isForgotPassword = queryParams.get('forgotPassword') === 'true';

  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)
  const [timer, setTimer] = useState(60)
  const [resend, setResend] = useState(false)
  const [showInput, setShowInput] = useState(false)

  if (user) {
    return <Navigate to={'/home'} />
  }
  if(!email){
    return <Navigate to={'/login'}/>
  }
  useEffect(() => {
    let countInterval;
    if (timer > 0) {
      countInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResend(true)
    }
    return () => {
      if (countInterval) {
        clearInterval(countInterval);
      }
    };
  }, [timer]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const o = otp.join('')
      const datas = {
        otp: o,
        email: email
      }
      console.log(o)
      if (o.length < 4) {
        return toast.error('Invalid Otp')
      }
      const res = await userAxios.post(userApi.verifyOtp, datas)
      toast.success(res.data.message)
      if (isForgotPassword) {
        setShowInput(true)       
      } else {
        await new Promise(res => setTimeout(() => { res() }, 500))
        dispatch(setUserCredentials(res.data))
        navigate('/home')
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }
  const handleResendOtp = async (e) => {
    try {
      e.preventDefault()
      setResend(false)
      setTimer(60)
      const data = {
        email,
        userName
      }
      const res = await userAxios.post(userApi.resendOtp, data)
      console.log(res.data)
      toast(res.data.message)
    } catch (error) {

      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }
  const handleSubmitForgot = async (values, { setSubmitting }) => {
    try {
      const { newPassword } = values;
      const response = await userAxios.post(userApi.updatePassword, { newPassword,email });
      console.log(response.data)
      toast.success('Password updated successfully');
      await new Promise(res => setTimeout(() => { res() }, 1000))
      console.log('inside handlesubmit forget')
      setShowInput(false)
      navigate('/login');
    } catch (error) {
      toast.error('Error updating password');
    } finally {
      setSubmitting(false);
    }
  };
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const onChange = (e, index) => {
    if (e.target?.value?.length > 1) return;
    setOtp(otp.map((char, i) => (index === i ? e.target.value : char)));
    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleBackspace = (e, i) => {
    if (e.keyCode === 8) {
      if (e.target.nextSibling && e.target.nextSibling.value !== "") {
        return;
      }
      if (e.target.previousSibling) {
        setOtp((otp) => otp.map((char, index) => (index === i ? "" : char)));
        e.target.previousSibling.focus();
        return;
      }
    }
  };
  return (
    <>
      <Toaster richColors />
      {!showInput ? (
        <Paper className="otp-section p-12 rounded-full ">

          <Box className="flex justify-center p-4">
            <h1 className="text-2xl ">Enter Otp</h1>
          </Box>
          <Box className={`flex gap-2 p-4 ${containerClassName}`}>
            {otp.map((char, i) => (
              <input
                key={i}
                value={char}
                type={type}
                maxLength={1}
                onKeyDown={(e) => handleBackspace(e, i)}
                className={`flex h-10 w-10 items-center justify-center border border-gray-300 text-center ${inputClassName}`}
                onChange={(e) => onChange(e, i)}
                ref={i === 0 ? ref : null}
              />
            ))}
          </Box>
          <Box className="flex justify-center">
            <Button onClick={handleSubmit} variant="contained">Verify Otp</Button>
          </Box>
          {!resend ? (<Box>
            <p className="p-2 justify-center items-center flex"> OTP expires in <span className="text-blue-400 text-lg"> 00:{timer}</span></p>
          </Box>) : (
            <Box className="flex m-3 justify-center">
              <Button onClick={handleResendOtp}
                size="small"
                color="warning"
                variant="outlined">
                Resend Otp
              </Button>
            </Box>
          )}

        </Paper>
      ) : (
        <>
           <Paper className='otp-section flex justify-center items-center p-5'>
          <section className='forgotPassword-Section'>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmitForgot}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Box className='flex justify-center m-5'>
                    <h1 className='text-2xl'>Forgot Password</h1>
                  </Box>

                  <Field
                    component={TextField}
                    name="newPassword"
                    type="password"
                    label="New Password"
                    variant="standard"
                    margin="normal"
                    fullWidth
                  />

                  <Field
                    component={TextField}
                    name="confirmNewPassword"
                    type="password"
                    label="Confirm New Password"
                    variant="standard"
                    margin="normal"
                    fullWidth
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
                      Change Password
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </section>
        </Paper>
        </>
      )}


    </>
  );
}

export default OtpInput;