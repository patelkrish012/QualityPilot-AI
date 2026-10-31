"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactAnalysisResultSchema = exports.ImpactAnalysisRequestSchema = exports.DigitalQualityTwinGraphSchema = exports.TwinEdgeSchema = exports.TwinNodeSchema = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
exports.TwinNodeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(['MODULE', 'CODE_FILE', 'ENDPOINT', 'REQUIREMENT', 'TEST_CASE', 'DEFECT', 'RELEASE']),
    label: zod_1.z.string(),
    riskScore: zod_1.z.number().min(0).max(100),
    status: zod_1.z.enum(['HEALTHY', 'WARNING', 'CRITICAL', 'PASS', 'FAIL']),
    metadata: zod_1.z.record(zod_1.z.any()).default({}),
});
exports.TwinEdgeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    source: zod_1.z.string(),
    target: zod_1.z.string(),
    relationship: zod_1.z.enum(['IMPLEMENTS', 'EXPOSES', 'VERIFIES', 'BLOCKS', 'AFFECTS']),
});
exports.DigitalQualityTwinGraphSchema = zod_1.z.object({
    nodes: zod_1.z.array(exports.TwinNodeSchema),
    edges: zod_1.z.array(exports.TwinEdgeSchema),
    highRiskModules: zod_1.z.array(zod_1.z.string()),
    calculatedReleaseRisk: zod_1.z.nativeEnum(index_1.ReleaseRisk),
});
exports.ImpactAnalysisRequestSchema = zod_1.z.object({
    changedFiles: zod_1.z.array(zod_1.z.string()),
});
exports.ImpactAnalysisResultSchema = zod_1.z.object({
    changedFiles: zod_1.z.array(zod_1.z.string()),
    impactedModules: zod_1.z.array(zod_1.z.string()),
    impactedRequirements: zod_1.z.array(zod_1.z.string()),
    totalTestsAvailable: zod_1.z.number(),
    selectedTestsToRun: zod_1.z.array(zod_1.z.object({
        testId: zod_1.z.string(),
        title: zod_1.z.string(),
        reason: zod_1.z.string(),
        priority: zod_1.z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    })),
    skippedTestsCount: zod_1.z.number(),
    efficiencyPercentage: zod_1.z.number(),
});
