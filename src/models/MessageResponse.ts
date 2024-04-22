export interface MessageResponse {
  result: Result;
  success: boolean;
  message: string;
}

export interface Result {
  messages: Message[];
}

export interface Message {
  _id: string;
  sender: Sender;
  content: string;
  attachment?: string;
  chat: Chat;
  readBy: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  name: string;
  email: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateMessageResponse {
  result: CreateMessageResult;
  success: boolean;
  message: string;
}

export interface CreateMessageResult {
  message: Message;
}
