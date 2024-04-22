import axios from 'axios';
import {UserResponse} from '../models/UserResponse';

export const getMyProfile = () => axios.get<UserResponse>('/user/me');
