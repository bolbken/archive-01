import { useState } from "react";

const useField = callback => {
  const [values, setValues] = useState({});
  const [validations, setValidations] = useState({});

  const handleChange = event => {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  const handleValidation = (value, name, validRegEx, callback) => {
    if (validRegEx.test(value)) {
      setValidations(validations => ({
        ...validations,
        [name]: true
      }));
    } else {
      setValidations(validations => ({
        ...validations,
        [name]: false
      }));

      return <div>Please enter a valid {name}.</div>;
    }
  };

  return {
    handleChange,
    handleValidation,
    values,
    validations
  };
};

export default useField;
