import mongoose, { Document, Schema } from 'mongoose';
import { generateUserId } from '../../src/utils/ulid';

export interface IUser extends Document {
  user_id: string;
  fname?: string;
  lname?: string;
  gender?: 'male' | 'female' | 'other';
  type: 'user' | 'coach';
  status: 'authentic' | 'non-authentic' | 'completed' | 'suspended';
  is_test: boolean;
  google_id?: string;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>({
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: generateUserId
  },
  fname: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lname: {
    type: String,
    trim: true,
    maxlength: 50
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  type: {
    type: String,
    enum: ['user', 'coach'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['authentic', 'non-authentic', 'completed', 'suspended'],
    default: 'non-authentic'
  },
  is_test: {
    type: Boolean,
    default: false
  },
  google_id: {
    type: String,
    sparse: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const User = mongoose.model<IUser>('User', userSchema);