import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { QualityScoreEngine } from './quality-score.engine';
import { ReportEngine } from './report.engine';
import { RequirementIntelligenceEngine } from './requirement-intelligence.engine';
import { FailureAnalysisEngine } from './failure-analysis.engine';
import { DigitalTwinEngine } from './digital-twin.engine';
import { DevIntelligenceEngine } from './dev-intelligence.engine';
import { CicdGateEngine } from './cicd-gate.engine';
import { EmailService } from './email.service';

@Module({
  controllers: [TestingController],
  providers: [
    TestingService,
    QualityScoreEngine,
    ReportEngine,
    RequirementIntelligenceEngine,
    FailureAnalysisEngine,
    DigitalTwinEngine,
    DevIntelligenceEngine,
    CicdGateEngine,
    EmailService,
  ],
  exports: [
    TestingService,
    QualityScoreEngine,
    ReportEngine,
    RequirementIntelligenceEngine,
    FailureAnalysisEngine,
    DigitalTwinEngine,
    DevIntelligenceEngine,
    CicdGateEngine,
    EmailService,
  ],
})
export class TestingModule {}
