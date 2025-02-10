import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Delete,
  ParseIntPipe,
  Param,
  Put,
} from '@nestjs/common';
import { UserGuard } from '../auth/guards';
import { IUserData } from '../auth/interfaces';
import { UserData } from '../../common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dtos';
import { Workspace } from './workspace.entity';
import { PageDto, PageOptionsDto } from '../../common/dtos';
import { NoContentResponse } from '../../common/response';
import { ISlugAvailabilityResponse } from './interfaces';

@Controller('workspace')
@UseGuards(UserGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async addPersonalData(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @UserData() user: IUserData,
  ): Promise<Workspace> {
    const userId = user.id;

    return this.workspaceService.create(userId, createWorkspaceDto);
  }

  @Get()
  async findAllPaginated(
    @UserData() user: IUserData,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Workspace>> {
    const userId = user.id;
    return this.workspaceService.findAllPaginated(userId, pageOptionsDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NoContentResponse> {
    return this.workspaceService.remove(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UserData() user: IUserData,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const userId = user.id;
    return this.workspaceService.update(id, userId, updateWorkspaceDto);
  }

  @Get('check-slug')
  async checkSlugAvailability(
    @Query('slug') slug: string,
    @UserData() user: IUserData,
  ): Promise<ISlugAvailabilityResponse> {
    const userId = user.id;
    return this.workspaceService.checkSlugAvailability(userId, slug);
  }
}
