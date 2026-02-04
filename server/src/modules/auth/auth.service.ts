import { AuthErrors } from './auth.error.js';
import { UserCreate } from './auth.schema.js';
import { Prisma } from '@/generated/prisma/client.js';
import { AppError } from '@/lib/error.lib.js';
import { prisma } from '@/lib/prisma.lib.js';

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { comparePassword } from '@/utils/encrypt.util.js';
import { hashPassword } from '@/utils/hashed.util.js';

export const authService = (app: FastifyInstance) => ({
  async createUser(data: UserCreate) {
    if (data.organization === 'None' && data.organization_name) {
      throw AuthErrors.FORBIDDEN_FIELD();
    }

    if (data.organization !== 'None' && !data.organization_name) {
      throw AuthErrors.FORBIDDEN_FIELD();
    }

    try {
      const hashed = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          surname: data.surname,
          email: data.email.toLowerCase(),
          password: hashed,
          organization: data.organization,
          organization_name: data.organization_name ?? null,
          occupation: data.occupation,
          status: 'Active',
        },
      });

      const { password, ...safeUser } = user;
      return safeUser;
    } catch (err: unknown) {
      if (err instanceof AppError) {
        throw err;
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw AuthErrors.USER_EXISTING();

          case 'P2003':
          case 'P2004':
            throw AuthErrors.DATABASE_CONFLICT();
        }
      }

      throw AuthErrors.CREATE_USER_FAILED();
    }
  },

  async authUser(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw AuthErrors.INVALID_CREDENTIALS();
    }

    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      throw AuthErrors.INVALID_CREDENTIALS();
    }

    if (user.status !== 'Active') {
      throw AuthErrors.USER_INACTIVE();
    }

    const token = app.jwt.sign({
      id: user.id,
      email: user.email,
    });

    return {
      token,
    };
  },
});
