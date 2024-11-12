import mongoose, { Schema } from 'mongoose';
import { appointmentPurposeEnum } from '../utils/enumModules';

const appointmentSchema = new mongoose.Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'User' },
    lawyer: { type: Schema.Types.ObjectId, ref: 'User' },
    appointment_date: { type: Date, required: true },
    location: { type: String },
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: appointmentPurposeEnum,
      default: appointmentPurposeEnum[0],
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
