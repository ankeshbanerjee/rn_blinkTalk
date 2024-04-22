import axios from 'axios';
import {
  CreateMessageResponse,
  MessageResponse,
} from '../models/MessageResponse';

export const fetchMessages = (chatId: string) =>
  axios.get<MessageResponse>(`/message/${chatId}`);

export const createMessage = (
  chatId: string,
  content: string,
  attachment?: string,
) =>
  axios.post<CreateMessageResponse>('/message', {
    chatId,
    content,
    ...(attachment && {attachment}),
  });
