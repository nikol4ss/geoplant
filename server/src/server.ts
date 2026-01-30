import { authController } from './modules/auth/auth.controller.js';

import Fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

import cors from '@fastify/cors';

import dotenv from 'dotenv';

import crypto from 'crypto';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const app = Fastify({
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

app.register(cors, { origin: '*' });

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

  if (status >= 500) {
    request.log.error({ ...data, type: 'SERVER_ERROR' });
  } else if (status >= 400) {
    request.log.warn({ ...data, type: 'CLIENT_ERROR' });
  } else {
    request.log.info(data);
  }
});

app.setErrorHandler((error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof Error) {
    request.log.error({
      reqId: request.id,
      type: 'SERVER_ERROR',
      message: error.message,
      stack: error.stack,
    });
  } else {
    request.log.error({
      reqId: request.id,
      type: 'SERVER_ERROR',
      error,
    });
  }

  reply.status(500).send({
    error: 'SERVER_ERROR',
    requestId: request.id,
  });
});

app.get('/ping', async () => ({
  status: 'pong',
  timestamp: new Date().toISOString(),
}));

app.post('/signup', authController.signup);

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
