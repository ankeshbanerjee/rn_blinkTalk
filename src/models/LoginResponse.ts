export interface LoginResponse {
  result: Result;
  success: boolean;
  message: string;
}

export interface Result {
  user: User;
  accessToken: string;
}

export interface User {
  name: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
}
