import { Request, Response } from 'express';
import AuthRepository from '../repositories/authRepository';
import { ResponseUtils, ValidationUtils } from '../../../utils/generic';
import { logger } from '../../../utils/logger';

const sendMobileOTP = async (req: Request, res: Response): Promise<void> => {
  const { mobile, country_code } = req.body;

  if (ValidationUtils.isEmpty(mobile)) {
    return ResponseUtils.badRequest(res, 'Mobile number is required');
  }

  try {
    const otp = '1111';
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await AuthRepository.createOrUpdateUserMobileOTP(
      mobile, 
      otp, 
      otpExpires, 
      country_code || '+1'
    );
    
    logger.info(`Mobile OTP (fixed: 1111) sent to: ${country_code || '+1'}${mobile}`);
    ResponseUtils.success(res, 'OTP sent to mobile successfully', {
      test_otp: otp
    });
  } catch (error) {
    logger.error('Send mobile OTP error:', error);
    ResponseUtils.error(res, 'Failed to send mobile OTP');
  }
};

const verifyMobileOTP = async (req: Request, res: Response): Promise<void> => {
  const { mobile, country_code, otp, device_id, device_type, model } = req.body;

  if (ValidationUtils.isEmpty(mobile) || ValidationUtils.isEmpty(otp)) {
    return ResponseUtils.badRequest(res, 'Mobile number and OTP are required');
  }

  try {
    const userMobile = await AuthRepository.findUserMobileWithOTP(
      mobile, 
      otp, 
      country_code || '+1'
    );

    if (!userMobile) {
      return ResponseUtils.badRequest(res, 'Invalid or expired OTP');
    }

    const verifiedUserMobile = await AuthRepository.verifyUserMobile(userMobile._id.toString());
    
    if (!verifiedUserMobile) {
      return ResponseUtils.error(res, 'Failed to verify mobile');
    }

    // Register device
    const deviceInfo = {
      device_id: device_id || `mobile-device-${Date.now()}`,
      device_type: device_type || 'android',
      model: model || 'Unknown'
    };
    
    const device = await AuthRepository.createOrUpdateDevice(verifiedUserMobile.user_id, deviceInfo);
    
    // Get user details
    const user = await AuthRepository.findUserByMobile(mobile, country_code || '+1');
    
    // Create auth token
    const authToken = await AuthRepository.createAuthToken(verifiedUserMobile.user_id, user?.type || 'user');

    logger.info(`Mobile OTP verified for: ${country_code || '+1'}${mobile}`);
    ResponseUtils.success(res, 'Mobile OTP verified successfully', {
      api_token: authToken.api_token,
      user: {
        user_id: user?.user_id,
        mobile: verifiedUserMobile.mobile,
        country_code: verifiedUserMobile.country_code,
        is_verified: verifiedUserMobile.is_verified,
        status: user?.status,
        type: user?.type
      },
      device: {
        device_id: device.device_id,
        device_type: device.device_type,
        is_notification_allowed: device.is_notification_allowed
      }
    });
  } catch (error) {
    logger.error('Verify mobile OTP error:', error);
    ResponseUtils.error(res, 'Failed to verify mobile OTP');
  }
};

export default {
  sendMobileOTP,
  verifyMobileOTP
};