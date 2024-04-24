import {Chat} from '../models/ChatResponse';

export type RootStackParamsList = {
  SPLASH: undefined;
  LOGIN: undefined;
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
};

export type BottomNavParamsList = {
  HOME: undefined;
  PROFILE: undefined;
};
