import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  organizationName: string;
  role: string;
  provider: string;
  createdAt: string;
  lastLoginAt: string;
  totalLogins: number;
}

export interface UserWorkspace {
  targetUrl: string;
  depth: 'QUICK' | 'STANDARD' | 'DEEP';
  persona: 'BEGINNER' | 'DEVELOPER' | 'MANAGER';
  runResults: any;
  reqInput: string;
  reqAnalysis: any;
  testMatrix: any;
  selectedRepoUrl: string;
  selectedBranch: string;
  selectedRepoName: string;
  modeBResults: any;
  lastSavedAt: string;
}

export interface UserWorkHistoryItem {
  id: string;
  type: 'TEST_RUN' | 'REQUIREMENT_ANALYSIS' | 'MODE_B_SCAN';
  title: string;
  target: string;
  score?: number;
  verdict?: string;
  timestamp: string;
  details?: any;
}

export interface UserRecord {
  profile: UserProfile;
  workspace: UserWorkspace;
  history: UserWorkHistoryItem[];
  passwordHash?: string;
}

@Injectable()
export class UserWorkspaceService {
  private readonly logger = new Logger(UserWorkspaceService.name);
  private readonly storagePath = (() => {
    const cwd = process.cwd();
    const baseDir = cwd.endsWith('api') ? cwd : path.resolve(cwd, 'apps/api');
    return path.resolve(baseDir, 'data/user-workspaces.json');
  })();
  private userStore: Map<string, UserRecord> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      // Check legacy/nested path if present and migrate
      const nestedPath = path.resolve(process.cwd(), 'apps/api/apps/api/data/user-workspaces.json');
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const activeFile = fs.existsSync(this.storagePath) 
        ? this.storagePath 
        : (fs.existsSync(nestedPath) ? nestedPath : null);

      if (activeFile) {
        const raw = fs.readFileSync(activeFile, 'utf8');
        const parsed = JSON.parse(raw);
        for (const [email, record] of Object.entries(parsed)) {
          this.userStore.set(email.toLowerCase(), record as UserRecord);
        }
        this.logger.log(`[UserWorkspaceService] Loaded ${this.userStore.size} persistent workspaces from disk.`);
        // Save back to canonical storagePath
        this.saveToDisk();
      }
    } catch (err: any) {
      this.logger.warn(`[UserWorkspaceService] Disk load warning: ${err.message}. Starting with empty memory store.`);
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const obj: Record<string, UserRecord> = {};
      for (const [k, v] of this.userStore.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(this.storagePath, JSON.stringify(obj, null, 2), 'utf8');
    } catch (err: any) {
      this.logger.error(`[UserWorkspaceService] Failed to persist workspaces to disk: ${err.message}`);
    }
  }

  getOrCreateUser(email: string, fullName?: string, provider = 'email', organizationName?: string): UserRecord {
    const key = email.toLowerCase().trim();
    let record = this.userStore.get(key);

    if (!record) {
      const now = new Date().toISOString();
      const displayName = fullName?.trim() || email.split('@')[0];
      const orgName = organizationName?.trim() || `${displayName}'s Workspace`;
      record = {
        profile: {
          id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          email: key,
          fullName: displayName,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(key)}`,
          organizationName: orgName,
          role: 'OWNER',
          provider,
          createdAt: now,
          lastLoginAt: now,
          totalLogins: 1,
        },
        workspace: {
          targetUrl: '',
          depth: 'STANDARD',
          persona: 'BEGINNER',
          runResults: null,
          reqInput: '',
          reqAnalysis: null,
          testMatrix: null,
          selectedRepoUrl: '',
          selectedBranch: 'main',
          selectedRepoName: '',
          modeBResults: null,
          lastSavedAt: now,
        },
        history: [],
      };
      this.userStore.set(key, record);
      this.saveToDisk();
      this.logger.log(`[UserWorkspaceService] Created fresh workspace profile for: ${key}`);
    } else {
      record.profile.totalLogins += 1;
      record.profile.lastLoginAt = new Date().toISOString();
      if (fullName && fullName.trim() && (!record.profile.fullName || record.profile.fullName === record.profile.email.split('@')[0])) {
        record.profile.fullName = fullName.trim();
      }
      if (organizationName && organizationName.trim()) {
        record.profile.organizationName = organizationName.trim();
      }
      this.saveToDisk();
    }

    return record;
  }

  getUser(email: string): UserRecord | null {
    const key = email.toLowerCase().trim();
    return this.userStore.get(key) || null;
  }

  registerUser(
    email: string,
    fullName?: string,
    passwordHash?: string,
    provider = 'email',
    organizationName?: string,
  ): UserRecord {
    const key = email.toLowerCase().trim();
    let record = this.userStore.get(key);
    if (record) {
      if (passwordHash) record.passwordHash = passwordHash;
      if (fullName && fullName.trim()) record.profile.fullName = fullName.trim();
      if (organizationName && organizationName.trim()) record.profile.organizationName = organizationName.trim();
      this.saveToDisk();
      return record;
    }

    const now = new Date().toISOString();
    const displayName = fullName?.trim() || email.split('@')[0];
    const orgName = organizationName?.trim() || `${displayName}'s Workspace`;
    record = {
      profile: {
        id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: key,
        fullName: displayName,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(key)}`,
        organizationName: orgName,
        role: 'OWNER',
        provider,
        createdAt: now,
        lastLoginAt: now,
        totalLogins: 1,
      },
      workspace: {
        targetUrl: '',
        depth: 'STANDARD',
        persona: 'BEGINNER',
        runResults: null,
        reqInput: '',
        reqAnalysis: null,
        testMatrix: null,
        selectedRepoUrl: '',
        selectedBranch: 'main',
        selectedRepoName: '',
        modeBResults: null,
        lastSavedAt: now,
      },
      history: [],
      passwordHash,
    };
    this.userStore.set(key, record);
    this.saveToDisk();
    this.logger.log(`[UserWorkspaceService] Registered user account for: ${key}`);
    return record;
  }

  recordLogin(email: string): void {
    const key = email.toLowerCase().trim();
    const record = this.userStore.get(key);
    if (record) {
      record.profile.totalLogins += 1;
      record.profile.lastLoginAt = new Date().toISOString();
      this.saveToDisk();
    }
  }

  updateProfile(email: string, update: Partial<UserProfile>): UserProfile {
    const user = this.getOrCreateUser(email);
    user.profile = {
      ...user.profile,
      ...update,
    };
    this.saveToDisk();
    return user.profile;
  }

  saveWorkspace(email: string, workspaceUpdate: Partial<UserWorkspace>): UserWorkspace {
    const user = this.getOrCreateUser(email);
    user.workspace = {
      ...user.workspace,
      ...workspaceUpdate,
      lastSavedAt: new Date().toISOString(),
    };
    this.saveToDisk();
    this.logger.log(`[UserWorkspaceService] Workspace state preserved for: ${email}`);
    return user.workspace;
  }

  addWorkHistoryItem(email: string, item: Omit<UserWorkHistoryItem, 'id' | 'timestamp'>): UserWorkHistoryItem {
    const user = this.getOrCreateUser(email);
    const historyItem: UserWorkHistoryItem = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...item,
    };

    user.history.unshift(historyItem);
    // Keep last 50 activities
    if (user.history.length > 50) {
      user.history = user.history.slice(0, 50);
    }

    this.saveToDisk();
    return historyItem;
  }

  getStats(email: string) {
    const user = this.getOrCreateUser(email);
    const testRuns = user.history.filter((h) => h.type === 'TEST_RUN');
    const requirements = user.history.filter((h) => h.type === 'REQUIREMENT_ANALYSIS');

    const totalRuns = testRuns.length;
    const avgScore =
      totalRuns > 0
        ? Math.round(testRuns.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalRuns)
        : 92;

    return {
      totalTestRuns: totalRuns,
      totalRequirements: requirements.length,
      averageQualityScore: avgScore,
      totalLogins: user.profile.totalLogins,
      lastLoginAt: user.profile.lastLoginAt,
      memberSince: user.profile.createdAt,
    };
  }
}
