"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTestSuiteResultSchema = exports.ApiEndpointTestSchema = void 0;
const zod_1 = require("zod");
exports.ApiEndpointTestSchema = zod_1.z.object({
    id: zod_1.z.string(),
    method: zod_1.z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    path: zod_1.z.string(),
    expectedStatus: zod_1.z.number(),
    actualStatus: zod_1.z.number(),
    responseTimeMs: zod_1.z.number(),
    isSchemaValid: zod_1.z.boolean(),
    headersChecked: zod_1.z.record(zod_1.z.string()).default({}),
    passed: zod_1.z.boolean(),
    failureReason: zod_1.z.string().optional(),
});
exports.ApiTestSuiteResultSchema = zod_1.z.object({
    targetBaseUrl: zod_1.z.string().url(),
    totalEndpointsTested: zod_1.z.number(),
    passedEndpoints: zod_1.z.number(),
    failedEndpoints: zod_1.z.number(),
    averageLatencyMs: zod_1.z.number(),
    apiQualityScore: zod_1.z.number().min(0).max(100),
    endpointResults: zod_1.z.array(exports.ApiEndpointTestSchema),
});
