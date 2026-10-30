'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function GitHubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!code) {
      setStatus('ERROR');
      setErrorMessage('Missing GitHub authorization code in redirect parameters.');
      return;
    }

    async function exchangeOAuthCode() {
      try {
        const res = await fetch('http://localhost:4000/api/v1/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'GitHub OAuth verification failed');
        }

        localStorage.setItem('qp_token', data.token);
        localStorage.setItem('qp_user', JSON.stringify(data.user));
        if (data.repositories) {
          localStorage.setItem('qp_github_repos', JSON.stringify(data.repositories));
        }

        setStatus('SUCCESS');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } catch (err: any) {
        setStatus('ERROR');
        setErrorMessage(err.message || 'Failed to exchange GitHub authorization code.');
      }
    }

    exchangeOAuthCode();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>

        <h2 className="text-xl font-bold text-white">GitHub Authorization Callback</h2>

        {status === 'LOADING' && (
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <Loader2 className="h-7 w-7 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400">Exchanging authorization code and fetching your repositories...</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="flex flex-col items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
            <p className="text-xs font-semibold">GitHub Authorization Verified! Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="space-y-4">
            <div className="p-3 bg-red-950/50 border border-red-900 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GitHubCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b13] flex items-center justify-center text-slate-400 text-xs">Loading GitHub OAuth...</div>}>
      <GitHubCallbackContent />
    </Suspense>
  );
}
