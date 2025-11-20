import { Request, Response } from 'express';
import { ResponseUtils } from '../../../utils/generic';
import { logger } from '../../../utils/logger';

const googleLogin = async (req: Request, res: Response): Promise<void> => {
  // Redirect to Google OAuth
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=email profile`;
  
  res.redirect(googleAuthUrl);
};

const googleCallback = async (req: Request, res: Response): Promise<void> => {
  // For now, return dummy Google user data
  const dummyGoogleUser = {
    google_id: "google_123456789",
    email: "user@gmail.com",
    fname: "John",
    lname: "Doe",
    profile_picture: "https://lh3.googleusercontent.com/a/default-user"
  };

  logger.info('Google OAuth callback - dummy user created');
  ResponseUtils.success(res, 'Google login successful', {
    api_token: "dummy-google-token-" + Date.now(),
    user: {
      user_id: "google-user-" + Date.now(),
      email: dummyGoogleUser.email,
      fname: dummyGoogleUser.fname,
      lname: dummyGoogleUser.lname,
      type: "user",
      status: "authentic",
      google_id: dummyGoogleUser.google_id,
      is_verified: true
    }
  });
};

export default {
  googleLogin,
  googleCallback
};