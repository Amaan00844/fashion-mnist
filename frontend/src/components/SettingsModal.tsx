"use client";

import React, { useState } from "react";
import { X, Check, Server, RefreshCw, Terminal } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl, checkHealth, HealthResponse } from "@/lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiUrl, setUrl] = useState<string>(getApiBaseUrl());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; data?: HealthResponse; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(apiUrl);
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setApiBaseUrl(apiUrl);
    const res = await checkHealth();
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-frost-white font-heading">API Connection</h3>
              <p className="text-xs text-frost-muted">Configure FastAPI inference backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-frost-muted hover:text-frost-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-6 space-y-5">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-frost-gray mb-2 font-heading">
              FastAPI Server Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-800 border border-white/[0.06] text-frost-white text-sm font-mono focus:outline-none focus:border-neon-lime/40 transition-colors"
              />
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-surface-700 hover:bg-surface-600 text-frost-gray text-xs font-semibold border border-white/[0.06] flex items-center gap-2 transition-all hover:border-neon-cyan/20"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Test"}
              </button>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
                testResult.ok
                  ? "bg-neon-lime/5 border-neon-lime/20 text-neon-lime"
                  : "bg-red-500/5 border-red-500/20 text-red-400"
              }`}
            >
              <div className="font-semibold">
                {testResult.ok ? (
                  <>
                    ✅ Connected — Device: <span className="font-mono">{testResult.data?.device}</span> (Model: {String(testResult.data?.model_loaded)})
                  </>
                ) : (
                  <>⚠️ Offline — {testResult.error}</>
                )}
              </div>
            </div>
          )}

          {/* Quick Command */}
          <div className="bg-surface-800/90 rounded-xl p-4 border border-white/[0.04] space-y-3">
            <h4 className="text-xs font-bold text-frost-gray flex items-center gap-2 font-heading">
              <Terminal className="w-4 h-4 text-neon-lime" />
              Start FastAPI Locally
            </h4>
            <div className="bg-black/60 p-3 rounded-lg border border-white/[0.04] text-[11px] font-mono text-neon-lime select-all overflow-x-auto">
              uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-frost-muted hover:text-frost-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-lime to-neon-cyan text-surface-900 text-xs font-bold shadow-lg hover:shadow-neon-lime/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
