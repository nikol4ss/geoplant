import Fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';

import cors from '@fastify/cors';

import dotenv from 'dotenv';

import pino from 'pino';

dotenv.config();

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
});

const app = Fastify({ logger: false });

// CORS
app.register(cors, { origin: '*' });

// Hooks
app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
  (request as any).startTime = Date.now();

  logger.info(
    {
      method: request.method,
      url: request.url,
      headers: request.headers,
      remoteAddress: request.ip,
    },
    'Request Start',
  );
});

app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    logger.info(
      {
        method: request.method,
        url: request.url,
        body: request.body,
      },
      'Request Body',
    );
  }
});

app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
  const responseTime = Date.now() - ((request as any).startTime || Date.now());
  const logData = {
    method: request.method,
    url: request.url,
    status: reply.statusCode,
    responseTime: `${responseTime}ms`,
  };

  if (reply.statusCode >= 500) logger.error(logData, 'Server Error');
  else if (reply.statusCode >= 400) logger.warn(logData, 'Client Error');
  else logger.info(logData, 'Request Completed');
});

app.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload: any) => {
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    logger.info(
      {
        method: request.method,
        url: request.url,
        status: reply.statusCode,
        responseBody: payload,
      },
      'Response Body',
    );
  }
  return payload;
});

app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
  logger.error(
    {
      method: request.method,
      url: request.url,
      message: error.message,
      stack: error.stack,
    },
    'Unhandled Exception',
  );

  reply.status(500).send({ error: 'Internal Server Error', message: error.message });
});

// Routes
app.get('/ping', async () => ({
  status: 'pong',
  timestamp: new Date().toISOString(),
}));

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    logger.info(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

start();
