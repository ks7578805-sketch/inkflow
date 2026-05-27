import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser = require('cookie-parser');
import express = require('express');
import { AppModule } from './app.module';

const DEFAULT_WEB_ORIGINS = ['http://localhost:5173'];

function splitEnvList(value?: string) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildOriginMatchers() {
  const exactOrigins = new Set<string>([
    ...DEFAULT_WEB_ORIGINS,
    ...splitEnvList(process.env.WEB_APP_URL),
    ...splitEnvList(process.env.CORS_ALLOWED_ORIGINS),
  ]);

  const regexOrigins = splitEnvList(process.env.CORS_ALLOWED_ORIGIN_REGEXES)
    .map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch {
        return null;
      }
    })
    .filter((pattern): pattern is RegExp => pattern instanceof RegExp);

  return { exactOrigins, regexOrigins };
}

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  const { exactOrigins, regexOrigins } = buildOriginMatchers();
  if (exactOrigins.has(origin)) {
    return true;
  }

  return regexOrigins.some((pattern) => pattern.test(origin));
}

export async function createInkflowApp(expressApp?: express.Express) {
  const app = expressApp
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { cors: false })
    : await NestFactory.create(AppModule, { cors: false });

  configureInkflowApp(app);
  await app.init();
  return app;
}

function configureInkflowApp(app: INestApplication) {
  app.enableCors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('v1');
}
