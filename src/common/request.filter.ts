import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
    });
  }
}
