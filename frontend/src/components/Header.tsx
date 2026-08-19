"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Settings, Cpu, Layers } from "lucide-react";
import { checkHealth, getApiBaseUrl, HealthResponse } from "@/lib/api";

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [health, setHealth] = useState<{ ok: boolean; data?: HealthResponse; error?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setLoading(true);
    const res = await checkHealth();
    setHealth(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-violet to-accent-pink p-[1px] shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-500 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                Fashion-MNIST <span className="text-gradient">AI Studio</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-full">
                ANN v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Developed & Deployed by <span className="text-brand-300 font-semibold">Amaan Chauhan</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Settings */}
        <div className="flex items-center gap-3">
          
          {/* Health Badge */}
          <div
            onClick={fetchHealth}
            className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-xs font-medium"
            title="Click to re-ping API health"
          >
            <span className="relative flex h-2.5 w-2.5">
              {health?.ok ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              )}
            </span>
            <span className="text-slate-300">
              {loading ? (
                "Connecting..."
              ) : health?.ok ? (
                <span className="text-emerald-400 font-semibold">PyTorch API Connected ({health.data?.device.toUpperCase()})</span>
              ) : (
                <span className="text-rose-400 font-semibold">PyTorch API Offline</span>
              )}
            </span>
            <Activity className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all text-xs font-medium shadow-sm hover:shadow-brand-500/10"
          >
            <Settings className="w-4 h-4 text-brand-400" />
            <span className="hidden md:inline">API Settings</span>
          </button>

        </div>

      </div>
    </header>
  );
};
