import {Chat} from '../models/ChatResponse';
import {User} from '../models/UserResponse';

export type RootStackParamsList = {
  SPLASH: undefined;
  LOGIN: undefined;
  REGISTER: undefined;
  MAIN: undefined;
  CHAT: {
    chat: Chat;
  };
  IMAGE_VIEW: {
    imageUri?: string;
    mediaInfo?: {
      media: string[];
      currIndex: number;
    };
  };
  VIEW_PROFILE: {
    user: User;
  };
  GROUP_DETAILS: {
    chatId: string;
  };
};

export type BottomNavParamsList = {
  HOME: undefined;
  PROFILE: undefined;
};
