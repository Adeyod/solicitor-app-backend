import mongoose from 'mongoose';
import { ValidateProp } from '../constants/types';
import { caseDocumentsUpload } from '../repository/case.repository';
import {
  createNewCase,
  fetchAllCases,
  fetchCaseDetails,
} from '../services/case.service';
import { AppError } from '../utils/app.error';
import catchErrors from '../utils/tryCatch';
import { joiValidation } from '../utils/validation';
import { getUserProfile } from './user.controller';
import { fetchUserDetails } from '../services/user.services';

const createCase = catchErrors(async (req, res) => {
  const parseBody = JSON.parse(req.body.info);
  const { case_title, case_type, client, lawyer_in_charge, description } =
    parseBody;

  console.log(
    'CONTROLLER:',
    case_title,
    case_type,
    client,
    lawyer_in_charge,
    description
  );

  const inputToValidate: ValidateProp = {
    case_title,
    description,
  };
  console.log('CONTROLLER:', req.files);
  console.log('CONTROLLER:', req.file);

  const { success, value } = joiValidation(inputToValidate, 'case-creation');

  const uploadCaseDocuments = await caseDocumentsUpload(req, res);

  const payload = {
    case_title,
    case_type,
    client,
    lawyer_in_charge,
    description,
    documents: uploadCaseDocuments,
  };
  const response = await createNewCase(payload);

  if (!response) {
    throw new AppError('Unable to create new case.', 400);
  }

  return res.status(200).json({
    message: 'Case created successfully',
    success: true,
    case: response,
  });
});

const getAllCases = catchErrors(async (req, res) => {
  const user = req.user?.userId;

  console.log('user', user);

  console.log('i am getting all cases');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const searchQuery =
    typeof req.query.searchParams === 'string' ? req.query.searchParams : '';

  if (!user) {
    throw new AppError('Please login to access this resource.', 401);
  }

  const result = await fetchAllCases(page, limit, searchQuery);

  if (!result) {
    throw new AppError('No cases found.', 404);
  }

  return res.status(200).json({
    message: 'Cases fetched successfully',
    cases: result,
    success: true,
  });
});

const getASingleCase = catchErrors(async (req, res) => {
  const { caseId } = req.params;
  const user = req.user?.userId;

  console.log(caseId);
  if (!caseId) {
    throw new AppError('Case ID not specified', 404);
  }

  if (!user) {
    return null;
  }

  const userDetails = await fetchUserDetails(user);
  const response = await fetchCaseDetails(caseId);
  if (
    userDetails.role === 'lawyer' &&
    userDetails._id !== response.lawyer_in_charge._id
  ) {
    throw new AppError(
      'You can only access a case details that you are the lawyer in charge.',
      401
    );
  }

  return res.status(200).json({
    message: 'Case details fetched successfully',
    success: true,
    case: response,
  });
});

const updateCase = catchErrors(async (req, res) => {});

const deleteCase = catchErrors(async (req, res) => {});

const getClientCases = catchErrors(async (req, res) => {});

const getCasesByLawyerId = catchErrors(async (req, res) => {});

const uploadCaseDocuments = catchErrors(async (req, res) => {});

// const seedUser = async (num: number) => {
//   try {
//     await connectDB;

//     const users = generateUsers(num);
//     await User.insertMany(users);

//     mongoose.connection.close();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedUser(90);

// const seedCases = async (num: number) => {
//   try {
//     await connectDB;

//     const cases = await generateCases(num);

//     await Case.insertMany(cases);
//     console.log(`${num} cases added to the database successfully.`);

//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error seeding the database:', error);
//     process.exit(1);
//   }
// };

// seedCases(45);

export {
  createCase,
  getAllCases,
  getASingleCase,
  updateCase,
  deleteCase,
  getClientCases,
  getCasesByLawyerId,
  uploadCaseDocuments,
};
