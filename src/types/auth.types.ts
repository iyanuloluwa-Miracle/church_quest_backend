import { Request } from 'express';

export interface ISignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthenticatedRequest extends Request {
  user?: any;
}

export interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  profilePic: {
    url: string;
    publicId: string;
  };
  createdAt: Date;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}