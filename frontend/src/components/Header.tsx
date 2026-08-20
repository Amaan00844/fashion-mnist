"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { checkHealth, HealthResponse } from "@/lib/api";

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const [health, setHealth] = useState<{ ok: boolean; data?: HealthResponse; error?: string } | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const res = await checkHealth();
      setHealth(res);
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-claude-bg border-b border-claude-border sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-serif font-medium text-claude-text tracking-wide">
            Fashion-MNIST
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${health?.ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
            <span className="text-claude-muted hidden sm:inline">
              {health?.ok ? 'API Connected' : 'API Offline'}
            </span>
          </div>
          
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md hover:bg-black/5 text-claude-muted hover:text-claude-text transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
