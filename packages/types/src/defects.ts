import { z } from 'zod';
import { Severity, AIConfidence } from './index';

export const DefectAnalysisRequestSchema = z.object({
  testId: z.string(),
  testTitle: z.string(),
  targetUrl: z.string().url(),
  observedFact: z.string(),
  errorMessage: z.string().optional(),
  consoleErrors: z.array(z.string()).default([]),
  statusCode: z.number().optional(),
  sourceSnippet: z.string().optional(),
  screenshotUrl: z.string().optional(),
});
export type DefectAnalysisRequestDTO = z.infer<typeof DefectAnalysisRequestSchema>;

export const SuggestedCodePatchSchema = z.object({
  targetFile: z.string(),
  explanation: z.string(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  diff: z.string(),
  testsToRerun: z.array(z.string()),
});
export type SuggestedCodePatchDTO = z.infer<typeof SuggestedCodePatchSchema>;

export const ComprehensiveDefectSchema = z.object({
  defectId: z.string(),
  title: z.string(),
  severity: z.nativeEnum(Severity),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  component: z.string(),
  url: z.string(),
  observedFact: z.string(), // DETERMINISTIC FACT
  aiHypothesis: z.string(), // AI REASONING
  aiConfidence: z.nativeEnum(AIConfidence),
  businessImpact: z.string(),
  suggestedPatch: SuggestedCodePatchSchema.optional(),
  retestVerification: z.object({
    beforeFixStatus: z.string().default('FAIL'),
    afterFixStatus: z.string().default('PENDING'),
    regressionStatus: z.string().default('PENDING'),
    isVerified: z.boolean().default(false),
  }),
});
export type ComprehensiveDefectDTO = z.infer<typeof ComprehensiveDefectSchema>;
