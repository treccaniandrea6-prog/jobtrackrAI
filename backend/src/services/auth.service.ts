import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { signToken } from '../utils/jwt.utils';
import { AppError } from '../middleware/error.middleware';
import { RegisterBody, LoginBody } from '../types/auth.types';

export const AuthService = {
  async register(data: RegisterBody) {
    const existing = await UserModel.findByEmail(data.email);
    if (existing) throw new AppError('Email already in use', 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const userId = await UserModel.create(
      data.firstName,
      data.lastName,
      data.email,
      hashedPassword
    );

    const token = signToken({ id: userId, email: data.email });
    return { token, user: { id: userId, email: data.email, firstName: data.firstName, lastName: data.lastName } };
  },

  async login(data: LoginBody) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError('Invalid email or password', 401);

    const token = signToken({ id: user.id, email: user.email });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  },

  async getProfile(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
    };
  },
};
