"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualRegressionSuiteResultSchema = exports.VisualComparisonSchema = void 0;
const zod_1 = require("zod");
exports.VisualComparisonSchema = zod_1.z.object({
    testId: zod_1.z.string(),
    url: zod_1.z.string().url(),
    baselineScreenshotBase64: zod_1.z.string(),
    currentScreenshotBase64: zod_1.z.string(),
    diffScreenshotBase64: zod_1.z.string().optional(),
    mismatchPercentage: zod_1.z.number().min(0).max(100),
    isShiftDetected: zod_1.z.boolean(),
    viewport: zod_1.z.object({
        width: zod_1.z.number(),
        height: zod_1.z.number(),
        deviceType: zod_1.z.enum(['DESKTOP', 'TABLET', 'MOBILE']),
    }),
    status: zod_1.z.enum(['MATCH', 'VISUAL_DIFF_WARNING', 'REGRESSION_DETECTED']),
    detectedDiffAreas: zod_1.z.array(zod_1.z.string()),
});
exports.VisualRegressionSuiteResultSchema = zod_1.z.object({
    targetUrl: zod_1.z.string(),
    totalScreensCompared: zod_1.z.number(),
    passedScreens: zod_1.z.number(),
    regressedScreens: zod_1.z.number(),
    visualStabilityScore: zod_1.z.number().min(0).max(100),
    comparisons: zod_1.z.array(exports.VisualComparisonSchema),
});
