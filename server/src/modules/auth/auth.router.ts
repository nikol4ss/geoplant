import { authController } from './auth.controller.js';
import { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', authController.signup);
  fastify.post('/login', authController.login);
}
