import { z } from 'zod';

export const AccessibilityViolationSchema = z.object({
  id: z.string(), // e.g. "color-contrast", "image-alt", "label"
  impact: z.enum(['minor', 'moderate', 'serious', 'critical']),
  description: z.string(),
  helpUrl: z.string().url(),
  nodesAffected: z.number(),
  targetSelector: z.string(),
  failureSummary: z.string(),
});
export type AccessibilityViolationDTO = z.infer<typeof AccessibilityViolationSchema>;

export const PerformanceMetricsSchema = z.object({
  domContentLoadedMs: z.number(),
  loadTimeMs: z.number(),
  firstContentfulPaintMs: z.number().optional(),
  totalByteSize: z.number(),
  resourceCount: z.number(),
  slowResources: z.array(
    z.object({
      url: z.string(),
      durationMs: z.number(),
      transferSize: z.number(),
    }),
  ),
  coreWebVitalsScore: z.number(), // 0 - 100
});
export type PerformanceMetricsDTO = z.infer<typeof PerformanceMetricsSchema>;

export const AuditReportSchema = z.object({
  targetUrl: z.string().url(),
  accessibilityScore: z.number(), // 0 - 100
  violations: z.array(AccessibilityViolationSchema),
  performance: PerformanceMetricsSchema,
});
export type AuditReportDTO = z.infer<typeof AuditReportSchema>;
