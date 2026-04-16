import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal Server Error";

    // Log the error for internal debugging
    if (status >= 500) {
      this.logger.error(
        `Status: ${status} Error: ${JSON.stringify(message)} Path: ${request.url}`,
        exception instanceof Error ? exception.stack : "",
      );
    } else {
      this.logger.warn(
        `Status: ${status} Error: ${JSON.stringify(message)} Path: ${request.url}`,
      );
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === "object" && message !== null
          ? (message as any).message || message
          : message,
    };

    response.status(status).json(responseBody);
  }
}
