"use client";

import React from "react";
import { PredictionResponse } from "@/lib/api";

export const PredictionCard: React.FC<{ prediction: PredictionResponse | null; isLoading: boolean }> = ({ prediction, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full minimal-panel p-8 flex flex-col items-center justify-center min-h-[300px] text-claude-muted">
        <div className="w-5 h-5 border-2 border-claude-border border-t-claude-text rounded-full animate-spin mb-4" />
        <p className="text-sm">Analyzing image...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="w-full minimal-panel p-8 flex flex-col items-center justify-center min-h-[300px] text-claude-muted text-center">
        <p className="text-sm">Provide an image to see classification results.</p>
      </div>
    );
  }

  const sortedProbs = Object.entries(prediction.probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <div className="w-full minimal-panel p-6 sm:p-8 flex flex-col gap-8">
      
      <div>
        <p className="text-xs font-medium text-claude-muted uppercase tracking-wider mb-1">Result</p>
        <div className="flex items-end justify-between border-b border-claude-border pb-4">
          <h2 className="text-3xl font-serif text-claude-text">{prediction.predicted_label}</h2>
          <div className="text-right">
            <span className="text-xl font-medium text-claude-text">{(prediction.confidence * 100).toFixed(1)}%</span>
            <span className="text-xs text-claude-muted ml-1">confidence</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-claude-text mb-4">Probabilities</h4>
        <div className="space-y-3">
          {sortedProbs.map(([className, prob], index) => {
            const pct = prob * 100;
            const isTop = index === 0;
            return (
              <div key={className} className="flex items-center gap-4">
                <span className={`w-24 text-sm truncate ${isTop ? 'font-medium text-claude-text' : 'text-claude-muted'}`}>
                  {className}
                </span>
                <div className="flex-1 h-1.5 bg-claude-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isTop ? 'bg-claude-accent' : 'bg-claude-border'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`w-12 text-right text-xs ${isTop ? 'font-medium text-claude-text' : 'text-claude-muted'}`}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
