import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = isHttpException
      ? exception.getResponse()
      : { message: 'Internal error' };
    const message =
      isHttpException &&
      typeof responseBody === 'object' &&
      responseBody &&
      'message' in responseBody
        ? (responseBody as any).message
        : undefined;

    const requestId = request.requestId;
    const idPart = requestId ? `${requestId} ` : '';

    this.logger.error(
      `[${idPart}${request?.method ?? 'UNKNOWN'} ${request?.url ?? 'UNKNOWN'}] ${status}${
        message ? ` - ${JSON.stringify(message)}` : ''
      }`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json(responseBody);
  }
}
