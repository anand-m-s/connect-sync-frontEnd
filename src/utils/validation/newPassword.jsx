import * as yup from 'yup';

export const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
};

export const validationSchema = yup.object({
    newPassword: yup.string()
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*#?&])[A-Za-z\d@$%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm New Password is required'),
});
