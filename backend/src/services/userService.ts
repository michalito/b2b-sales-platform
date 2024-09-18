import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService';

const prisma = new PrismaClient();

export const createUser = async (userData: any) => {
  console.log('Creating user with data:', userData);
  const { email, name, role, discountRate } = userData;

  const verificationToken = uuidv4();
  const temporaryPassword = uuidv4();

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role || 'USER',
        discountRate: discountRate || 0,
        verificationToken,
        password: await bcrypt.hash(temporaryPassword, 10),
      },
    });
    console.log('User created in database:', user);

    console.log('Sending verification email...');
    await sendVerificationEmail(user.email, verificationToken, temporaryPassword);
    console.log('Verification email sent');

    return user;
  } catch (error) {
    console.error('Error in createUser function:', error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new Error('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (!user.emailVerified) {
    throw new Error('Please verify your email before logging in');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const updateUserProfile = async (userId: string, updateData: any) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      company: true,
      vatNumber: true,
      phoneNumber: true,
      address: true,
      discountRate: true,
    },
  });

  return updatedUser;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      approved: true,
      company: true,
      vatNumber: true,
      phoneNumber: true,
      address: true,
      discountRate: true,
    },
  });

  return users;
};

export const approveUser = async (userId: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { approved: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      approved: true,
    },
  });

  return updatedUser;
};