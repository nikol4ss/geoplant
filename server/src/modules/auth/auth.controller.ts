import { SignupSchema } from './auth.schema.js';
import { authService } from './auth.service.js';
import { AppError } from '@/lib/error.lib.js';

import { FastifyReply, FastifyRequest } from 'fastify';

import { z } from 'zod';

import { rateLimit } from '@/utils/ratelimit.util.js';

export const authController = {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;

      rateLimit(`create-user:${body.email.toLowerCase()}:${request.ip}`, 5, 2 * 60 * 1000);

      const parsed = SignupSchema.safeParse(body);

      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          errors: parsed.error.issues,
        });
      }

      const user = await authService.createUser(parsed.data);

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
};
