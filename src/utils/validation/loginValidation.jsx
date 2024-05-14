import * as yup from 'yup';

export const initialValues={
    email: '',
    password: '',
  }

export const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
   .string()
   .required('Password is required'), 
});