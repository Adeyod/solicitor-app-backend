import {
  CaseCreationPayload,
  CaseCreationProp,
  ICase,
} from '../constants/types';
import Case from '../models/case.model';
import { AppError } from '../utils/app.error';
import { generateCaseId } from '../utils/functions';

const createNewCase = async (payload: CaseCreationPayload): Promise<ICase> => {
  const {
    case_title,
    case_type,
    description,
    client,
    lawyer_in_charge,
    documents,
  } = payload;

  const caseNumber = await generateCaseId(6);

  const newCase = await new Case({
    case_title: case_title,
    case_type: case_type,
    description: description,
    client: client,
    lawyer_in_charge: lawyer_in_charge,
    documents: documents,
    case_number: caseNumber,
  }).save();
  console.log(newCase);

  if (!newCase) {
    throw new AppError('Unable to create a new case', 400);
  }
  return newCase as ICase;
};

const fetchAllCases = async (
  page: number = 1,
  limit: number = 10,
  searchParams: string
) => {
  let query = Case.find();

  if (searchParams) {
    const regex = new RegExp(searchParams, 'i');

    query = query.where({
      $or: [
        { case_title: { $regex: regex } },
        { case_type: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    });
  }
  if (!query) {
    throw new AppError('Cases can not be found', 404);
  }

  const offset = (page - 1) * limit;

  const count = await Case.countDocuments();
  const pages = Math.ceil(count / limit);

  console.log('case limit:', limit);
  console.log('case page:', page);
  console.log('case pages:', pages);
  query = query.skip(offset).limit(limit);

  if (page > pages) {
    throw new AppError('Page can not be found.', 404);
  }

  const result = await query;
  return { result, totalPages: pages, totalCount: count };
};

const fetchCaseDetails = async (caseId: string): Promise<ICase> => {
  console.log('CASE SERVICE:', caseId);
  const result = await Case.findById(caseId)
    .populate('lawyer_in_charge', '-password')
    .populate('client', '-password');

  return result as ICase;
};

export { createNewCase, fetchAllCases, fetchCaseDetails };
