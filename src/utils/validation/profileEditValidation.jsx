import * as Yup from 'yup';



export const validationSchema = Yup.object({
    userName: Yup.string().required('User name is required'),
    bio: Yup.string().required('Bio is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits')
      .required('Phone is required'),
  });