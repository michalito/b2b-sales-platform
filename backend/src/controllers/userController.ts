import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as userService from '../services/userService';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Received registration request:', req.body);
    const user = await userService.createUser(req.body);
    console.log('User created:', user);
    res.status(201).json({ message: 'User created. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    await userService.verifyEmail(req.body.token);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(400).json({ error: 'User not found' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired reset token' });
  }
};

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    if (isError(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the profile' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

export const approveUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updatedUser = await userService.approveUser(userId);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while approving the user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: req.body,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};