import { ulid } from 'ulid';

export const generateUserId = (): string => {
  return ulid();
};

export const generateDeviceId = (): string => {
  return ulid();
};