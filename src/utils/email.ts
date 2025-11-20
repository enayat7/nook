import nodemailer from 'nodemailer';
import { config } from '../../config';
import { logger } from './logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.user,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `
      });
      logger.info(`OTP sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }
}

export const emailService = new EmailService();