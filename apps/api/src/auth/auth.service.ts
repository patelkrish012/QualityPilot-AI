import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRegistrationDTO, UserLoginDTO, OrgRole } from '@qualitypilot/types';
import { UserWorkspaceService } from './user-workspace.service';
import { EmailService } from '../testing/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly workspaceService: UserWorkspaceService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: UserRegistrationDTO) {
    const orgName = (dto.organizationName && dto.organizationName.trim()) 
      ? dto.organizationName.trim() 
      : `${dto.fullName?.trim() || dto.email.split('@')[0]}'s Workspace`;

    // 1. Check if user already exists in persistent workspace file store
    const existingFileUser = this.workspaceService.getUser(dto.email);
    if (existingFileUser) {
      throw new BadRequestException('An account with this email already exists. Please sign in.');
    }

    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new BadRequestException('An account with this email already exists. Please sign in.');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

      return await this.prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: orgName,
            slug,
          },
        });

        const user = await tx.user.create({
          data: {
            email: dto.email,
            fullName: dto.fullName,
            passwordHash,
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: org.id,
            userId: user.id,
            role: OrgRole.OWNER,
          },
        });

        const token = this.jwtService.sign({
          sub: user.id,
          email: user.email,
          organizationId: org.id,
          role: OrgRole.OWNER,
        });

        const userRecord = this.workspaceService.registerUser(
          user.email,
          user.fullName,
          passwordHash,
          'email',
          orgName,
        );

        let emailNotification: any = null;
        try {
          emailNotification = await this.emailService.sendLoginNotificationEmail(user.email, user.fullName, 'Email Registration');
        } catch (e: any) {
          this.logger.warn(`Login notification email dispatch error: ${e.message}`);
        }

        return {
          user: userRecord.profile,
          organization: org,
          token,
          emailNotification,
          workspace: userRecord.workspace,
          history: userRecord.history,
        };
      });
    } catch (dbErr: any) {
      if (dbErr instanceof BadRequestException) {
        throw dbErr;
      }
      this.logger.warn(`Prisma DB register bypass: ${dbErr.message}. Registering in persistent file store.`);
      
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const userRecord = this.workspaceService.registerUser(
        dto.email,
        dto.fullName || dto.email.split('@')[0],
        passwordHash,
        'email',
        orgName,
      );

      let emailNotification: any = null;
      try {
        emailNotification = await this.emailService.sendLoginNotificationEmail(dto.email, userRecord.profile.fullName, 'Email Registration');
      } catch (e: any) {
        this.logger.warn(`Login notification email dispatch error: ${e.message}`);
      }

      const token = this.jwtService.sign({
        sub: userRecord.profile.id,
        email: dto.email,
        organizationId: 'mock-org-1',
        role: OrgRole.OWNER,
      });

      return {
        user: userRecord.profile,
        organization: { id: 'mock-org-1', name: userRecord.profile.organizationName, slug: 'default-workspace' },
        token,
        emailNotification,
        workspace: userRecord.workspace,
        history: userRecord.history,
      };
    }
  }

  async login(dto: UserLoginDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
        include: { memberships: { include: { organization: true } } },
      });

      if (user) {
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
          throw new UnauthorizedException('Invalid email or password.');
        }

        const primaryMembership = user.memberships[0];
        const token = this.jwtService.sign({
          sub: user.id,
          email: user.email,
          organizationId: primaryMembership?.organizationId,
          role: primaryMembership?.role || OrgRole.MEMBER,
        });

        const userRecord = this.workspaceService.getOrCreateUser(user.email, user.fullName, 'email');
        this.workspaceService.recordLogin(user.email);

        let emailNotification: any = null;
        try {
          emailNotification = await this.emailService.sendLoginNotificationEmail(user.email, userRecord.profile.fullName, 'Email / Password');
        } catch (e: any) {
          this.logger.warn(`Login email error: ${e.message}`);
        }

        return {
          user: userRecord.profile,
          organizations: user.memberships.map((m) => m.organization),
          token,
          emailNotification,
          workspace: userRecord.workspace,
          history: userRecord.history,
        };
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) throw e;
    }

    // Check persistent file workspace store
    const userRecord = this.workspaceService.getUser(dto.email);

    // CRITICAL: New users MUST register first on /register! Do not auto-create!
    if (!userRecord) {
      throw new UnauthorizedException('No account found with this email. Please create an account first.');
    }

    // Verify password against stored password hash
    if (userRecord.passwordHash) {
      const isValid = await bcrypt.compare(dto.password, userRecord.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }
    } else {
      // Legacy user without saved hash: require min 6 chars and save hash
      if (!dto.password || dto.password.length < 6) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      userRecord.passwordHash = await bcrypt.hash(dto.password, 10);
      this.workspaceService.registerUser(dto.email, userRecord.profile.fullName, userRecord.passwordHash);
    }

    // Record login timestamp and count
    this.workspaceService.recordLogin(dto.email);

    let emailNotification: any = null;
    try {
      emailNotification = await this.emailService.sendLoginNotificationEmail(dto.email, userRecord.profile.fullName, 'Email / Password');
    } catch (e: any) {
      this.logger.warn(`Login notification email dispatch error: ${e.message}`);
    }

    const token = this.jwtService.sign({
      sub: userRecord.profile.id,
      email: dto.email,
      organizationId: 'mock-org-1',
      role: OrgRole.OWNER,
    });

    return {
      user: userRecord.profile,
      organizations: [{ id: 'mock-org-1', name: userRecord.profile.organizationName }],
      token,
      emailNotification,
      workspace: userRecord.workspace,
      history: userRecord.history,
    };
  }

  async githubLogin(dto: { code?: string; token?: string; username?: string; email?: string }) {
    let accessToken = dto.token;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // 1. If an authorization code was received, exchange it with GitHub for an access_token
    if (dto.code && clientId && clientSecret) {
      try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: dto.code,
          }),
        });
        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          accessToken = tokenData.access_token;
        }
      } catch (err: any) {
        console.warn('[GitHub OAuth] Token exchange error:', err.message);
      }
    }

    // 2. If we have an access token or personal token, fetch real GitHub user profile and repositories
    let githubUser: any = null;
    let repositories: any[] = [];

    if (accessToken) {
      // Validate access token with GitHub
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'QualityPilot-AI-Platform',
        },
      });

      if (!userRes.ok) {
        throw new UnauthorizedException('Invalid GitHub Personal Access Token. Please provide a valid GitHub token.');
      }

      githubUser = await userRes.json();

      // Fetch user's real public and private repositories
      const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50&affiliation=owner,collaborator', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'QualityPilot-AI-Platform',
        },
      });

      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        if (Array.isArray(rawRepos)) {
          repositories = rawRepos.map((r: any) => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            private: r.private,
            htmlUrl: r.html_url,
            description: r.description,
            defaultBranch: r.default_branch || 'main',
            updatedAt: r.updated_at,
          }));
        }
      }
    } else if (dto.username && dto.username.trim()) {
      const cleanUser = dto.username.trim();
      // Fetch public profile for the provided username
      const userRes = await fetch(`https://api.github.com/users/${cleanUser}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'QualityPilot-AI-Platform',
        },
      });

      if (!userRes.ok) {
        throw new BadRequestException(`GitHub user '@${cleanUser}' not found. Please enter a valid GitHub username.`);
      }

      githubUser = await userRes.json();

      // Fetch real public repositories for this user
      const reposRes = await fetch(`https://api.github.com/users/${cleanUser}/repos?sort=updated&per_page=50`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'QualityPilot-AI-Platform',
        },
      });

      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        if (Array.isArray(rawRepos)) {
          repositories = rawRepos.map((r: any) => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            private: false,
            htmlUrl: r.html_url,
            description: r.description,
            defaultBranch: r.default_branch || 'main',
            updatedAt: r.updated_at,
          }));
        }
      }
    } else {
      throw new BadRequestException('Please provide your GitHub username or token to connect your GitHub account.');
    }

    const username = githubUser.login;
    const email = githubUser.email || dto.email || `${username}@users.noreply.github.com`;
    const fullName = githubUser.name || username;
    const avatarUrl = githubUser.avatar_url || `https://github.com/${username}.png`;

    const userRecord = this.workspaceService.getOrCreateUser(email, fullName, 'github');
    let emailNotification: any = null;
    try {
      emailNotification = await this.emailService.sendLoginNotificationEmail(email, fullName, 'GitHub');
    } catch (e: any) {
      this.logger.warn(`GitHub login email error: ${e.message}`);
    }

    const token = this.jwtService.sign({
      sub: userRecord.profile.id,
      email,
      organizationId: 'org-github-workspace',
      role: OrgRole.OWNER,
      provider: 'github',
    });

    return {
      user: userRecord.profile,
      organization: { id: 'org-github-workspace', name: userRecord.profile.organizationName },
      token,
      repositories,
      hasRealGitHubToken: Boolean(accessToken),
      emailNotification,
      workspace: userRecord.workspace,
      history: userRecord.history,
    };
  }

  async logout(email: string) {
    const userRecord = this.workspaceService.getUser(email);
    const fullName = userRecord?.profile.fullName || email;
    // Dispatch security logout notification email to user's registered inbox
    const emailResult = await this.emailService.sendLogoutNotificationEmail(email, fullName).catch((err) => {
      console.warn('[AuthService] Logout notification email warning:', err.message);
      return null;
    });

    return {
      success: true,
      message: `Logout notification email dispatched successfully to ${email}.`,
      emailResult,
    };
  }

  getWorkspace(email: string) {
    const record = this.workspaceService.getOrCreateUser(email);
    const stats = this.workspaceService.getStats(email);
    return {
      profile: record.profile,
      workspace: record.workspace,
      history: record.history,
      stats,
    };
  }

  saveWorkspace(email: string, workspaceData: any) {
    const workspace = this.workspaceService.saveWorkspace(email, workspaceData);
    return { success: true, workspace };
  }

  updateProfile(email: string, profileData: any) {
    const profile = this.workspaceService.updateProfile(email, profileData);
    return { success: true, profile };
  }

  recordActivity(email: string, activity: any) {
    const item = this.workspaceService.addWorkHistoryItem(email, activity);
    return { success: true, item };
  }

  getGitHubOAuthUrl() {
    const rawClientId = process.env.GITHUB_CLIENT_ID;
    const isConfigured = Boolean(rawClientId && rawClientId.trim().length > 0 && rawClientId !== 'Ov23liQualityPilotDemo');
    const clientId = isConfigured ? rawClientId!.trim() : null;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/callback/github';
    const scope = 'read:user,user:email,repo';
    const url = isConfigured
      ? `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
      : null;

    return {
      url,
      clientIdConfigured: isConfigured,
      clientId,
      redirectUri,
      scope,
    };
  }
}
