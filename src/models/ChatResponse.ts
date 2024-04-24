export interface ChatResponse {
  result: Result;
  success: boolean;
  message: string;
}

export interface Result {
  chats: Chat[];
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  groupAdmin?: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateChatResponse {
  result: {
    chat: Chat;
  };
  success: boolean;
  message: string;
}

export interface CreateGroupChatResponse {
  result: {
    chat: GroupChat;
  };
  success: boolean;
  message: string;
}

export interface GroupChat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
