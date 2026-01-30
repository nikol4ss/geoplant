import { SignupSchema } from './auth.schema.js';
import { authService } from './auth.service.js';
import { AppError } from '@/lib/error.lib.js';

import { FastifyReply, FastifyRequest } from 'fastify';

import { z } from 'zod';

export const authController = {
  async signup(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = SignupSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({ success: false, errors: parsed.error.issues });
      }

      const user = await authService.createUser(parsed.data);

      reply.status(201).send({ success: true, user });
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

      console.error('SIGNUP_FAILED:', err);
      reply.status(500).send({ success: false, message: 'Internal server error' });
    }
  },
};
