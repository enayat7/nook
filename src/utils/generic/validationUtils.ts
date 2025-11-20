const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || value === '';
};

const isValidString = (value: any, minLength: number = 1): boolean => {
  return typeof value === 'string' && value.trim().length >= minLength;
};

export default {
  isValidEmail,
  isValidOTP,
  isEmpty,
  isValidString
};