import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { errorResponse } from 'src/response/response';
 
interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  errors?: Array<{
    message?: string;
    path?: Array<string | number>;
    code?: string;
  }>;
}
 
interface LogContext {
  method: string;
  url: string;
  ip: string;
  userAgent: string | undefined;
  status: number;
}
 
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isProduction: boolean;
 
  constructor(private readonly configService?: ConfigService) {
    this.isProduction = configService?.get<string>('NODE_ENV') === 'production';
  }
 
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
 
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let payload: Record<string, unknown> = {};
 
    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
 
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseObj = exceptionResponse as HttpExceptionResponse;
        message = this.extractMessage(responseObj);
        payload = this.extractPayload(responseObj);
      }
    }
    // Handle standard Error
    else if (exception instanceof Error) {
      message = this.isProduction ? 'Internal server error' : exception.message;
 
      if (!this.isProduction) {
        payload = {
          name: exception.name,
          stack: exception.stack?.split('\n').slice(0, 3),
        };
      }
    }
 
    // Log error
    this.logError(status, message, exception, request);
 
    // Send response
    response.status(status).send(errorResponse(status, message, payload));
  }
 
  private extractMessage(response: HttpExceptionResponse): string {
    if (Array.isArray(response.message)) {
      return response.message[0] ?? 'Validation failed';
    }
    return response.message ?? 'An error occurred';
  }
 
  private extractPayload(response: HttpExceptionResponse): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
 
    if (response.errors && Array.isArray(response.errors)) {
      const firstError = response.errors[0];
      if (firstError) {
        if (firstError.path && firstError.path[0]) {
          payload.path = firstError.path[0];
        }
        if (firstError.code) {
          payload.code = firstError.code;
        }
      }
    } else if (response.error) {
      payload.error = response.error;
    }
 
    return payload;
  }
 
  private logError(status: number, message: string, exception: unknown, request: FastifyRequest): void {
    const logContext: LogContext = {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      status,
    };
 
    if (status >= 500) {
      this.logger.error(
        `[${status}] ${message}`,
        exception instanceof Error ? exception.stack : String(exception),
        JSON.stringify(logContext)
      );
    } else if (status >= 400) {
      this.logger.warn(`[${status}] ${message} - ${JSON.stringify(logContext)}`);
    }
  }
}