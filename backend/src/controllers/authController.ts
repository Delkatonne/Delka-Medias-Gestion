import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { PasswordResetModel } from '../models/PasswordReset';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../config/email';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Créer l'utilisateur
    const user = await UserModel.create(email, password, firstName, lastName);

    // Générer le token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Générer le token
    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Trouver l'utilisateur
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return res.json({ message: 'If email exists, password reset link sent' });
    }

    // Créer le token de réinitialisation
    const resetToken = await PasswordResetModel.create(user.id);

    // Construire le lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken.token}`;

    // Envoyer l'email
    const emailSent = await sendEmail(
      email,
      'Réinitialisation de votre mot de passe - Delka Médias Gestion',
      `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
        <a href="${resetLink}">Réinitialiser le mot de passe</a>
        <p>Ce lien expire dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    return res.json({ message: 'If email exists, password reset link sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Trouver le token
    const resetToken = await PasswordResetModel.findByToken(token);
    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Mettre à jour le mot de passe
    const success = await UserModel.updatePassword(resetToken.userId, password);
    if (!success) {
      return res.status(500).json({ message: 'Failed to reset password' });
    }

    // Supprimer le token
    await PasswordResetModel.delete(resetToken.id);

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.json({ message: 'Logout successful' });
};
