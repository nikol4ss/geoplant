import { authRoutes } from './modules/auth/auth.router.js';

import Fastify from 'fastify';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

import dotenv from 'dotenv';

import crypto from 'crypto';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const app: FastifyInstance = Fastify({
  genReqId: () => crypto.randomUUID(),
  disableRequestLogging: true,
  logger: {
    level: isProd ? 'info' : 'debug',
    transport: isProd
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
  },
});

// CORS
app.register(cors, { origin: '*' });

// JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'JWT_NOT_FOUND',
  sign: { expiresIn: '3d' },
});

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ success: false, message: 'Unauthorized' });
  }
});

// Hook
app.addHook('preHandler', async (request: FastifyRequest) => {
  if (!isProd) {
    request.log.debug({
      reqId: request.id,
      method: request.method,
      url: request.url,
      body: request.body,
      headers: {
        'content-type': request.headers['content-type'],
        authorization: request.headers.authorization ? '***' : undefined,
      },
    });
  }
});

app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
  const status = reply.statusCode;
  const data = {
    reqId: request.id,
    method: request.method,
    url: request.url,
    status,
    responseTimeMs: reply.elapsedTime,
    remoteAddress: request.ip,
  };

  if (status >= 500) request.log.error({ ...data, type: 'SERVER_ERROR' });
  else if (status >= 400) request.log.warn({ ...data, type: 'CLIENT_ERROR' });
  else request.log.info(data);
});

// Error
app.setErrorHandler((error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error({
    reqId: request.id,
    type: 'SERVER_ERROR',
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
  });
  reply.status(500).send({ error: 'SERVER_ERROR', requestId: request.id });
});

// Routes
app.get('/ping', async () => ({
  status: 'pong',
  timestamp: new Date().toISOString(),
}));

app.register(authRoutes, { prefix: '/auth' });

const start = async (): Promise<void> => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });
  } catch (err: unknown) {
    app.log.fatal(err instanceof Error ? { message: err.message, stack: err.stack } : { err });
    process.exit(1);
  }
};

start();
