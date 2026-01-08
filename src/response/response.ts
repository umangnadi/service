/**
* Standard success response structure
*/
export interface SuccessResponse<T = unknown> {
  error: false;
  status: number;
  message: string;
  payload: T;
}
 
/**
* Standard error response structure
*/
export interface ErrorResponse {
  error: true;
  status: number;
  message: string;
  payload: Record<string, unknown>;
}
 
/**
* Creates a standardized success response
*/
export function apiResponse<T = unknown>(status: number, message: string, data: T): SuccessResponse<T> {
  return {
    error: false,
    status,
    message,
    payload: data,
  };
}
 
/**
* Creates a standardized error response
*/
export function errorResponse(status: number, message: string, payload: Record<string, unknown> = {}): ErrorResponse {
  return {
    error: true,
    status,
    message,
    payload,
  };
}
 
/**
* Common success response helpers
*/
export const SuccessResponses = {
  ok: <T>(message: string, data: T): SuccessResponse<T> => apiResponse(200, message, data),
 
  created: <T>(message: string, data: T): SuccessResponse<T> => apiResponse(201, message, data),
 
  accepted: <T>(message: string, data: T): SuccessResponse<T> => apiResponse(202, message, data),
 
  noContent: (): SuccessResponse<Record<string, never>> => apiResponse(204, 'No Content', {}),
} as const;
 
/**
* Common error response helpers
*/
export const ErrorResponses = {
  badRequest: (message: string, payload?: Record<string, unknown>): ErrorResponse =>
    errorResponse(400, message, payload),
 
  unauthorized: (message = 'Unauthorized'): ErrorResponse => errorResponse(401, message),
 
  forbidden: (message = 'Forbidden'): ErrorResponse => errorResponse(403, message),
 
  notFound: (message = 'Resource not found'): ErrorResponse => errorResponse(404, message),
 
  conflict: (message: string, payload?: Record<string, unknown>): ErrorResponse => errorResponse(409, message, payload),
 
  unprocessable: (message: string, payload?: Record<string, unknown>): ErrorResponse =>
    errorResponse(422, message, payload),
 
  tooManyRequests: (message = 'Too many requests'): ErrorResponse => errorResponse(429, message),
 
  internalError: (message = 'Internal server error'): ErrorResponse => errorResponse(500, message),
} as const;