import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPhoto extends Document {
  user_id: string;
  photo_url: string;
  photo_type: 'profile' | 'gallery' | 'verification';
  is_primary: boolean;
  is_verified: boolean;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

const userPhotoSchema = new Schema<IUserPhoto>({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  photo_url: {
    type: String,
    required: true
  },
  photo_type: {
    type: String,
    enum: ['profile', 'gallery', 'verification'],
    default: 'gallery'
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  order_index: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userPhotoSchema.index({ user_id: 1, order_index: 1 });

export const UserPhoto = mongoose.model<IUserPhoto>('UserPhoto', userPhotoSchema);