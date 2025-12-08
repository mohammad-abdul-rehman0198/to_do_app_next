"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input = ({ label, className, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-white text-sm">{label}</label>}

      <input
        {...rest}
        className={`w-full bg-[#1f2937] text-white p-3 rounded-[11px] outline-none placeholder:text-sm ${className}`}
      />
    </div>
  );
};

export default Input;
