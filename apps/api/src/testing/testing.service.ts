import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StartTestRunDTO, TestRunStatus, TestStatus, Severity, ReleaseRisk, ReleaseRecommendation } from '@qualitypilot/types';

@Injectable()
export class TestingService {
  constructor(private readonly prisma: PrismaService) {}

  async createTestRun(dto: StartTestRunDTO) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new Error(`Project ${dto.projectId} not found`);
    }

    const targetUrl = dto.targetUrl || project.targetUrl;

    const testRun = await this.prisma.testRun.create({
      data: {
        projectId: project.id,
        status: TestRunStatus.QUEUED,
        depth: dto.depth,
        targetUrl,
      },
    });

    return testRun;
  }

  async getTestRunDetails(runId: string) {
    return this.prisma.testRun.findUnique({
      where: { id: runId },
      include: {
        testResults: {
          include: { evidences: true, defects: true },
        },
        defects: true,
        report: true,
      },
    });
  }

  async listProjectRuns(projectId: string) {
    return this.prisma.testRun.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
