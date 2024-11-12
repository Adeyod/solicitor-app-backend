import mongoose from 'mongoose';
import { memberRole } from '../utils/enumModules';
import { IUser } from '../constants/types';

const userSchema = new mongoose.Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
    phone_number: { type: String, required: true },
    role: { type: String, enum: memberRole, default: memberRole[0] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
