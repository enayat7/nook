import mongoose, { Document, Schema } from 'mongoose';

export interface IUserEmail extends Document {
  user_id: string;
  email: string;
  is_verified: boolean;
  is_primary: boolean;
  otp?: string;
  otp_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

const userEmailSchema = new Schema<IUserEmail>({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_primary: {
    type: Boolean,
    default: true
  },
  otp: {
    type: String,
    select: false
  },
  otp_expires: {
    type: Date,
    select: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userEmailSchema.index({ user_id: 1, email: 1 }, { unique: true });

export const UserEmail = mongoose.model<IUserEmail>('UserEmail', userEmailSchema);