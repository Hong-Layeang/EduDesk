import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { map, Observable } from 'rxjs';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

function isRawResponse(contentType: string, data: unknown): boolean {
  if (
    contentType.includes('text/html') ||
    contentType.includes('application/javascript') ||
    contentType.includes('text/javascript') ||
    contentType.includes('text/csv') ||
    contentType.includes('application/csv') ||
    contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  ) {
    return true;
  }
  return typeof data === 'string' && data.trimStart().toLowerCase().startsWith('<!doctype html');
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const httpResponse = http.getResponse<ExpressResponse>();
    const statusCode = httpResponse.statusCode;

    return next.handle().pipe(
      map((data: unknown) => {
        const contentType = String(httpResponse.getHeader('content-type') ?? '');
        if (isRawResponse(contentType, data)) {
          return data as ApiResponse<T>;
        }

        const payload = data as Record<string, unknown> | null | undefined;

        const envelope: Record<string, unknown> = {
          statusCode: payload?.statusCode ?? statusCode,
          message: payload?.message ?? 'Success',
          data: payload?.data ?? data,
          timestamp: new Date().toISOString(),
        };

        if (payload?.meta) {
          envelope.meta = payload.meta;
        }

        return envelope as unknown as ApiResponse<T>;
      }),
    );
  }
}
