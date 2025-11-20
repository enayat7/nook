import mongoose, { Document, Schema } from 'mongoose';

export interface IUserMobile extends Document {
  user_id: string;
  mobile: string;
  country_code: string;
  is_verified: boolean;
  otp?: string;
  otp_expires?: Date;
  created_at: Date;
  updated_at: Date;
}

const userMobileSchema = new Schema<IUserMobile>({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  mobile: {
    type: String,
    required: true
  },
  country_code: {
    type: String,
    required: true,
    default: '+1'
  },
  is_verified: {
    type: Boolean,
    default: false
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

userMobileSchema.index({ user_id: 1, mobile: 1 }, { unique: true });

export const UserMobile = mongoose.model<IUserMobile>('UserMobile', userMobileSchema);