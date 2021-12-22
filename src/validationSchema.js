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