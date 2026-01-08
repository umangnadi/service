import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ZodValidationException } from 'nestjs-zod';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { errorResponse } from 'src/response/response';
 
// Using the type from ZodError directly
type ValidationIssue = ZodError['issues'][number];
 
@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodExceptionFilter.name);
 
  catch(exception: ZodValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
 
    const zodError = exception.getZodError() as ZodError;
    const issue = zodError.issues[0];
 
    const message = issue?.message ?? 'Validation failed';
    const payload = this.createPayload(issue);
 
    this.logError(message, payload, request);
    response.status(400).send(errorResponse(400, message, payload));
  }
 
  private createPayload(issue: ValidationIssue | undefined): Record<string, unknown> {
    if (!issue) {
      return { code: 'validation_error', path: [] };
    }
 
    const path = issue.path.filter((p): p is string | number => typeof p !== 'symbol');
 
    const base: Record<string, unknown> = {
      code: issue.code,
      path,
    };
 
    return { ...base, ...this.extractFields(issue) };
  }
 
  private extractFields(issue: ValidationIssue): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const source = issue as unknown as Record<string, unknown>;
 
    const fields = [
      'expected',
      'received',
      'minimum',
      'maximum',
      'inclusive',
      'exact',
      'multipleOf',
      'validation',
      'keys',
      'options',
      'type',
    ];
 
    fields.forEach((field) => {
      if (source[field] !== undefined) {
        result[field] = source[field];
      }
    });
 
    return result;
  }
 
  private logError(message: string, payload: Record<string, unknown>, request: FastifyRequest): void {
    const pathArray = payload.path as Array<string | number>;
    const pathStr = pathArray?.length > 0 ? pathArray.join('.') : 'root';
 
    this.logger.warn(`Validation failed at "${pathStr}": ${message} [${request.method} ${request.url}]`);
  }
}