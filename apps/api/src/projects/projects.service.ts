import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDTO } from '@qualitypilot/types';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateProjectDTO) {
    return this.prisma.project.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        targetUrl: dto.targetUrl,
        mode: dto.mode,
        repositoryUrl: dto.repositoryUrl,
        branch: dto.branch || 'main',
        applications: {
          create: {
            name: `${dto.name} Core Application`,
            environments: {
              create: {
                name: 'Production',
                baseUrl: dto.targetUrl,
                isDefault: true,
              },
            },
          },
        },
      },
      include: {
        applications: {
          include: { environments: true },
        },
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: {
        applications: true,
        testRuns: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organizationId },
      include: {
        applications: { include: { environments: true } },
        requirements: { include: { rules: true } },
        testSuites: { include: { testCases: true } },
        testRuns: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    return project;
  }
}
