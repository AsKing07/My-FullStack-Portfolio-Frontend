"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorRetryCardProps {
  title: string;
  message: string;
  error?: string | null;
  retryLabel: string;
}

export function ErrorRetryCard({ title, message, error, retryLabel }: ErrorRetryCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">{title}</h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          {message}
          {error && (
            <>
              <br />
              <span className="font-mono break-all">{error}</span>
            </>
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}
