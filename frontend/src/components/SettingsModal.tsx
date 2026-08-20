"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md minimal-panel p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-medium text-claude-text">Settings</h3>
          <button onClick={onClose} className="p-1 text-claude-muted hover:text-claude-text rounded-md hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-claude-text mb-2">
              API Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 rounded-lg bg-claude-bg border border-claude-border text-sm focus:outline-none focus:border-claude-text focus:ring-1 focus:ring-claude-text transition-shadow"
              />
              <button
                onClick={handleTest}
                disabled={testing}
                className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
              >
                {testing ? "..." : "Test"}
              </button>
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg text-sm border ${testResult.ok ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
              {testResult.ok ? `Connected to ${testResult.data?.device}` : testResult.error}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-claude-muted hover:text-claude-text">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
