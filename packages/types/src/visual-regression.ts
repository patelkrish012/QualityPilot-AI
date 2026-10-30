import { z } from 'zod';

export const VisualComparisonSchema = z.object({
  testId: z.string(),
  url: z.string().url(),
  baselineScreenshotBase64: z.string(),
  currentScreenshotBase64: z.string(),
  diffScreenshotBase64: z.string().optional(),
  mismatchPercentage: z.number().min(0).max(100),
  isShiftDetected: z.boolean(),
  viewport: z.object({
    width: z.number(),
    height: z.number(),
    deviceType: z.enum(['DESKTOP', 'TABLET', 'MOBILE']),
  }),
  status: z.enum(['MATCH', 'VISUAL_DIFF_WARNING', 'REGRESSION_DETECTED']),
  detectedDiffAreas: z.array(z.string()),
});
export type VisualComparisonDTO = z.infer<typeof VisualComparisonSchema>;

export const VisualRegressionSuiteResultSchema = z.object({
  targetUrl: z.string(),
  totalScreensCompared: z.number(),
  passedScreens: z.number(),
  regressedScreens: z.number(),
  visualStabilityScore: z.number().min(0).max(100),
  comparisons: z.array(VisualComparisonSchema),
});
export type VisualRegressionSuiteResultDTO = z.infer<typeof VisualRegressionSuiteResultSchema>;
