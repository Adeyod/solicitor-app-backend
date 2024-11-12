import { NextFunction, Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';
import { MemberRole } from '../utils/enumModules';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

type UserObj = {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
};

type EmailType = {
  email: string;
  first_name: string;
  link: string;
};

type PayloadForLoginInput = {
  login_input: string;
  password: string;
};

type TokenSearchType = {
  user_id?: object;
  purpose: string;
  token?: string;
};

type PayloadWithoutPassword = Omit<UserDocument, 'password'>;

type LoginParams = PayloadWithoutPassword & {
  access: string;
  token: string;
};

type ComparePassType = {
  password: string;
  confirm_password: string;
};

type UserDocument = UserObj & {
  role: string;
  is_verified: boolean;
};

type UserInJwt = {
  userId: string;
  userEmail: string;
  iat: number;
  exp: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserInJwt;
    }
  }
}

type ValidateProp = {
  case_title: string;
  description: string;
};

type CaseCreationPayload = ValidateProp & {
  client: Types.ObjectId;
  lawyer_in_charge: Types.ObjectId;
  documents: CloudinaryType | CloudinaryType[];
  case_type: string;
};

type CaseCreationProp = CaseCreationPayload & {
  id: Types.ObjectId;
  court_details?: {
    court_name: string;
    address: string;
    judge: string;
  };
};

type CloudinaryType = { url: string; public_id: string } | undefined;
type FilePath = string;
type FolderName = string;

type DocumentType = {
  url: string;
  public_url: string;
};

interface ICase extends Document {
  case_title: string;
  case_type: string;
  case_number: string;
  status: string;
  client: mongoose.Types.ObjectId;
  lawyer_in_charge: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  description?: string;
  documents: DocumentType[]; // Array of documents with only `url` and `public_url`
  court_details?: {
    court_name: string;
    address: string;
    judge: string;
  };
}

interface IUser extends Document {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  is_verified: boolean;
  phone_number: string;
  role: MemberRole;
  createdAt: Date;
  updatedAt: Date;
}

type IUserDocument = IUser & Document;

export {
  IUserDocument,
  IUser,
  ICase,
  CloudinaryType,
  FilePath,
  FolderName,
  CaseCreationPayload,
  ValidateProp,
  UserInJwt,
  LoginParams,
  UserDocument,
  AsyncHandler,
  UserObj,
  PayloadForLoginInput,
  ComparePassType,
  EmailType,
  TokenSearchType,
  CaseCreationProp,
};
