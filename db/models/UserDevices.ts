import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDevices extends Document {
  user_id: string;
  device_id: string;
  ip_address?: string;
  device_type: 'ios' | 'android' | 'web';
  model?: string;
  is_notification_allowed: boolean;
  is_device_installed: boolean;
  fcm_token?: string;
  voip_token?: string;
  last_active_at: Date;
  created_at: Date;
  updated_at: Date;
}

const userDevicesSchema = new Schema<IUserDevices>({
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  device_id: {
    type: String,
    required: true,
    trim: true
  },
  ip_address: {
    type: String,
    trim: true
  },
  device_type: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: true
  },
  model: {
    type: String,
    trim: true
  },
  is_notification_allowed: {
    type: Boolean,
    default: true
  },
  is_device_installed: {
    type: Boolean,
    default: true
  },
  fcm_token: {
    type: String,
    trim: true
  },
  voip_token: {
    type: String,
    trim: true
  },
  last_active_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userDevicesSchema.index({ user_id: 1, device_id: 1 }, { unique: true });
userDevicesSchema.index({ fcm_token: 1 }, { sparse: true });
userDevicesSchema.index({ user_id: 1, is_device_installed: 1 });

export const UserDevices = mongoose.model<IUserDevices>('UserDevices', userDevicesSchema);