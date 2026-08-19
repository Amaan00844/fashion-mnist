"use client";

import React, { useState } from "react";
import { X, Check, Server, RefreshCw, Terminal, Cpu, HardDrive } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Connection & Config</h3>
              <p className="text-xs text-slate-400">Configure FastAPI inference backend connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-6 space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              FastAPI Server Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Test"}
              </button>
            </div>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                testResult.ok
                  ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                  : "bg-amber-950/40 border-amber-800/80 text-amber-300"
              }`}
            >
              <div className="font-semibold">
                {testResult.ok ? (
                  <>
                    ✅ Connected! Device: <span className="font-mono">{testResult.data?.device}</span> (Model Loaded: {String(testResult.data?.model_loaded)})
                  </>
                ) : (
                  <>⚠️ Offline fallback active. ({testResult.error})</>
                )}
              </div>
            </div>
          )}

          {/* Backend Launch Instructions */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              Quick Command to start FastAPI Locally:
            </h4>
            <div className="bg-black/90 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 select-all overflow-x-auto">
              uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white text-xs font-bold shadow-lg hover:shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
