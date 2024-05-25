import * as Yup from 'yup';

export const  initialValues= {
    location: '',
    description: '',
    images: [],
  }
 

  export const validationSchema = Yup.object({
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'At least one image is required').required('Images are required')
  });