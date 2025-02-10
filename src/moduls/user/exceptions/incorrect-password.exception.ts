import { NotFoundException } from '@nestjs/common';

export class IncorrectPasswordException extends NotFoundException {
  constructor() {
    super(`Current password is incorrect.`);
  }
}
