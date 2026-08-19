import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';
import { AppLogger } from '../services/app-logger.service';
import { QueryFailedError } from 'typeorm';
import { TDriverError } from '../types/typeorm/driver-error';

function buildErrorResponse(exception: Error, path: string) {
  const response: Record<string, any> = {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    data: null,
    timestamp: new Date().toISOString(),
    path,
  };

  if (exception instanceof QueryFailedError) {
    const driverError = exception.driverError as TDriverError;

    if (driverError.code === '23505') {
      response.statusCode = HttpStatus.CONFLICT;
      response.message = driverError.detail ?? 'Duplicate entry';
      return response;
    }

    if (driverError.code === '23503') {
      response.statusCode = HttpStatus.CONFLICT;
      response.message =
        'Cannot complete this action because the record is referenced by other data.';
      return response;
    }

    return response;
  }

  if (exception instanceof HttpException) {
    const exceptionResponse = exception.getResponse();
    const messages =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse['message']
        : null;

    response.statusCode = exception.getStatus();
    response.message = exception.message;

    if (Array.isArray(messages) && messages.length > 0) {
      response.errors = messages;
    }

    return response;
  }

  return response;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly appLogger: AppLogger,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const path = httpAdapter.getRequestUrl(request) as string;

    const errorResponse = buildErrorResponse(exception, path);

    if (errorResponse.statusCode >= 500) {
      this.appLogger.error(`Exception: ${exception.message}`, exception.stack);
    } else {
      this.appLogger.warn(`Exception: ${exception.message}`);
    }

    httpAdapter.reply(ctx.getResponse(), errorResponse, errorResponse.statusCode as number);
  }
}
