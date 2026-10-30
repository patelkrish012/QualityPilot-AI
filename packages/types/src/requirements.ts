import { z } from 'zod';

export const StructuredRequirementSchema = z.object({
  code: z.string(),
  title: z.string(),
  isAmbiguous: z.boolean(),
  detectedAmbiguities: z.array(z.string()),
  structuredRules: z.array(
    z.object({
      ruleText: z.string(),
      isMeasurable: z.boolean(),
      category: z.enum(['VALIDATION', 'AUTHENTICATION', 'SECURITY', 'ACCESSIBILITY', 'EDGE_CASE']),
    }),
  ),
  suggestedClearRequirement: z.string(),
});
export type StructuredRequirementDTO = z.infer<typeof StructuredRequirementSchema>;

export const GeneratedTestCaseSchema = z.object({
  identifier: z.string(),
  title: z.string(),
  category: z.enum([
    'Positive',
    'Negative',
    'Boundary',
    'EquivalencePartition',
    'Authentication',
    'Authorization',
    'Accessibility',
    'Performance',
    'EdgeCase',
  ]),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  requirementRuleRef: z.string(),
  preconditions: z.array(z.string()).default([]),
  testData: z.record(z.any()).default({}),
  steps: z.array(
    z.object({
      stepNumber: z.number(),
      action: z.string(),
      target: z.string().optional(),
      value: z.string().optional(),
      expectedResult: z.string(),
    }),
  ),
});
export type GeneratedTestCaseDTO = z.infer<typeof GeneratedTestCaseSchema>;

export const TestMatrixGenerationSchema = z.object({
  requirementCode: z.string(),
  totalGenerated: z.number(),
  testCases: z.array(GeneratedTestCaseSchema),
});
export type TestMatrixGenerationDTO = z.infer<typeof TestMatrixGenerationSchema>;
