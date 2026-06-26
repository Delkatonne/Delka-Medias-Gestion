export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Media {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  filepath: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  duration?: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
