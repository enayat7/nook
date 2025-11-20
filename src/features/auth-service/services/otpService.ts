import { Response } from 'express';
import AuthRepository from '../repositories/authRepository';
import { emailService } from '../../../utils/email';
import { generateToken } from '../../../utils/jwt';
import { ResponseUtils, ErrorUtils } from '../../../utils/generic';
import { logger } from '../../../utils/logger';

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email: string, res: Response): Promise<void> => {
  try {
    // Use fixed OTP 1111 for all emails
    const otp = '1111';
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await AuthRepository.createOrUpdateUserOTP(email, otp, otpExpires);
    // Skip email sending (using fixed OTP)
    // await emailService.sendOTP(email, otp);
    
    logger.info(`OTP (fixed: 1111) sent to ${email}`);
    ResponseUtils.success(res, 'OTP sent successfully', {
      test_otp: otp
    });
  } catch (error) {
    ErrorUtils.handleError(error, 'Send OTP service');
    ResponseUtils.error(res, 'Failed to send OTP');
  }
};

const verifyOTP = async (email: string, otp: string, res: Response, deviceInfo: {
  device_id: string;
  device_type: 'ios' | 'android' | 'web';
  ip_address?: string;
  model?: string;
  fcm_token?: string;
  voip_token?: string;
}): Promise<void> => {
  try {
    const userEmail = await AuthRepository.findUserEmailWithOTP(email, otp);

    if (!userEmail) {
      return ResponseUtils.badRequest(res, 'Invalid or expired OTP');
    }

    const verifiedUserEmail = await AuthRepository.verifyUserEmail(userEmail._id.toString());
    
    if (!verifiedUserEmail) {
      return ResponseUtils.error(res, 'Failed to verify email');
    }

    // Register or update device
    const device = await AuthRepository.createOrUpdateDevice(verifiedUserEmail.user_id, deviceInfo);
    
    // Create auth token
    const authToken = await AuthRepository.createAuthToken(verifiedUserEmail.user_id, user?.type || 'user');
    
    // Get user details
    const user = await AuthRepository.findUserByEmail(email);

    logger.info(`OTP verified for ${email}`);
    ResponseUtils.success(res, 'OTP verified successfully', {
      api_token: authToken.api_token,
      user: {
        user_id: user?.user_id,
        email: verifiedUserEmail.email,
        is_verified: verifiedUserEmail.is_verified,
        status: user?.status
      },
      device: {
        device_id: device.device_id,
        device_type: device.device_type,
        is_notification_allowed: device.is_notification_allowed
      }
    });
  } catch (error) {
    ErrorUtils.handleError(error, 'Verify OTP service');
    ResponseUtils.error(res, 'Failed to verify OTP');
  }
};

export default {
  sendOTP,
  verifyOTP
};