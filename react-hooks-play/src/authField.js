import React from "react";

import useAuthField from "./useAuthField";

const authField = ({ label, input }) => {
  const { values, handleChange, validations, handleValidation } = useAuthField(
    login
  );

  function login() {
    console.log(values);
  }

  return (
    <div className="field" key="input.name">
      <label className="label">{label}</label>
      <div className="control">
        <input
          className="input"
          type={input.type}
          name={input.name}
          onChange={handleChange}
          value={values[input.name]}
          required={input.required}
        />
        {handleValidation(values[input.name], input.name, input.validRegExp)}
      </div>
    </div>
  );
};
