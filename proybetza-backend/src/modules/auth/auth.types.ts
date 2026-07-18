import { Request } from 'express';

export type UserRole = 'user' | 'admin';

export interface DbUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface JwtPayload {
  sub: number;       // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
