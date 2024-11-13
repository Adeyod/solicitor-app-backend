import {
  LoginParams,
  PayloadForLoginInput,
  UserDocument,
  UserObj,
} from '../constants/types';
import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  checkEmailAndUsernameUniqueness,
} from '../repository/user.repository';
import { AppError } from '../utils/app.error';
import User from '../models/user.model';
import Token from '../models/token.model';
import crypto from 'crypto';
import { VerificationCodeType } from '../constants/enumTypes';
import { sendEmailVerification } from '../utils/nodemailer';
import { findToken } from '../repository/token.repository';
import { generateAccessToken } from '../middleware/jwtAuth';
import { allowedEmails } from '../utils/enumModules';

const registerNewUser = async (payload: UserObj) => {
  const { first_name, last_name, user_name, email, password, phone_number } =
    payload;

  const trimmedEmail = email.trim();
  const trimmedUserName = user_name.trim();
  const trimmedFirstName = first_name.trim();
  const trimmedLastName = last_name.trim();
  const trimmedPassword = password.trim();

  const existingUser = await checkEmailAndUsernameUniqueness(
    trimmedEmail,
    trimmedUserName
  );

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

  const role = allowedEmails.includes(trimmedEmail) ? 'admin' : undefined;

  const newUser = await new User({
    first_name: trimmedFirstName,
    last_name: trimmedLastName,
    user_name: trimmedUserName,
    password: hashedPassword,
    email: trimmedEmail,
    phone_number,
    role: role,
  }).save();

  if (!newUser) {
    throw new AppError('Unable to create new user.', 400);
  }

  const token =
    crypto.randomBytes(8).toString('hex') +
    crypto.randomBytes(8).toString('hex');

  const newToken = await new Token({
    user_id: newUser._id,
    token,
    purpose: VerificationCodeType.EmailVerification,
  }).save();

  const link = `${process.env.FRONTEND_URL}/email-verification?user_id=${newUser._id}&token=${newToken.token}`;

  await sendEmailVerification({
    email: newUser.email,
    first_name: newUser.first_name,
    link,
  });

  return newUser;
};

const verifyUserEmail = async (
  user_id: string,
  token: string
): Promise<UserDocument> => {
  const getToken = await Token.findOne({
    user_id: user_id,
    token,
  });

  if (!getToken) {
    throw new AppError('Token not found.', 404);
  }

  const updateUser = await User.findByIdAndUpdate(
    { _id: user_id },
    { $set: { is_verified: true } },
    { new: true }
  );

  if (!updateUser) {
    throw new AppError('Unable to verify email address.', 400);
  }

  await getToken.deleteOne();

  return updateUser;
};

const logUserIn = async (
  payload: PayloadForLoginInput
): Promise<LoginParams> => {
  const { login_input, password } = payload;

  const userExist = await User.findOne({
    $or: [
      { email: login_input },
      { user_name: { $regex: `^${login_input}$`, $options: 'i' } },
    ],
  });

  if (!userExist) {
    throw new AppError('Invalid credentials.', 404);
  }

  const validatePassword = await bcrypt.compare(password, userExist.password);

  if (!validatePassword) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!userExist.is_verified) {
    const activeTokenResult = await findToken({
      user_id: userExist._id,
      purpose: VerificationCodeType.EmailVerification,
    });

    let link;
    if (!activeTokenResult) {
      const token =
        crypto.randomBytes(8).toString('hex') +
        crypto.randomBytes(8).toString('hex');

      const newToken = await new Token({
        user_id: userExist._id,
        token,
        purpose: VerificationCodeType.EmailVerification,
      }).save();

      link = `${process.env.FRONTEND_URL}/email-verification?user_id=${userExist._id}&token=${newToken.token}`;
    } else {
      link = `${process.env.FRONTEND_URL}/email-verification?user_id=${userExist._id}&token=${activeTokenResult.token}`;
    }

    await sendEmailVerification({
      email: userExist.email,
      first_name: userExist.first_name,
      link,
    });

    throw new AppError(
      'Email verification required. Verification link sent.',
      403
    );
  } else {
    const access_token = await generateAccessToken(
      userExist._id.toString(),
      userExist.email
    );
    const { token, access } = access_token;

    const { password: hashValue, ...others } = userExist.toObject(); // Ensure `toObject()` if needed to strip Mongoose document properties

    const user_access = {
      ...others,
      token,
      access,
    };

    return user_access as LoginParams;
  }
};

export { registerNewUser, verifyUserEmail, logUserIn };
