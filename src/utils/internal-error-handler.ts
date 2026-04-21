import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

export const internalErrorHandler = (status: HttpStatus, message?: string): never => {
  switch (status) {
    case 400:
      throw new BadRequestException(message || "Bad request");
    case 401:
      throw new UnauthorizedException(message || "Unauthorized");
    case 403:
      throw new ForbiddenException(message || "Forbidden");
    case 404:
      throw new NotFoundException(message || "Not found");
    case 409:
      throw new ConflictException(message || "Conflict");
    default:
      throw new InternalServerErrorException(
        message || "Internal server error",
      );
  }
};
