import axios from 'axios';
import {LoginResponse} from '../models/LoginResponse';

export const validateEmail = (email: string): string | null => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    return null;
  } else {
    return 'Invalid email address';
  }
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  } else if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase character.';
  } else if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase character.';
  } else if (!/\d/.test(password)) {
    return 'Password must contain at least one number.';
  } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
    return 'Password must contain at least one special character.';
  } else return null;
};

export const login = (email: string, password: string) =>
  axios.post<LoginResponse>('/user/login', {email, password});

export const register = (name: string, email: string, password: string) =>
  axios.post<LoginResponse>('/user/register', {name, email, password});
