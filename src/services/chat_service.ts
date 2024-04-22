import axios from 'axios';
import {ChatResponse} from '../models/ChatResponse';

export const fetchChats = () => axios.get<ChatResponse>('/chat');
