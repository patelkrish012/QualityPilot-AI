import { z } from 'zod';
import { ReleaseRisk } from './index';

export const TwinNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['MODULE', 'CODE_FILE', 'ENDPOINT', 'REQUIREMENT', 'TEST_CASE', 'DEFECT', 'RELEASE']),
  label: z.string(),
  riskScore: z.number().min(0).max(100),
  status: z.enum(['HEALTHY', 'WARNING', 'CRITICAL', 'PASS', 'FAIL']),
  metadata: z.record(z.any()).default({}),
});
export type TwinNodeDTO = z.infer<typeof TwinNodeSchema>;

export const TwinEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  relationship: z.enum(['IMPLEMENTS', 'EXPOSES', 'VERIFIES', 'BLOCKS', 'AFFECTS']),
});
export type TwinEdgeDTO = z.infer<typeof TwinEdgeSchema>;

export const DigitalQualityTwinGraphSchema = z.object({
  nodes: z.array(TwinNodeSchema),
  edges: z.array(TwinEdgeSchema),
  highRiskModules: z.array(z.string()),
  calculatedReleaseRisk: z.nativeEnum(ReleaseRisk),
});
export type DigitalQualityTwinGraphDTO = z.infer<typeof DigitalQualityTwinGraphSchema>;

export const ImpactAnalysisRequestSchema = z.object({
  changedFiles: z.array(z.string()),
});
export type ImpactAnalysisRequestDTO = z.infer<typeof ImpactAnalysisRequestSchema>;

export const ImpactAnalysisResultSchema = z.object({
  changedFiles: z.array(z.string()),
  impactedModules: z.array(z.string()),
  impactedRequirements: z.array(z.string()),
  totalTestsAvailable: z.number(),
  selectedTestsToRun: z.array(
    z.object({
      testId: z.string(),
      title: z.string(),
      reason: z.string(),
      priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    }),
  ),
  skippedTestsCount: z.number(),
  efficiencyPercentage: z.number(),
});
export type ImpactAnalysisResultDTO = z.infer<typeof ImpactAnalysisResultSchema>;
