import db from '../config/database';
import { User } from '../types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const UserModel = {
  async create(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await db.one(
      `INSERT INTO users (id, email, password, first_name, last_name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, password, first_name, last_name, profile_image, created_at, updated_at`,
      [id, email, hashedPassword, firstName, lastName]
    );

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImage: user.profile_image,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.oneOrNone(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  async findById(id: string): Promise<User | null> {
    try {
      const user = await db.oneOrNone(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  async updateProfile(id: string, firstName: string, lastName: string, profileImage?: string): Promise<User | null> {
    try {
      const user = await db.oneOrNone(
        `UPDATE users 
         SET first_name = $2, last_name = $3, profile_image = COALESCE($4, profile_image), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, firstName, lastName, profileImage]
      );

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.none(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, id]
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.none('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      return false;
    }
  },
};
