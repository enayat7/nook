import { Request, Response } from 'express';
import AuthService from '../services/otpService';
import { ResponseUtils, ValidationUtils } from '../../../utils/generic';
import { SendOTPRequest, VerifyOTPRequest } from '../interfaces/auth.interface';

const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email }: SendOTPRequest = req.body;

  if (ValidationUtils.isEmpty(email) || !ValidationUtils.isValidEmail(email!)) {
    return ResponseUtils.badRequest(res, 'Valid email is required');
  }

  await AuthService.sendOTP(email!, res);
};

const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, device_id, device_type, model }: VerifyOTPRequest & { device_id: string; device_type: 'ios' | 'android' | 'web'; model?: string } = req.body;

  if (ValidationUtils.isEmpty(email) || !ValidationUtils.isValidEmail(email!)) {
    return ResponseUtils.badRequest(res, 'Valid email is required');
  }

  if (ValidationUtils.isEmpty(otp) || !ValidationUtils.isValidOTP(otp)) {
    return ResponseUtils.badRequest(res, 'Valid 6-digit OTP is required');
  }

  const deviceInfo = {
    device_id,
    device_type,
    model
  };

  await AuthService.verifyOTP(email!, otp, res, deviceInfo);
};

export default {
  sendOTP,
  verifyOTP
};