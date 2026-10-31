"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMatrixGenerationSchema = exports.GeneratedTestCaseSchema = exports.StructuredRequirementSchema = void 0;
const zod_1 = require("zod");
exports.StructuredRequirementSchema = zod_1.z.object({
    code: zod_1.z.string(),
    title: zod_1.z.string(),
    isAmbiguous: zod_1.z.boolean(),
    detectedAmbiguities: zod_1.z.array(zod_1.z.string()),
    structuredRules: zod_1.z.array(zod_1.z.object({
        ruleText: zod_1.z.string(),
        isMeasurable: zod_1.z.boolean(),
        category: zod_1.z.enum(['VALIDATION', 'AUTHENTICATION', 'SECURITY', 'ACCESSIBILITY', 'EDGE_CASE']),
    })),
    suggestedClearRequirement: zod_1.z.string(),
});
exports.GeneratedTestCaseSchema = zod_1.z.object({
    identifier: zod_1.z.string(),
    title: zod_1.z.string(),
    category: zod_1.z.enum([
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
    priority: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    requirementRuleRef: zod_1.z.string(),
    preconditions: zod_1.z.array(zod_1.z.string()).default([]),
    testData: zod_1.z.record(zod_1.z.any()).default({}),
    steps: zod_1.z.array(zod_1.z.object({
        stepNumber: zod_1.z.number(),
        action: zod_1.z.string(),
        target: zod_1.z.string().optional(),
        value: zod_1.z.string().optional(),
        expectedResult: zod_1.z.string(),
    })),
});
exports.TestMatrixGenerationSchema = zod_1.z.object({
    requirementCode: zod_1.z.string(),
    totalGenerated: zod_1.z.number(),
    testCases: zod_1.z.array(exports.GeneratedTestCaseSchema),
});
