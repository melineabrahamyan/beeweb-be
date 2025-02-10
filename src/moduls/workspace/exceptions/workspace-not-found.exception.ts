import { NotFoundException } from '@nestjs/common';

export class WorkspaceNotFoundException extends NotFoundException {
  constructor() {
    super(`Workspace Not Found`);
  }
}
