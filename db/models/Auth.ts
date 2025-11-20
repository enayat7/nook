import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IAuth extends Document {
  user_id: string;
  type: 'user' | 'coach';
  api_token: string;
  created_at: Date;
  updated_at: Date;
}

const authSchema = new Schema<IAuth>({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['user', 'coach'],
    required: true
  },
  api_token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

authSchema.index({ user_id: 1, type: 1 });
authSchema.index({ api_token: 1 }, { unique: true });

export const Auth = mongoose.model<IAuth>('Auth', authSchema);