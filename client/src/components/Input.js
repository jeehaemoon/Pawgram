import React from "react";

const Input = ({ name, type, placeholder, handleChange, value }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={(ev) => handleChange(ev.target.value, name)}
    />
  );
};

export default Input;
