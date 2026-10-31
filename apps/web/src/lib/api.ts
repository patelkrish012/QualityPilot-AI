import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Central API base URL — reads from env var in production (Vercel),
 * defaults to the live Render backend if unset, or localhost in local dev.
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://qualitypilot-ai.onrender.com'
    : 'https://qualitypilot-ai.onrender.com');

export const API = {
  auth: {
    login:         `${API_BASE}/api/v1/auth/login`,
    register:      `${API_BASE}/api/v1/auth/register`,
    logout:        `${API_BASE}/api/v1/auth/logout`,
    github:        `${API_BASE}/api/v1/auth/github`,
    githubOauthUrl:`${API_BASE}/api/v1/auth/github/oauth-url`,
    workspace:     (email: string) => `${API_BASE}/api/v1/auth/workspace/${encodeURIComponent(email)}`,
    workspaceSave: `${API_BASE}/api/v1/auth/workspace/save`,
    workspaceActivity: `${API_BASE}/api/v1/auth/workspace/activity`,
    profile:       `${API_BASE}/api/v1/auth/workspace/profile`,
  },
  testing: {
    modeAScan:      `${API_BASE}/api/v1/testing/mode-a/scan`,
    modeBScan:      `${API_BASE}/api/v1/testing/mode-b/scan`,
    requirements:   `${API_BASE}/api/v1/testing/requirements/analyze`,
    reqMatrix:      `${API_BASE}/api/v1/testing/requirements/generate-matrix`,
    authMatrix:     `${API_BASE}/api/v1/testing/auth-matrix/run`,
    pdf:            `${API_BASE}/api/v1/testing/reports/pdf`,
    sendEmail:      `${API_BASE}/api/v1/testing/reports/send-email`,
  },
};
