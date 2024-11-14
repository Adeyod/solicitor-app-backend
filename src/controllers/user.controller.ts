import {
  fetchClientDetails,
  fetchClients,
  fetchLawyers,
  fetchWorkers,
  fetchUserDetails,
} from '../services/user.services';
import { AppError } from '../utils/app.error';
import catchErrors from '../utils/tryCatch';

const getAllWorkers = catchErrors(async (req, res) => {
  const user = req.user?.userId;

  console.log('i am getting all workers');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const searchQuery =
    typeof req.query.searchParams === 'string' ? req.query.searchParams : '';

  if (!user) {
    throw new AppError('Please login to access this resource.', 401);
  }

  const result = await fetchWorkers(page, limit, searchQuery);

  if (!result) {
    throw new AppError('No worker found.', 404);
  }

  const disStructuredWorkers = result.result.map(({ password, ...others }) => {
    return others;
  });

  const dataToSend = {
    workers: disStructuredWorkers,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
  };

  return res.status(200).json({
    message: 'Workers fetched successfully',
    workers: dataToSend,
    success: true,
  });
});

const getAllClients = catchErrors(async (req, res) => {
  const user = req.user?.userId;

  console.log('i am getting all clients');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const searchQuery =
    typeof req.query.searchParams === 'string' ? req.query.searchParams : '';

  if (!user) {
    throw new AppError('Please login to access this resource.', 401);
  }

  const result = await fetchClients(page, limit, searchQuery);

  if (!result) {
    throw new AppError('No client found.', 404);
  }

  const disStructuredClients = result.result.map(({ password, ...others }) => {
    return others;
  });

  const dataToSend = {
    clients: disStructuredClients,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
  };

  return res.status(200).json({
    message: 'Clients fetched successfully',
    clients: dataToSend,
    success: true,
  });
});

const getAllLawyers = catchErrors(async (req, res) => {
  const user = req.user?.userId;

  console.log('i am getting all lawyers');

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const searchQuery =
    typeof req.query.searchParams === 'string' ? req.query.searchParams : '';

  if (!user) {
    throw new AppError('Please login to access this resource.', 401);
  }

  const result = await fetchLawyers(page, limit, searchQuery);

  if (!result) {
    throw new AppError('No lawyer found.', 404);
  }

  const disStructuredLawyers = result.result.map(({ password, ...others }) => {
    return others;
  });

  const dataToSend = {
    lawyers: disStructuredLawyers,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
  };

  return res.status(200).json({
    message: 'Lawyers fetched successfully',
    lawyers: dataToSend,
    success: true,
  });
});

const getClientDetails = catchErrors(async (req, res) => {
  const { clientId } = req.params;
  console.log(clientId);
  console.log(' I am getting client details');

  if (!clientId) {
    throw new AppError('Client ID not specified.', 404);
  }

  const response = await fetchClientDetails(clientId);

  const { password, ...others } = response;
  console.log('CLIENT DETAILS: ', others);

  return res.status(200).json({
    message: 'Client details fetched successfully',
    success: true,
    client: others,
  });
});

const getUserProfile = catchErrors(async (req, res) => {
  const user = req.user?.userId;
  console.log(' I am getting user profile');

  if (!user) {
    throw new AppError('Please login to continue.', 404);
  }

  const response = await fetchUserDetails(user);

  const { password, ...others } = response;
  console.log('USER PROFILE CONTROLLER: ', others);

  return res.status(200).json({
    message: 'Profile fetched successfully',
    success: true,
    user: others,
  });
});

export {
  getUserProfile,
  getAllWorkers,
  getAllClients,
  getAllLawyers,
  getClientDetails,
};
