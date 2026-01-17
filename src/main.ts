import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { Logger, VersioningType } from '@nestjs/common';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        bodyLimit: 10 * 1024 * 1024, // 10 MB
        logger: process.env.NODE_ENV !== 'production',
        trustProxy: process.env.TRUST_PROXY === 'true',
      })
    );

    const configService = app.get(ConfigService);

    /*
      CORS Configuration
    */
    const corsOrigin = configService.get<string>('CORS_ORIGIN');
    const allowedOrigins = corsOrigin ? corsOrigin.split(',') : [];

    await app.register(cors, {
      origin: process.env.NODE_ENV === 'production' ? (allowedOrigins.length > 0 ? allowedOrigins : false) : '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    /*
      Security Headers
    */

    await app.register(helmet, {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    });
    await app.register(multipart, {
      attachFieldsToBody: true,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    });

    /*
      Rate Limiting
    */
    await app.register(rateLimit, {
      global: true,
      max: configService.get<number>('RATE_LIMIT_MAX') ?? 100,
      timeWindow: configService.get<number>('RATE_LIMIT_WINDOW') ?? 15 * 60 * 1000,
      errorResponseBuilder: (request, context) => ({
        error: true,
        status: 429,
        message: 'Too many requests, please try again later.',
        payload: {
          limit: context.max,
          remaining: 0,
          resetTime: new Date(Date.now() + Number(context.after)).toISOString(),
        },
      }),
    });

    /*
      Global Configuration
    */
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.enableShutdownHooks();

    /*
      1. Validates request data (body, query, params) using Zod schemas
    */
    app.useGlobalPipes(new ZodValidationPipe());

    /*
      1. ZodExceptionFilter : Zod-Specific Error Formatter
          1. ONLY when a ZodValidationException occurs
          2. Extracts Zod error details
          3. Picks the first meaningful validation error
          4. Converts it into your standard error response format
  
      2. AllExceptionsFilter: Global Error Safety Net
          1. Catches EVERY exception
          2. Acts as a fallback
          3. Runs if: HttpException, UnauthorizedException, NotFoundException, Error, Unexpected crashes
    */
    app.useGlobalFilters(new ZodExceptionFilter(), new AllExceptionsFilter());

    /*
      1. Standardizes all successful responses
      2. Automatically sets HTTP status
      3. Prevents double-wrapping
    */
    app.useGlobalInterceptors(new ResponseInterceptor());

    const port = configService.get<number>('PORT', 5001);
    const host = configService.get<string>('HOST', '0.0.0.0');

    await app.listen(port, host);
  } catch (error) {
    logger.error('Application failed to start:', error);
    process.exit(1);
  }
}
bootstrap();
