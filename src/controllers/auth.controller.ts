import { response } from 'express';
import { PayloadForLoginInput } from '../constants/types';
import {
  logUserIn,
  registerNewUser,
  verifyUserEmail,
} from '../services/auth.service';
import { AppError } from '../utils/app.error';
import catchErrors from '../utils/tryCatch';
import { joiValidation } from '../utils/validation';

const registerUser = catchErrors(async (req, res) => {
  const {
    first_name,
    last_name,
    user_name,
    email,
    phone_number,
    password,
    confirm_password,
  } = req.body;

  const payload = {
    first_name,
    last_name,
    user_name,
    email,
    password,
    phone_number,
    confirm_password,
  };

  const validateInputs = joiValidation(payload, 'register');
  console.log('i want to register user');

  const { success, value } = validateInputs;

  const response = await registerNewUser(value);
  if (!response) {
    throw new AppError('Error registering user.', 400);
  }

  return res.status(201).json({
    message: `${response.first_name}, your registration was successful, check your email for email verification link.`,
    success: true,
  });
});

const emailVerification = catchErrors(async (req, res) => {
  console.log('i want to verify your registration');
  const { user_id, token } = req.query;

  if (typeof user_id !== 'string' || typeof token !== 'string') {
    throw new AppError(
      'Invalid query parameters. User ID and token must be provided as strings.',
      400
    );
  }

  const response = await verifyUserEmail(user_id, token);

  if (!response) {
    throw new AppError('Unable to verify user email.', 400);
  }

  return res.status(200).json({
    message: `${response.first_name}, your email has been verified successfully, Please login to continue.`,
    success: true,
  });
});

const loginUser = catchErrors(async (req, res) => {
  const { login_input, password }: PayloadForLoginInput = req.body;

  const payload = {
    login_input,
    password,
  };

  const validateInputs = joiValidation(payload, 'login');

  const { success, value } = validateInputs;

  const { access, token, ...others } = await logUserIn(value);

  return res
    .cookie('token', token, {
      httpOnly: true,
      sameSite: 'none', // Needed during production or deployment for HTTPS
      secure: true, // Needed during production or deployment for HTTPS
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      message: `${others.first_name}, your login was successful`,
      user: others,
      access,
      success: true,
      status: 200,
    });
});

const forgotPassword = catchErrors(async (req, res) => {});

const resetPassword = catchErrors(async (req, res) => {});

const logoutUser = catchErrors(async (req, res) => {
  res.clearCookie('access_token', { httpOnly: true });
  res.status(200).json({
    message: 'User logged out successfully',
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  emailVerification,
  forgotPassword,
  resetPassword,
};
