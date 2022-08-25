const SignUpConfig = {
  formFields: {
    signUp: {
      email: {
        order: 1
      },
      password: {
        order: 2
      },
      confirm_password:{
        order: 3
      },
      given_name: {
        placeholder:'First Name',
        order: 4
      },
      family_name: {
        placeholder:'Last Name',
        order: 5
      },
      phone_number: {
        order: 6
      },
    }
  }
};


export default SignUpConfig;