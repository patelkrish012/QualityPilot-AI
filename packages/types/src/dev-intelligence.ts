import { z } from 'zod';

export enum AuthorType {
  HUMAN = 'HUMAN',
  AI_ASSISTED = 'AI_ASSISTED',
  COLLABORATIVE_MIXED = 'COLLABORATIVE_MIXED',
}

export enum GitRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const GitCommitAnalysisSchema = z.object({
  commitHash: z.string(),
  authorName: z.string(),
  authorEmail: z.string(),
  message: z.string(),
  timestamp: z.string(),
  stats: z.object({
    filesChanged: z.number(),
    insertions: z.number(),
    deletions: z.number(),
  }),
  aiAuthorshipIndicators: z.object({
    estimatedType: z.nativeEnum(AuthorType),
    confidencePercentage: z.number().min(0).max(100),
    evidenceFactors: z.array(z.string()),
    disclaimer: z.string().default('Heuristic estimate based on commit semantics, comment patterns, and diff velocity. Not a cryptographic or infallible proof of authorship.'),
  }),
  qualityRisk: z.object({
    riskLevel: z.nativeEnum(GitRiskLevel),
    hallucinatedApiSignaturesDetected: z.boolean(),
    missingErrorHandling: z.boolean(),
    missingUnitTests: z.boolean(),
    suspiciousBoilerplateDetected: z.boolean(),
    flags: z.array(z.string()),
  }),
  reviewerRecommendations: z.array(z.string()),
});

export type GitCommitAnalysis = z.infer<typeof GitCommitAnalysisSchema>;

export const PullRequestReviewInputSchema = z.object({
  prNumber: z.number().optional(),
  title: z.string(),
  description: z.string(),
  changedFiles: z.array(
    z.object({
      filename: z.string(),
      status: z.enum(['added', 'modified', 'removed', 'renamed']),
      additions: z.number(),
      deletions: z.number(),
      patch: z.string().optional(),
    })
  ),
  commitMessages: z.array(z.string()).default([]),
});

export type PullRequestReviewInput = z.infer<typeof PullRequestReviewInputSchema>;

export const PullRequestReviewResultSchema = z.object({
  summary: z.string(),
  overallRiskLevel: z.nativeEnum(GitRiskLevel),
  estimatedAuthorshipDistribution: z.object({
    humanPercentage: z.number(),
    aiAssistedPercentage: z.number(),
  }),
  automatedChecklist: z.array(
    z.object({
      category: z.string(),
      passed: z.boolean(),
      details: z.string(),
    })
  ),
  criticalReviewFindings: z.array(
    z.object({
      file: z.string(),
      line: z.number().optional(),
      finding: z.string(),
      suggestedFix: z.string().optional(),
      severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']),
    })
  ),
  mergeApprovalRecommendation: z.enum(['READY_TO_MERGE', 'REQUIRES_MANUAL_REVIEW', 'BLOCK_MERGE']),
});

export type PullRequestReviewResult = z.infer<typeof PullRequestReviewResultSchema>;
