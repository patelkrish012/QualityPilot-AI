'use client';

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, AlertCircle, CheckCircle2, ExternalLink, Key, GitFork, FolderLock, Globe, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GitHub OAuth & Personal Access Token Modal State
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    const storedUser = localStorage.getItem('qp_user');
    const storedToken = localStorage.getItem('qp_token');
    if (storedUser && storedToken) {
      router.replace('/');
    }
  }, [router]);

  const handleRedirectToGitHubOAuth = async () => {
    try {
      const res = await fetch(API.auth.githubOauthUrl);
      const data = await res.json();
      if (data.clientIdConfigured && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err) {}
    setShowGithubModal(true);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      localStorage.setItem('qp_token', data.token);
      localStorage.setItem('qp_user', JSON.stringify(data.user));
      if (data.emailNotification?.previewUrl) {
        localStorage.setItem('qp_email_preview_url', data.emailNotification.previewUrl);
      }
      setSuccess('Logged in successfully! Security login email dispatched. Redirecting...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanUsername = githubUsername.trim();
    const cleanToken = githubToken.trim();

    if (!cleanUsername && !cleanToken) {
      setError('Please enter your GitHub Username or Personal Access Token.');
      return;
    }

    setGithubLoading(true);

    try {
      const res = await fetch(API.auth.github, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername || undefined,
          token: cleanToken || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'GitHub authentication failed');

      localStorage.setItem('qp_token', data.token);
      localStorage.setItem('qp_user', JSON.stringify(data.user));
      if (data.repositories) {
        localStorage.setItem('qp_github_repos', JSON.stringify(data.repositories));
      }

      setShowGithubModal(false);
      setSuccess(`Authenticated with GitHub as @${data.user.fullName}! Discovered ${data.repositories?.length || 0} real repositories. Redirecting...`);
      setTimeout(() => router.push('/'), 1200);
    } catch (err: any) {
      setError(err.message || 'Could not connect to GitHub account.');
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06110C] text-neutral-100 flex flex-col justify-center items-center px-3.5 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-block mb-2">
            <img 
              src="/brand/qualitypilot-logo.png" 
              alt="QualityPilot AI" 
              className="h-14 sm:h-16 w-auto mx-auto object-contain drop-shadow-[0_4px_20px_rgba(163,28,24,0.35)]" 
            />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">Sign In to QualityPilot</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Autonomous Quality Engineering & Release Assurance Platform
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 sm:space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-900/60 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div>{error}</div>
                {error.toLowerCase().includes('create an account') && (
                  <div>
                    <Link href="/register" className="text-[#F87171] hover:underline font-bold inline-flex items-center gap-1">
                      <span>Click here to create your account now</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-[#A31C18]/15 border border-[#A31C18]/30 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#F87171]" />
              <span>{success}</span>
            </div>
          )}

          {/* GitHub OAuth & Connect Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRedirectToGitHubOAuth}
              className="w-full py-2.5 px-4 bg-[#A31C18] hover:bg-[#C2241F] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-[0.99] shadow-lg shadow-[#A31C18]/25"
            >
              <Github className="h-4 w-4" />
              <span>Sign In with GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setShowGithubModal(true)}
              className="w-full py-2 px-3 bg-[#06110C] hover:bg-[#222222] border border-[#2a2a2a] rounded-xl text-[11px] text-neutral-400 hover:text-white flex items-center justify-center gap-2 transition"
            >
              <span>Or connect with Username / Token</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">or email</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#06110C] border border-[#2a2a2a] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A31C18] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#06110C] border border-[#2a2a2a] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A31C18] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-neutral-500 hover:text-neutral-300 transition focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#A31C18] hover:bg-[#C2241F] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#A31C18]/25 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-2">
            <p className="text-xs text-neutral-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#F87171] hover:underline font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Authentication Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#171717] border border-[#2a2a2a] w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2.5">
                <Github className="h-5 w-5 text-[#F87171]" />
                <h3 className="text-sm font-bold text-white">GitHub Account Authorization</h3>
              </div>
              <button
                onClick={() => setShowGithubModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Enter your real GitHub username or Personal Access Token to authenticate and discover your repositories.
            </p>

            <form onSubmit={handleGitHubAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  GitHub Username / Handle <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. torvalds or your-github-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#06110C] border border-[#2a2a2a] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A31C18]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                  <span>GitHub Personal Access Token (for Private Repos)</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Optional</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                  <input
                    type="password"
                    placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#06110C] border border-[#2a2a2a] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A31C18]"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Tip: Provide a token to load your real private repositories. Without a token, your real public repositories will be fetched.
                </span>
              </div>

              <div className="p-3 bg-[#06110C] rounded-xl border border-[#2a2a2a] text-[11px] text-neutral-400 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                  <GitFork className="h-3.5 w-3.5 text-[#F87171]" />
                  <span>Authorized Permissions & Scope:</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <FolderLock className="h-3 w-3 text-amber-400" />
                  <span>Private repositories read access</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Globe className="h-3 w-3 text-[#F87171]" />
                  <span>Public repositories & user profile</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={githubLoading}
                  className="px-5 py-2.5 bg-[#A31C18] hover:bg-[#C2241F] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 shadow-md shadow-[#A31C18]/25"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>{githubLoading ? 'Connecting to GitHub...' : 'Authorize & Fetch Repositories'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
