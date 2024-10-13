import axios from 'axios';
import {FetchAllUsers, UserResponse} from '../models/UserResponse';
import {FileUploadResponse} from '../models/FileResponse';

export const getMyProfile = () => axios.get<UserResponse>('/user/me');

export const updateProfile = (key: 'name' | 'profilePicture', value: string) =>
  axios.patch<UserResponse>('/user/update', {[key]: value});

export const fetchAllUsers = () => axios.get<FetchAllUsers>('/user/all');

export const saveFCMToken = (token: string) =>
  axios.post('/user/save-token', {token});

export const deleteFCMToken = (token: string) =>
  axios.post('/user/delete-token', {token});
