import { AuthErrors } from './auth.error.js';
import { type JwtPayload, Organization, UserCreate } from './auth.schema.js';
import { Prisma } from '@/generated/prisma/client.js';
import { AppError } from '@/lib/error.lib.js';
import { prisma } from '@/lib/prisma.lib.js';

import type { FastifyInstance } from 'fastify';

import { _jwt } from 'zod/v4/core';

import { comparePassword, hashPassword } from '@/utils/hashed.util.js';

export const authService = (app: FastifyInstance) => ({
  /**
   * Creates a user.
   *
   * @param data UserCreate
   * @returns Created user object with password field removed for security
   * @throws AppError for validation or database failures
   */
  async createUser(data: UserCreate) {
    if (data.organization === 'None' && data.organization_name) {
      throw AuthErrors.Auth.FORBIDDEN_FIELD();
    }

    if (data.organization !== 'None' && !data.organization_name) {
      throw AuthErrors.Auth.FORBIDDEN_FIELD();
    }

    const email = data.email.toLowerCase();
    const hashed = await hashPassword(data.password);

    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          surname: data.surname,
          email: email,
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

      if (err instanceof Prisma.PrismaClientValidationError) {
        throw AuthErrors.Prisma.CONSTRAINT_VIOLATION();
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw AuthErrors.Prisma.UNIQUE_CONSTRAINT();
        }

        if (err.code === 'P2003') {
          throw AuthErrors.Prisma.FOREIGN_KEY_CONFLICT();
        }

        if (err.code === 'P2004') {
          throw AuthErrors.Prisma.CONSTRAINT_VIOLATION();
        }

        throw AuthErrors.Prisma.DATABASE_ERROR(err.code);
      }

      throw AuthErrors.Auth.CREATE_USER_FAILED();
    }
  },

  /**
   * Authenticates a user.
   *
   * @param data Object containing email and password
   * @returns Object with `accessToken` (15m) and `refreshToken` (7d)
   * @throws AppError for invalid credentials, inactive user, or token generation failure
   */
  async authUser(data: { email: string; password: string }) {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    let user;

    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw AuthErrors.Prisma.CONSTRAINT_VIOLATION();
      }
      throw AuthErrors.Auth.CREATE_USER_FAILED();
    }

    if (!user) throw AuthErrors.Auth.INVALID_CREDENTIALS();

    const valid = await comparePassword(password, user.password);

    if (!valid) throw AuthErrors.Auth.INVALID_CREDENTIALS();
    if (user.status !== 'Active') throw AuthErrors.Auth.USER_INACTIVE();

    try {
      const accessToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '15m' });
      const refreshToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '7d' });

      return { accessToken, refreshToken };
    } catch {
      throw AuthErrors.Auth.TOKEN_GENERATION_FAILED();
    }
  },

  /**
   * Refreshes the access token.
   *
   * @param token Refresh token string
   * @returns Object with new `accessToken` (15m) and basic user info
   * @throws AppError for missing token, invalid token, inactive or non-existent user, or token generation failure
   */
  async refreshToken(token: string) {
    if (!token) throw AuthErrors.Auth.REFRESH_TOKEN_REQUIRED();

    let decoded: JwtPayload;

    try {
      decoded = app.jwt.verify(token) as JwtPayload;
    } catch {
      throw AuthErrors.Auth.INVALID_REFRESH_TOKEN();
    }

    let user;

    try {
      user = await prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw AuthErrors.Prisma.CONSTRAINT_VIOLATION();
      }
      throw AuthErrors.Auth.CREATE_USER_FAILED();
    }

    if (!user) throw AuthErrors.Auth.USER_NOT_FOUND();
    if (user.status !== 'Active') throw AuthErrors.Auth.USER_INACTIVE();

    try {
      const accessToken = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: '15m' });

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          surname: user.surname,
          occupation: user.occupation,
        },
      };
    } catch {
      throw AuthErrors.Auth.TOKEN_GENERATION_FAILED();
    }
  },
});
