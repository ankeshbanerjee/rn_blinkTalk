import axios from 'axios';
import {UserResponse} from '../models/UserResponse';
import {FileUploadResponse} from '../models/FileResponse';

export const getMyProfile = () => axios.get<UserResponse>('/user/me');

export const updateProfile = (key: 'name' | 'profilePicture', value: string) =>
  axios.patch<UserResponse>('/user/update', {[key]: value});

export const uploadSingleFile = (formData: FormData) =>
  axios.post<FileUploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
