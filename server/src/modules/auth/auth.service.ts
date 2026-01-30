import { AuthErrors } from './auth.error.js';
import { UserCreate } from './auth.schema.js';
import { AppError } from '@/lib/error.lib.js';
import { prisma } from '@/lib/prisma.lib.js';

import { hashPassword } from '@/utils/hashed.util.js';

export const authService = {
  async createUser(data: UserCreate) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) throw AuthErrors.USER_EXISTING(data.email);

      const hashed = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashed,
        },
      });

      const { password, ...safeUser } = user;
      return safeUser;
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw AuthErrors.CREATE_USER_FAILED();
    }
  },
};
