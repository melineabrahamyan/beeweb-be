import { ConflictException } from '@nestjs/common';

export class UserAlreadyExitsException extends ConflictException {
  constructor() {
    super(`User Already Exists`);
  }
}
