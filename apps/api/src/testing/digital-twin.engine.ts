import { Injectable } from '@nestjs/common';
import { 
  DigitalQualityTwinGraphDTO, 
  TwinNodeDTO, 
  TwinEdgeDTO, 
  ReleaseRisk,
  ImpactAnalysisResultDTO
} from '@qualitypilot/types';

@Injectable()
export class DigitalTwinEngine {
  /**
   * Builds the Digital Quality Twin relationship graph connecting:
   * Application -> Modules -> Requirements -> Code -> Endpoints -> Tests -> Defects -> Risk
   * Conforms strictly to Section 31: Digital Quality Twin.
   */
  getQualityGraph(): DigitalQualityTwinGraphDTO {
    const nodes: TwinNodeDTO[] = [
      { id: 'MOD-AUTH', type: 'MODULE', label: 'Authentication Module', riskScore: 75, status: 'WARNING', metadata: {} },
      { id: 'MOD-PROJECTS', type: 'MODULE', label: 'Projects & Workspaces', riskScore: 10, status: 'HEALTHY', metadata: {} },
      { id: 'FILE-AUTH-CTRL', type: 'CODE_FILE', label: 'src/auth/auth.controller.ts', riskScore: 40, status: 'HEALTHY', metadata: {} },
      { id: 'FILE-AUTH-SRV', type: 'CODE_FILE', label: 'src/auth/auth.service.ts', riskScore: 70, status: 'WARNING', metadata: {} },
      { id: 'EP-LOGIN', type: 'ENDPOINT', label: 'POST /api/v1/auth/login', riskScore: 65, status: 'WARNING', metadata: {} },
      { id: 'REQ-AUTH-01', type: 'REQUIREMENT', label: 'REQ-AUTH-01: Strong Password Validation', riskScore: 80, status: 'CRITICAL', metadata: {} },
      { id: 'TC-AUTH-01', type: 'TEST_CASE', label: 'AUTH-PWD-001 (Valid Login)', riskScore: 0, status: 'PASS', metadata: {} },
      { id: 'TC-AUTH-02', type: 'TEST_CASE', label: 'AUTH-PWD-002 (Empty Input Boundary)', riskScore: 85, status: 'FAIL', metadata: {} },
      { id: 'DEF-001', type: 'DEFECT', label: 'DEF-001: Boundary validation bypassed', riskScore: 90, status: 'CRITICAL', metadata: {} },
      { id: 'REL-V1', type: 'RELEASE', label: 'Release v1.0.0-rc1', riskScore: 65, status: 'WARNING', metadata: {} },
    ];

    const edges: TwinEdgeDTO[] = [
      { id: 'E1', source: 'MOD-AUTH', target: 'FILE-AUTH-SRV', relationship: 'IMPLEMENTS' },
      { id: 'E2', source: 'FILE-AUTH-SRV', target: 'EP-LOGIN', relationship: 'EXPOSES' },
      { id: 'E3', source: 'REQ-AUTH-01', target: 'FILE-AUTH-SRV', relationship: 'IMPLEMENTS' },
      { id: 'E4', source: 'TC-AUTH-02', target: 'REQ-AUTH-01', relationship: 'VERIFIES' },
      { id: 'E5', source: 'DEF-001', target: 'TC-AUTH-02', relationship: 'AFFECTS' },
      { id: 'E6', source: 'DEF-001', target: 'REL-V1', relationship: 'BLOCKS' },
    ];

    return {
      nodes,
      edges,
      highRiskModules: ['Authentication Module'],
      calculatedReleaseRisk: ReleaseRisk.MEDIUM,
    };
  }

  /**
   * Analyzes changed files and performs Smart Test Selection.
   * Conforms to:
   * - Section 13: Smart Test Selection (Run relevant tests first)
   * - Section 18: Smart Regression Testing
   */
  analyzeImpact(changedFiles: string[]): ImpactAnalysisResultDTO {
    const totalTestsAvailable = 2840;
    const selectedTests: any[] = [];
    const impactedModules = new Set<string>();
    const impactedRequirements = new Set<string>();

    changedFiles.forEach((file) => {
      if (file.includes('auth') || file.includes('login') || file.includes('user')) {
        impactedModules.add('Authentication');
        impactedRequirements.add('REQ-AUTH-01: Strong Credentials');
        selectedTests.push(
          { testId: 'AUTH-PWD-001', title: 'Valid authentication submission', reason: `Impacted by change in ${file}`, priority: 'CRITICAL' },
          { testId: 'AUTH-PWD-002', title: 'Empty input boundary reject', reason: `Validation logic modified in ${file}`, priority: 'CRITICAL' },
          { testId: 'AUTH-PWD-003', title: 'Below minimum length reject', reason: `Regex rules affected in ${file}`, priority: 'HIGH' },
          { testId: 'AUTH-PWD-005', title: 'Missing uppercase reject', reason: `Credential rule affected in ${file}`, priority: 'HIGH' },
          { testId: 'AUTH-PWD-006', title: 'Missing special symbol reject', reason: `Boundary touched in ${file}`, priority: 'HIGH' },
          { testId: 'AUTH-SESS-01', title: 'Session persistence check', reason: `Auth state modified in ${file}`, priority: 'HIGH' },
        );
      } else if (file.includes('project')) {
        impactedModules.add('Projects');
        impactedRequirements.add('REQ-PROJ-01: Workspace Isolation');
        selectedTests.push(
          { testId: 'PROJ-CREATE-01', title: 'Create project workspace', reason: `Modified ${file}`, priority: 'HIGH' },
          { testId: 'PROJ-LIST-01', title: 'Tenant project isolation', reason: `Modified ${file}`, priority: 'CRITICAL' },
        );
      }
    });

    // Default smoke tests if unrelated file touched
    if (selectedTests.length === 0) {
      selectedTests.push(
        { testId: 'SMOKE-001', title: 'Application global smoke test', reason: 'Baseline smoke check for safe commit', priority: 'CRITICAL' }
      );
    }

    const skippedTestsCount = totalTestsAvailable - selectedTests.length;
    const efficiencyPercentage = Math.round((skippedTestsCount / totalTestsAvailable) * 100);

    return {
      changedFiles,
      impactedModules: Array.from(impactedModules),
      impactedRequirements: Array.from(impactedRequirements),
      totalTestsAvailable,
      selectedTestsToRun: selectedTests,
      skippedTestsCount,
      efficiencyPercentage,
    };
  }
}
