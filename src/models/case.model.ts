import mongoose, { Schema } from 'mongoose';
import { caseStatusEnum } from '../utils/enumModules';
import { generateCaseId } from '../utils/functions';
import { ICase } from '../constants/types';
import { AppError } from '../utils/app.error';

const caseSchema = new mongoose.Schema<ICase>(
  {
    case_title: { type: String, required: true },
    case_type: { type: String, required: true },
    case_number: {
      type: String,
      required: true,
      unique: true,
    },
    status: { type: String, enum: caseStatusEnum, default: caseStatusEnum[0] },
    client: { type: Schema.Types.ObjectId, ref: 'User' },
    lawyer_in_charge: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    description: { type: String },
    documents: [
      {
        url: { type: String },
        public_url: { type: String },
      },
    ],
    court_details: {
      court_name: { type: String },
      address: { type: String },
      judge: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Case = mongoose.model<ICase>('Case', caseSchema);
export default Case;
