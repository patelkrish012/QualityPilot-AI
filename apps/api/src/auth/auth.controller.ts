import { Controller, Post, Get, Put, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRegistrationDTO, UserLoginDTO } from '@qualitypilot/types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and organization workspace' })
  @ApiResponse({ status: 201, description: 'User & Organization registered successfully' })
  async register(@Body() dto: UserRegistrationDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT bearer token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  async login(@Body() dto: UserLoginDTO) {
    return this.authService.login(dto);
  }

  @Get('github/oauth-url')
  @ApiOperation({ summary: 'Get official GitHub OAuth authorize URL for direct browser redirect' })
  @ApiResponse({ status: 200, description: 'GitHub OAuth URL generated' })
  getGitHubOAuthUrl() {
    return this.authService.getGitHubOAuthUrl();
  }

  @Post('github')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate via GitHub OAuth and retrieve repositories' })
  @ApiResponse({ status: 200, description: 'Authenticated with GitHub' })
  async githubLogin(@Body() dto: { code?: string; token?: string; username?: string; email?: string }) {
    return this.authService.githubLogin(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user, terminate session and send security logout email' })
  @ApiResponse({ status: 200, description: 'User logged out and security email dispatched' })
  async logout(@Body('email') email: string) {
    return this.authService.logout(email || 'developer@example.com');
  }

  @Get('workspace/:email')
  @ApiOperation({ summary: 'Retrieve persistent workspace state, past test runs, and requirements' })
  async getWorkspace(@Param('email') email: string) {
    return this.authService.getWorkspace(email);
  }

  @Post('workspace/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Persist current user workspace (targetUrl, requirements, code repo)' })
  async saveWorkspace(@Body() body: { email: string; workspace: any }) {
    return this.authService.saveWorkspace(body.email, body.workspace);
  }

  @Get('profile/:email')
  @ApiOperation({ summary: 'Get user profile and activity stats' })
  async getProfile(@Param('email') email: string) {
    return this.authService.getWorkspace(email);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile (Name, Avatar, Organization)' })
  async updateProfile(@Body() body: { email: string; profile: any }) {
    return this.authService.updateProfile(body.email, body.profile);
  }

  @Post('workspace/activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record work history activity item (test run or requirement)' })
  async recordActivity(@Body() body: { email: string; activity: any }) {
    return this.authService.recordActivity(body.email, body.activity);
  }
}
