import React, { useState, useRef, useEffect } from "react";
import "tailwindcss/tailwind.css";

const OTPInput = ({ length, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    onChange(otp.join(""));
  }, [otp, onChange]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          type="text"
          className="w-12 h-12 text-center text-lg border border-gray-600 rounded bg-[#161618] focus:outline-black"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
