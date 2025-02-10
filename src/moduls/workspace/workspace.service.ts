import { Injectable } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dtos';
import { PageDto, PageMetaDto, PageOptionsDto } from '../../common/dtos';
import { NoContentResponse } from '../../common/response';
import { WorkspaceAlreadyExitsException } from './exceptions';
import { WorkspaceNotFoundException } from './exceptions';
import { ISlugAvailabilityResponse } from './interfaces';
import { getMaxSuffix } from './utils';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async create(
    userId: number,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const existingWorkspace = await this.findByName(
      userId,
      createWorkspaceDto.name,
    );
    if (existingWorkspace) {
      throw new WorkspaceAlreadyExitsException();
    }

    const newWorkspace = this.workspaceRepository.create({
      user: { id: userId },
      ...createWorkspaceDto,
    });

    return this.workspaceRepository.save(newWorkspace);
  }

  async findAllPaginated(
    userId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Workspace>> {
    const [data, totalCount] = await this.workspaceRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      order: {
        createdAt: pageOptionsDto.order,
      },
    });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(data, pageMetaDto);
  }

  async remove(id: number): Promise<NoContentResponse> {
    const workspace = await this.findByIdOrFail(id);

    await this.workspaceRepository.remove(workspace);

    return new NoContentResponse(true, 'Deleted Successfully');
  }

  async findByIdOrFail(id: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneBy({
      id,
    });

    if (!workspace) {
      throw new WorkspaceNotFoundException();
    }

    return workspace;
  }

  async findByName(userId: number, name: string): Promise<Workspace> {
    const existingWorkspace = await this.workspaceRepository.findOneBy({
      name,
      user: { id: userId },
    });

    return existingWorkspace;
  }

  async update(
    id: number,
    userId: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const existingWorkspace = await this.findByIdOrFail(id);

    if (updateWorkspaceDto.name !== existingWorkspace.name) {
      const duplicateWorkspace = await this.findByName(
        userId,
        updateWorkspaceDto.name,
      );
      if (duplicateWorkspace) {
        throw new WorkspaceAlreadyExitsException();
      }
    }

    const updatedWorkspace = this.workspaceRepository.merge(
      existingWorkspace,
      updateWorkspaceDto,
    );

    return this.workspaceRepository.save(updatedWorkspace);
  }

  async checkSlugAvailability(
    userId: number,
    slug: string,
  ): Promise<ISlugAvailabilityResponse> {
    const existingWorkspace = await this.findByName(userId, slug);

    if (!existingWorkspace) {
      return { available: true };
    }

    const similarWorkspaces = await this.workspaceRepository.find({
      select: ['name'],
      where: {
        name: Like(`${slug}%`),
        user: { id: userId },
      },
    });

    const maxSuffix = getMaxSuffix(slug, similarWorkspaces);

    // Suggest next available slug
    const newSlug = `${slug}${maxSuffix + 1}`;

    return { available: false, suggestedSlug: newSlug };
  }
}
