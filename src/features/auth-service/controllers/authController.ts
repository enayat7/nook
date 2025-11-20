import { Request, Response } from 'express';
import AuthService from '../services/otpService';
import { ResponseUtils, ValidationUtils } from '../../../utils/generic';
import { SendOTPRequest, VerifyOTPRequest } from '../interfaces/auth.interface';

const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const { email }: SendOTPRequest = req.body;

  if (ValidationUtils.isEmpty(email) || !ValidationUtils.isValidEmail(email)) {
    return ResponseUtils.badRequest(res, 'Valid email is required');
  }

  await AuthService.sendOTP(email, res);
};

const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp }: VerifyOTPRequest = req.body;

  if (ValidationUtils.isEmpty(email) || !ValidationUtils.isValidEmail(email)) {
    return ResponseUtils.badRequest(res, 'Valid email is required');
  }

  if (ValidationUtils.isEmpty(otp) || !ValidationUtils.isValidOTP(otp)) {
    return ResponseUtils.badRequest(res, 'Valid 6-digit OTP is required');
  }

  await AuthService.verifyOTP(email, otp, res);
};

export default {
  sendOTP,
  verifyOTP
};