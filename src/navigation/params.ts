import {Chat} from '../models/ChatResponse';

export type RootStackParamsList = {
  SPLASH: undefined;
  LOGIN: undefined;
  MAIN: undefined;
  CHAT: {
    chat: Chat;
  };
};

export type BottomNavParamsList = {
  HOME: undefined;
  PROFILE: undefined;
};
