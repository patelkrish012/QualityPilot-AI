import { z } from 'zod';
export declare const ApiEndpointTestSchema: z.ZodObject<{
    id: z.ZodString;
    method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
    path: z.ZodString;
    expectedStatus: z.ZodNumber;
    actualStatus: z.ZodNumber;
    responseTimeMs: z.ZodNumber;
    isSchemaValid: z.ZodBoolean;
    headersChecked: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    passed: z.ZodBoolean;
    failureReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    expectedStatus: number;
    actualStatus: number;
    responseTimeMs: number;
    isSchemaValid: boolean;
    headersChecked: Record<string, string>;
    passed: boolean;
    failureReason?: string | undefined;
}, {
    id: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    expectedStatus: number;
    actualStatus: number;
    responseTimeMs: number;
    isSchemaValid: boolean;
    passed: boolean;
    headersChecked?: Record<string, string> | undefined;
    failureReason?: string | undefined;
}>;
export type ApiEndpointTestDTO = z.infer<typeof ApiEndpointTestSchema>;
export declare const ApiTestSuiteResultSchema: z.ZodObject<{
    targetBaseUrl: z.ZodString;
    totalEndpointsTested: z.ZodNumber;
    passedEndpoints: z.ZodNumber;
    failedEndpoints: z.ZodNumber;
    averageLatencyMs: z.ZodNumber;
    apiQualityScore: z.ZodNumber;
    endpointResults: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE"]>;
        path: z.ZodString;
        expectedStatus: z.ZodNumber;
        actualStatus: z.ZodNumber;
        responseTimeMs: z.ZodNumber;
        isSchemaValid: z.ZodBoolean;
        headersChecked: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
        passed: z.ZodBoolean;
        failureReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        expectedStatus: number;
        actualStatus: number;
        responseTimeMs: number;
        isSchemaValid: boolean;
        headersChecked: Record<string, string>;
        passed: boolean;
        failureReason?: string | undefined;
    }, {
        id: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        expectedStatus: number;
        actualStatus: number;
        responseTimeMs: number;
        isSchemaValid: boolean;
        passed: boolean;
        headersChecked?: Record<string, string> | undefined;
        failureReason?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    targetBaseUrl: string;
    totalEndpointsTested: number;
    passedEndpoints: number;
    failedEndpoints: number;
    averageLatencyMs: number;
    apiQualityScore: number;
    endpointResults: {
        id: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        expectedStatus: number;
        actualStatus: number;
        responseTimeMs: number;
        isSchemaValid: boolean;
        headersChecked: Record<string, string>;
        passed: boolean;
        failureReason?: string | undefined;
    }[];
}, {
    targetBaseUrl: string;
    totalEndpointsTested: number;
    passedEndpoints: number;
    failedEndpoints: number;
    averageLatencyMs: number;
    apiQualityScore: number;
    endpointResults: {
        id: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        path: string;
        expectedStatus: number;
        actualStatus: number;
        responseTimeMs: number;
        isSchemaValid: boolean;
        passed: boolean;
        headersChecked?: Record<string, string> | undefined;
        failureReason?: string | undefined;
    }[];
}>;
export type ApiTestSuiteResultDTO = z.infer<typeof ApiTestSuiteResultSchema>;
