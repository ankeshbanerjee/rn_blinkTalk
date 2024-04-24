import axios from 'axios';
import {
  ChatResponse,
  CreateChatResponse,
  CreateGroupChatResponse,
} from '../models/ChatResponse';

export const fetchChats = () => axios.get<ChatResponse>('/chat');

export const createChat = (userId: string) =>
  axios.post<CreateChatResponse>('/chat', {userId});

export const createGroupChat = (chatName: string, users: string[]) =>
  axios.post<CreateGroupChatResponse>('/chat/group', {chatName, users});
