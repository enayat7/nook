import { User, IUser } from '../../../../db/models/User';
import { UserEmail, IUserEmail } from '../../../../db/models/UserEmail';
import { UserMobile, IUserMobile } from '../../../../db/models/UserMobile';
import { Auth, IAuth } from '../../../../db/models/Auth';
import { UserDevices, IUserDevices } from '../../../../db/models/UserDevices';

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const userEmail = await UserEmail.findOne({ email });
  if (!userEmail) return null;
  return await User.findOne({ user_id: userEmail.user_id });
};

const findUserByMobile = async (mobile: string, countryCode: string = '+1'): Promise<IUser | null> => {
  const userMobile = await UserMobile.findOne({ mobile, country_code: countryCode });
  if (!userMobile) return null;
  return await User.findOne({ user_id: userMobile.user_id });
};

const findUserEmailWithOTP = async (email: string, otp: string): Promise<IUserEmail | null> => {
  return await UserEmail.findOne({
    email,
    otp,
    otp_expires: { $gt: new Date() }
  }).select('+otp +otp_expires');
};

const findUserMobileWithOTP = async (mobile: string, otp: string, countryCode: string = '+1'): Promise<IUserMobile | null> => {
  return await UserMobile.findOne({
    mobile,
    country_code: countryCode,
    otp,
    otp_expires: { $gt: new Date() }
  }).select('+otp +otp_expires');
};

const createOrUpdateUserEmailOTP = async (email: string, otp: string, otpExpires: Date): Promise<{ user: IUser; userEmail: IUserEmail }> => {
  let userEmail = await UserEmail.findOne({ email });
  
  if (!userEmail) {
    // Create new user and email
    const user = await User.create({});
    userEmail = await UserEmail.create({
      user_id: user.user_id,
      email,
      otp,
      otp_expires: otpExpires
    });
    return { user, userEmail };
  } else {
    // Update existing email OTP
    userEmail.otp = otp;
    userEmail.otp_expires = otpExpires;
    await userEmail.save();
    
    const user = await User.findOne({ user_id: userEmail.user_id });
    return { user: user!, userEmail };
  }
};

const createOrUpdateUserMobileOTP = async (mobile: string, otp: string, otpExpires: Date, countryCode: string = '+1'): Promise<{ user: IUser; userMobile: IUserMobile }> => {
  let userMobile = await UserMobile.findOne({ mobile, country_code: countryCode });
  
  if (!userMobile) {
    // Create new user and mobile
    const user = await User.create({});
    userMobile = await UserMobile.create({
      user_id: user.user_id,
      mobile,
      country_code: countryCode,
      otp,
      otp_expires: otpExpires
    });
    return { user, userMobile };
  } else {
    // Update existing mobile OTP
    userMobile.otp = otp;
    userMobile.otp_expires = otpExpires;
    await userMobile.save();
    
    const user = await User.findOne({ user_id: userMobile.user_id });
    return { user: user!, userMobile };
  }
};

const verifyUserEmail = async (userEmailId: string): Promise<IUserEmail | null> => {
  return await UserEmail.findByIdAndUpdate(
    userEmailId,
    { 
      is_verified: true,
      $unset: { otp: 1, otp_expires: 1 }
    },
    { new: true }
  );
};

const verifyUserMobile = async (userMobileId: string): Promise<IUserMobile | null> => {
  return await UserMobile.findByIdAndUpdate(
    userMobileId,
    { 
      is_verified: true,
      $unset: { otp: 1, otp_expires: 1 }
    },
    { new: true }
  );
};

const createOrUpdateDevice = async (userId: string, deviceInfo: {
  device_id: string;
  device_type: 'ios' | 'android' | 'web';
  ip_address?: string;
  model?: string;
  fcm_token?: string;
  voip_token?: string;
}): Promise<IUserDevices> => {
  return await UserDevices.findOneAndUpdate(
    { user_id: userId, device_id: deviceInfo.device_id },
    {
      ...deviceInfo,
      user_id: userId,
      last_active_at: new Date()
    },
    { upsert: true, new: true }
  );
};

const createAuthToken = async (userId: string, type: 'user' | 'coach'): Promise<IAuth> => {
  // Create new auth token
  return await Auth.create({
    user_id: userId,
    type: type
  });
};

const findActiveAuth = async (apiToken: string): Promise<{ auth: IAuth; user: IUser } | null> => {
  const auth = await Auth.findOne({
    api_token: apiToken
  });
  
  if (!auth) return null;
  
  const user = await User.findOne({ user_id: auth.user_id });
  if (!user) return null;
  
  return { auth, user };
};

const deactivateAuth = async (apiToken: string): Promise<boolean> => {
  const result = await Auth.deleteOne({ api_token: apiToken });
  return result.deletedCount > 0;
};

const updateDeviceTokens = async (userId: string, deviceId: string, tokens: { fcm_token?: string; voip_token?: string }): Promise<IUserDevices | null> => {
  return await UserDevices.findOneAndUpdate(
    { user_id: userId, device_id: deviceId },
    tokens,
    { new: true }
  );
};

const updateNotificationSettings = async (userId: string, deviceId: string, isAllowed: boolean): Promise<IUserDevices | null> => {
  return await UserDevices.findOneAndUpdate(
    { user_id: userId, device_id: deviceId },
    { is_notification_allowed: isAllowed },
    { new: true }
  );
};

export default {
  findUserByEmail,
  findUserByMobile,
  findUserEmailWithOTP,
  findUserMobileWithOTP,
  createOrUpdateUserEmailOTP,
  createOrUpdateUserMobileOTP,
  verifyUserEmail,
  verifyUserMobile,
  createOrUpdateDevice,
  createAuthToken,
  findActiveAuth,
  deactivateAuth,
  updateDeviceTokens,
  updateNotificationSettings
};