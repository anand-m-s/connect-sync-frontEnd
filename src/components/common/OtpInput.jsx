import { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';

function OtpInput({
  type = "number",
  length = 4,
  containerClassName,
  inputClassName,
}) {
  //TODO : manage the type of otp
  const [otp, setOtp] = useState(Array(length).fill(""));
// let o =''
//   for(let i=0;i<otp.length;i++){
//     o+=otp[i]
//   }
//   console.log(o)
  
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
    <div className="otp-section border">
      <h1 className="">Enter otp</h1>
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
      <Button variant="contained">Send Otp</Button>
    </div>
    </>
  );
}

export default OtpInput;