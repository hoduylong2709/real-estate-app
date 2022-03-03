import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .required('Password is required')
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email address is required')
});

export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Please enter a valid password')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Please enter a valid password')
    .required('Please confirm password')
    .oneOf([yup.ref('password'), null], 'Confirm password must match with password')
});

export const changeMyPasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Please enter a valid new password')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Please enter a valid confirm password')
    .required('Please confirm new password')
    .oneOf([yup.ref('newPassword'), null], 'Confirm password must match with new password')
});

export const signupValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required!'),
  lastName: yup
    .string()
    .required('Last name is required!'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Please enter a valid password')
    .required('Password is required')
});

export const profileValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required!'),
  lastName: yup
    .string()
    .required('Last name is required!'),
  phoneNumber: yup
    .number()
});