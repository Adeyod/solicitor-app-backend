import { UserDocument } from '../constants/types';
import User from '../models/user.model';

const findUserByEmail = async (email: string): Promise<UserDocument> => {
  const user = await User.findOne({ email: email });

  return user as UserDocument;
};

const checkEmailAndUsernameUniqueness = async (
  email: string,
  user_name: string
): Promise<UserDocument> => {
  const userExist = await User.findOne({
    $or: [
      { email: email },
      { user_name: { $regex: `^${user_name}$`, $options: 'i' } },
    ],
  });

  return userExist as UserDocument;
};

export { findUserByEmail, checkEmailAndUsernameUniqueness };
