export interface UserResponse {
  result: Result;
  success: boolean;
  message: string;
}

export interface Result {
  user: User;
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
