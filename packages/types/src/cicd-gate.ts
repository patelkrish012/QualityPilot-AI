import { z } from 'zod';

export enum QualityGateStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  WARNING = 'WARNING',
}

export enum PipelineAction {
  ALLOW_DEPLOYMENT = 'ALLOW_DEPLOYMENT',
  BLOCK_DEPLOYMENT = 'BLOCK_DEPLOYMENT',
}

export const GitHubWebhookPayloadSchema = z.object({
  action: z.string(),
  repository: z.object({
    name: z.string(),
    full_name: z.string(),
    clone_url: z.string().optional(),
  }),
  pull_request: z.object({
    number: z.number(),
    title: z.string(),
    head: z.object({
      sha: z.string(),
      ref: z.string(),
    }),
    base: z.object({
      ref: z.string(),
    }),
  }).optional(),
  sender: z.object({
    login: z.string(),
  }),
});

export type GitHubWebhookPayload = z.infer<typeof GitHubWebhookPayloadSchema>;

export const QualityGateEvaluationSchema = z.object({
  gateId: z.string(),
  repository: z.string(),
  commitSha: z.string(),
  branch: z.string(),
  evaluatedAt: z.string(),
  exitCode: z.number().int(), // 0 for pass, 1 for fail
  status: z.nativeEnum(QualityGateStatus),
  action: z.nativeEnum(PipelineAction),
  thresholds: z.object({
    minQualityScore: z.number(),
    maxCriticalDefects: z.number(),
    minTestPassRate: z.number(),
  }),
  actualMetrics: z.object({
    qualityScore: z.number(),
    criticalDefectsFound: z.number(),
    testPassRate: z.number(),
    securityVulnerabilities: z.number(),
  }),
  reasons: z.array(z.string()),
  markdownSummary: z.string(),
});

export type QualityGateEvaluation = z.infer<typeof QualityGateEvaluationSchema>;
