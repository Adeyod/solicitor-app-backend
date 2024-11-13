import { IUserDocument } from '../constants/types';
import User from '../models/user.model';
import { AppError } from '../utils/app.error';

const fetchLawyers = async (
  page: number = 1,
  limit: number = 10,
  searchParams: string
): Promise<{
  result: IUserDocument[];
  totalPages: number;
  totalCount: number;
}> => {
  let query = User.find({
    role: 'lawyer',
  });

  if (searchParams) {
    const regex = new RegExp(searchParams, 'i');

    query = query.where({
      $or: [
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { user_name: { $regex: regex } },
      ],
    });
  }

  if (!query) {
    throw new AppError('Lawyer not found.', 404);
  }

  query = query.sort({ createdAt: -1 });

  const offset = (page - 1) * limit;

  const count = await User.countDocuments({
    role: 'lawyer',
  });
  const pages = Math.ceil(count / limit);
  query = query.skip(offset).limit(limit);

  if (page > pages) {
    throw new AppError('Page can not be found.', 404);
  }

  const result = await query;

  return {
    result: result.map((doc) => doc.toObject()) as IUserDocument[],
    totalPages: pages,
    totalCount: count,
  };
};

const fetchClients = async (
  page: number = 1,
  limit: number = 10,
  searchParams: string
): Promise<{
  result: IUserDocument[];
  totalPages: number;
  totalCount: number;
}> => {
  let query = User.find({
    role: 'client',
  });

  if (searchParams) {
    const regex = new RegExp(searchParams, 'i');

    query = query.where({
      $or: [
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { user_name: { $regex: regex } },
      ],
    });
  }

  if (!query) {
    throw new AppError('Client not found.', 404);
  }

  query = query.sort({ createdAt: -1 });

  const offset = (page - 1) * limit;

  const count = await User.countDocuments({
    role: 'client',
  });
  const pages = Math.ceil(count / limit);
  query = query.skip(offset).limit(limit);

  if (page > pages) {
    throw new AppError('Page can not be found.', 404);
  }

  const result = await query;

  return {
    result: result.map((doc) => doc.toObject()) as IUserDocument[],
    totalPages: pages,
    totalCount: count,
  };
};

const fetchUserDetails = async (user_id: string): Promise<IUserDocument> => {
  const result = await User.findById(user_id);
  if (!result) {
    throw new AppError('User not found.', 404);
  }

  return result.toObject() as IUserDocument;
};

const fetchWorkers = async (
  page: number = 1,
  limit: number = 10,
  searchParams: string
): Promise<{
  result: IUserDocument[];
  totalPages: number;
  totalCount: number;
}> => {
  let query = User.find({
    role: 'worker',
  });

  if (searchParams) {
    const regex = new RegExp(searchParams, 'i');

    query = query.where({
      $or: [
        { first_name: { $regex: regex } },
        { last_name: { $regex: regex } },
        { user_name: { $regex: regex } },
      ],
    });
  }

  if (!query) {
    throw new AppError('Worker not found.', 404);
  }

  const offset = (page - 1) * limit;

  query = query.sort({ createdAt: -1 });

  const count = await User.countDocuments({
    role: 'worker',
  });
  const pages = Math.ceil(count / limit);
  query = query.skip(offset).limit(limit);

  if (page > pages) {
    throw new AppError('Page can not be found.', 404);
  }

  const result = await query;

  return {
    result: result.map((doc) => doc.toObject()) as IUserDocument[],
    totalPages: pages,
    totalCount: count,
  };
};

const fetchClientDetails = async (clientId: Object): Promise<IUserDocument> => {
  const result = await User.findOne({
    $and: [
      {
        _id: clientId,
      },
      { role: 'client' },
    ],
  });

  if (!result) {
    throw new AppError('Client not found.', 404);
  }

  return result.toObject() as IUserDocument;
};

export {
  fetchUserDetails,
  fetchLawyers,
  fetchWorkers,
  fetchClients,
  fetchClientDetails,
};
