"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-white text-sm">{label}</label>}

      <input
        {...rest}
        className="w-full bg-[#1f2937] text-white p-3 rounded-[11px] outline-none border-none placeholder:text-sm"
      />
    </div>
  );
};

export default Input;
