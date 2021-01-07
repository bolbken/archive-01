export default (authFormSignInConfig = {
  fields: {
    email: {
      label: "Email:",
      input: {
        type: "email",
        name: "email",
        required: true,
        validRegExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      }
    },
    password: {
      label: "Password:",
      input: {
        type: "password",
        name: "password",
        required: true,
        validRegExp: /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
      }
    }
  }
});
