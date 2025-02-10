import { ConflictException } from '@nestjs/common';

export class WorkspaceAlreadyExitsException extends ConflictException {
  constructor() {
    super(`Workspace with this name already exists`);
  }
}
