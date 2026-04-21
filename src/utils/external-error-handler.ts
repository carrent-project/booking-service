import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

export const externalErrorHandler = (error: any): never => {
  const statusCode = error.statusCode || error?.status || error?.response?.statusCode;
  const message = error?.message || error?.response?.message;

  switch (statusCode) {
    case 400:
      throw new BadRequestException(message || 'Bad request');
    case 401:
      throw new UnauthorizedException(message || 'Unauthorized');
    case 404:
      throw new NotFoundException(message || 'Not found');
    case 409:
      throw new ConflictException(message || 'Conflict');
    default:
      throw new InternalServerErrorException(
        message || 'Internal server error',
      );
  }
};
