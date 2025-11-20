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

// Ensure unique mobile + country_code combination
userMobileSchema.index({ mobile: 1, country_code: 1 }, { unique: true });
// Index for user lookups
userMobileSchema.index({ user_id: 1 });

export const UserMobile = mongoose.model<IUserMobile>('UserMobile', userMobileSchema);