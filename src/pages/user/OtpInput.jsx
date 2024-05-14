import { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { userAxios } from "../../constraints/axios/userAxios";
import userApi from "../../constraints/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserCredentials } from "../../services/redux/slices/userAuthSlice";




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
  console.log(email)

  const selectUser = (state) => state.userAuth.userInfo
  const user = useSelector(selectUser)
  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])


  const handleSubmit = async (e) => {
    e.preventDefault()
    const o = otp.join('')
    const datas = {
      otp: o,
      email: email
    }
    const res = await userAxios.post(userApi.verifyOtp, datas)
    console.log(res)
    console.log(res.data)
    dispatch(setUserCredentials(res.data))
    navigate('/home')
  }
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

  console.log(otp)

  return (
    <>
      <div className="otp-section border rounded-xl  p-10">
        <div className="flex justify-center p-2">

        <h1 className="">Enter otp</h1>
        </div>
        <div className={`flex gap-2 p-4 ${containerClassName}`}>
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
        </div>
        <div className="flex justify-center">

        <Button onClick={handleSubmit} variant="contained">Verify Otp</Button>
        </div>
      </div>
    </>
  );
}

export default OtpInput;