import * as yup from 'yup';

export const initialValues={
    email: '',
    password: '',
    confirmPassword: '',
    // phone: '',
    userName: ''
  }

export const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
   .string()
   .required('Password is required')
   .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*#?&])[A-Za-z\d@$%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: yup
   .string()
   .oneOf([yup.ref('password'), null], 'Passwords must match'),
  userName: yup.string().required('Username is required'),
  // phone: yup.string().required('Phone number is required').matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid phone number'),
});