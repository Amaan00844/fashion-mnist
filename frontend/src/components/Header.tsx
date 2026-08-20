"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Settings, Cpu, Zap } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-lime via-neon-cyan to-neon-magenta p-[1.5px]">
            <div className="w-full h-full bg-surface-900 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-neon-lime" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-frost-white font-heading">
                Fashion-MNIST <span className="text-gradient">AI Studio</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-neon-lime/10 border border-neon-lime/20 text-neon-lime rounded-full">
                ANN v1.0
              </span>
            </div>
            <p className="text-[11px] text-frost-muted hidden sm:block">
              Developed & Deployed by <span className="text-neon-cyan font-semibold">Amaan Chauhan</span>
            </p>
          </div>
        </div>

        {/* Status & Settings */}
        <div className="flex items-center gap-2.5">

          {/* Health Badge */}
          <div
            onClick={fetchHealth}
            className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-800/80 border border-white/[0.06] hover:border-neon-lime/20 transition-all text-xs font-medium"
            title="Click to re-ping API health"
          >
            <span className="relative flex h-2 w-2">
              {health?.ok ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-lime opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-lime"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
            </span>
            <span className="text-frost-gray">
              {loading ? (
                "Connecting..."
              ) : health?.ok ? (
                <span className="text-neon-lime font-semibold">API Live ({health.data?.device.toUpperCase()})</span>
              ) : (
                <span className="text-red-400 font-semibold">API Offline</span>
              )}
            </span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-700/80 hover:bg-surface-600/80 text-frost-gray border border-white/[0.06] hover:border-neon-cyan/20 transition-all text-xs font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden md:inline">Settings</span>
          </button>

        </div>
      </div>
    </header>
  );
};
