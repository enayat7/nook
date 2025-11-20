export interface SendOTPRequest {
  email?: string;
  mobile?: string;
  country_code?: string;
}

export interface VerifyOTPRequest {
  email?: string;
  mobile?: string;
  country_code?: string;
  otp: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse extends OTPResponse {
  user?: {
    id: string;
    email?: string;
    mobile?: string;
    is_verified: boolean;
  };
  token?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  mobile?: string;
  is_verified: boolean;
}