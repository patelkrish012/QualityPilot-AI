"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditReportSchema = exports.PerformanceMetricsSchema = exports.AccessibilityViolationSchema = void 0;
const zod_1 = require("zod");
exports.AccessibilityViolationSchema = zod_1.z.object({
    id: zod_1.z.string(), // e.g. "color-contrast", "image-alt", "label"
    impact: zod_1.z.enum(['minor', 'moderate', 'serious', 'critical']),
    description: zod_1.z.string(),
    helpUrl: zod_1.z.string().url(),
    nodesAffected: zod_1.z.number(),
    targetSelector: zod_1.z.string(),
    failureSummary: zod_1.z.string(),
});
exports.PerformanceMetricsSchema = zod_1.z.object({
    domContentLoadedMs: zod_1.z.number(),
    loadTimeMs: zod_1.z.number(),
    firstContentfulPaintMs: zod_1.z.number().optional(),
    totalByteSize: zod_1.z.number(),
    resourceCount: zod_1.z.number(),
    slowResources: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string(),
        durationMs: zod_1.z.number(),
        transferSize: zod_1.z.number(),
    })),
    coreWebVitalsScore: zod_1.z.number(), // 0 - 100
});
exports.AuditReportSchema = zod_1.z.object({
    targetUrl: zod_1.z.string().url(),
    accessibilityScore: zod_1.z.number(), // 0 - 100
    violations: zod_1.z.array(exports.AccessibilityViolationSchema),
    performance: exports.PerformanceMetricsSchema,
});
