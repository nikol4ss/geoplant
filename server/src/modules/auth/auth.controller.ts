import { LoginSchema, SignupSchema } from './auth.schema.js';
import { authService } from './auth.service.js';
import { AppError } from '@/lib/error.lib.js';

import { FastifyReply, FastifyRequest } from 'fastify';

import { z } from 'zod';

import { rateLimit } from '@/utils/ratelimit.util.js';

export const authController = {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const service = authService(request.server);
      const body = request.body as z.infer<typeof SignupSchema>;

      rateLimit(`create-user:${body.email.toLowerCase()}:${request.ip}`, 5, 2 * 60 * 1000);

      const parsed = SignupSchema.safeParse(body);

      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          errors: parsed.error.issues,
        });
      }

      const user = await service.createUser(parsed.data);

      return reply.status(201).send({
        success: true,
        data: user,
      });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          message: err.message,
          advice: err.advice,
        });
      }

      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          errors: err.issues,
        });
      }

      return reply.status(500).send({ success: false, message: 'Internal server error' });
    }
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const service = authService(request.server);
      const body = request.body as z.infer<typeof LoginSchema>;

      rateLimit(`login-user:${body.email.toLowerCase()}:${request.ip}`, 5, 2 * 60 * 1000);

      const parsed = LoginSchema.safeParse(body);

      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          errors: parsed.error.issues,
        });
      }

      const result = await service.authUser(parsed.data);
      return reply.status(200).send({
        success: true,
        data: result,
      });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          message: err.message,
          advice: err.advice,
        });
      }

      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          errors: err.issues,
        });
      }

      return reply.status(500).send({ success: false, message: 'Internal server error' });
    }
  },

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { refreshToken: string };
      const service = authService(request.server);

      const data = await service.refreshToken(body.refreshToken);
      return reply.status(200).send({ success: true, data });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return reply.status(err.statusCode).send({
          success: false,
          message: err.message,
          advice: err.advice,
        });
      }

      return reply.status(500).send({ success: false, message: 'Internal server error' });
    }
  },
};
