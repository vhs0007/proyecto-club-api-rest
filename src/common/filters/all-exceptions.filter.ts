import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = isHttpException ? exception.getResponse() : { message: 'Internal error' };
    const message =
      isHttpException && typeof responseBody === 'object' && responseBody && 'message' in responseBody
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (responseBody as any).message
        : undefined;

    // Loguea algo útil para debug (stack + endpoint + status)
    // Nota: Nest ya arma la respuesta final; este log solo sirve para consola.
    // eslint-disable-next-line no-console
    console.error(
      `[${request?.method ?? 'UNKNOWN'} ${request?.url ?? 'UNKNOWN'}] ${status}${
        message ? ` - ${JSON.stringify(message)}` : ''
      }`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json(responseBody);
  }
}

