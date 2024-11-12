import mongoose, { Schema } from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    purpose: { type: String, required: true },
    created_at: {
      type: Date,
      default: Date.now,
      expires: 1800,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model('Token', tokenSchema);
export default Token;
