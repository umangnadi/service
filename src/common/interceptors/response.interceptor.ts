import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
export interface ApiResponse {
  error: boolean;
  status: number;
  message: string;
  payload: unknown;
}
 
@Injectable()
export class ResponseInterceptor implements NestInterceptor<unknown, ApiResponse> {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<ApiResponse> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<FastifyReply>();
 
    return next.handle().pipe(
      map((data: unknown): ApiResponse => {
        // If already in correct format, use it
        if (this.isApiResponse(data)) {
          response.status(data.status);
          return data;
        }
 
        // Otherwise wrap it
        const statusCode = response.statusCode || 200;
        response.status(statusCode);
 
        return this.createSuccessResponse(statusCode, data);
      })
    );
  }
 
  private isApiResponse(data: unknown): data is ApiResponse {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
 
    const record = data as Record<string, unknown>;
 
    return (
      typeof record.error === 'boolean' &&
      typeof record.status === 'number' &&
      typeof record.message === 'string' &&
      'payload' in record
    );
  }
 
  private createSuccessResponse(status: number, data: unknown): ApiResponse {
    return {
      error: false,
      status,
      message: 'Success',
      payload: data ?? {},
    };
  }
}