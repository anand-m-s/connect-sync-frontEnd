import * as yup from 'yup';

export const initialValues={
    email: '',    
  }

export const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});