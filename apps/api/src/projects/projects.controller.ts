import { Controller, Get, Post, Body, Param, Headers, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDTO } from '@qualitypilot/types';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project workspace under an organization' })
  @ApiHeader({ name: 'x-organization-id', required: true, description: 'Tenant Organization UUID' })
  @ApiResponse({ status: 201, description: 'Project created' })
  async create(
    @Headers('x-organization-id') orgId: string,
    @Body() dto: CreateProjectDTO,
  ) {
    if (!orgId) {
      throw new BadRequestException('Organization header (x-organization-id) is required.');
    }
    return this.projectsService.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all projects for the specified organization' })
  @ApiHeader({ name: 'x-organization-id', required: true })
  async findAll(@Headers('x-organization-id') orgId: string) {
    if (!orgId) {
      throw new BadRequestException('Organization header (x-organization-id) is required.');
    }
    return this.projectsService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed project information including suites and runs' })
  @ApiHeader({ name: 'x-organization-id', required: true })
  async findOne(
    @Headers('x-organization-id') orgId: string,
    @Param('id') id: string,
  ) {
    if (!orgId) {
      throw new BadRequestException('Organization header (x-organization-id) is required.');
    }
    return this.projectsService.findOne(id, orgId);
  }
}
