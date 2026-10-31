"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceAnalysisResultSchema = exports.CodeFindingSchema = exports.RepositoryConnectSchema = void 0;
const zod_1 = require("zod");
const index_1 = require("./index");
exports.RepositoryConnectSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    repoUrl: zod_1.z.string().url('A valid repository URL is required'),
    branch: zod_1.z.string().default('main'),
    authToken: zod_1.z.string().optional(),
});
exports.CodeFindingSchema = zod_1.z.object({
    file: zod_1.z.string(),
    line: zod_1.z.number(),
    column: zod_1.z.number().optional(),
    ruleId: zod_1.z.string(),
    title: zod_1.z.string(),
    severity: zod_1.z.nativeEnum(index_1.Severity),
    description: zod_1.z.string(),
    codeSnippet: zod_1.z.string(),
    recommendation: zod_1.z.string(),
});
exports.SourceAnalysisResultSchema = zod_1.z.object({
    repositoryUrl: zod_1.z.string(),
    branch: zod_1.z.string(),
    commitSha: zod_1.z.string(),
    totalFilesScanned: zod_1.z.number(),
    totalLinesOfCode: zod_1.z.number(),
    findings: zod_1.z.array(exports.CodeFindingSchema),
    endpointsDiscovered: zod_1.z.array(zod_1.z.object({
        method: zod_1.z.string(),
        path: zod_1.z.string(),
        sourceLocation: zod_1.z.string(),
    })),
    codeQualityScore: zod_1.z.number(), // 0 - 100
    maintainabilityIndex: zod_1.z.enum(['A', 'B', 'C', 'D', 'F']),
});
