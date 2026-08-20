"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PredictionResponse, CLASS_NAMES } from "@/lib/api";
import {
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface PredictionCardProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
}

const CLASS_COLORS: Record<string, { gradient: string; glow: string }> = {
  "T-shirt/top": { gradient: "from-neon-lime to-emerald-400", glow: "shadow-neon-lime/20" },
  Trouser: { gradient: "from-neon-cyan to-sky-400", glow: "shadow-neon-cyan/20" },
  Pullover: { gradient: "from-violet-400 to-neon-magenta", glow: "shadow-neon-magenta/20" },
  Dress: { gradient: "from-pink-400 to-rose-400", glow: "shadow-pink-400/20" },
  Coat: { gradient: "from-amber-400 to-orange-400", glow: "shadow-amber-400/20" },
  Sandal: { gradient: "from-neon-lime to-teal-400", glow: "shadow-neon-lime/20" },
  Shirt: { gradient: "from-sky-400 to-neon-cyan", glow: "shadow-neon-cyan/20" },
  Sneaker: { gradient: "from-yellow-400 to-neon-lime", glow: "shadow-yellow-400/20" },
  Bag: { gradient: "from-neon-magenta to-purple-400", glow: "shadow-neon-magenta/20" },
  "Ankle boot": { gradient: "from-rose-400 to-red-400", glow: "shadow-rose-400/20" },
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLoading }) => {
  useEffect(() => {
    if (prediction && prediction.confidence > 0.7) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#a3e635", "#22d3ee", "#e879f9"],
      });
    }
  }, [prediction]);

  if (isLoading) {
    return (
      <div className="w-full glass-panel rounded-2xl p-8 border border-white/[0.06] flex flex-col items-center justify-center min-h-[380px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-lime/[0.02] via-neon-cyan/[0.02] to-neon-magenta/[0.02] animate-pulse-slow" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-neon-lime/20 border-t-neon-lime animate-spin" />
            <Sparkles className="w-6 h-6 text-neon-lime animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-frost-white font-heading">Running Neural Inference</h3>
            <p className="text-xs text-frost-muted mt-1">784-dim tensor → feedforward ANN → softmax</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="w-full glass-panel rounded-2xl p-8 border border-white/[0.06] flex flex-col items-center justify-center min-h-[380px] text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-surface-700 border border-white/[0.06] flex items-center justify-center text-frost-muted mb-4">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-frost-gray font-heading">Awaiting Input</h3>
        <p className="text-xs text-frost-muted max-w-sm mt-1">
          Draw, upload a photo, or pick a sample to generate live predictions.
        </p>
      </div>
    );
  }

  const confidencePct = (prediction.confidence * 100).toFixed(1);
  const classStyle = CLASS_COLORS[prediction.predicted_label] || { gradient: "from-neon-lime to-neon-cyan", glow: "shadow-neon-lime/20" };

  const sortedProbs = Object.entries(prediction.probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.06] shadow-2xl flex flex-col gap-6"
    >

      {/* Winner Card */}
      <div className={`relative rounded-xl bg-surface-800/80 p-6 border border-white/[0.06] shadow-xl overflow-hidden ${classStyle.glow}`}>
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${classStyle.gradient} opacity-[0.08] rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${classStyle.gradient} p-[1.5px]`}>
              <div className="w-full h-full bg-surface-900 rounded-[14px] flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-neon-lime/10 text-neon-lime border border-neon-lime/20 font-heading">
                  Predicted
                </span>
                <span className="text-[10px] font-mono text-frost-muted">
                  Class #{prediction.predicted_class}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-frost-white mt-1 font-heading">
                {prediction.predicted_label}
              </h2>
            </div>
          </div>

          {/* Confidence */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs text-frost-muted font-medium">Confidence</span>
            <span className="text-3xl font-bold text-frost-white font-heading mt-0.5">{confidencePct}%</span>
            <div className="flex items-center gap-1 text-[10px] text-neon-lime font-semibold mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>High Certainty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Probability Distribution */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-frost-white flex items-center gap-2 font-heading">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            Softmax Distribution
          </h4>
          <span className="text-[10px] text-frost-muted font-mono">10 classes</span>
        </div>

        <div className="space-y-2">
          {sortedProbs.map(([className, prob], index) => {
            const pct = Math.round(prob * 1000) / 10;
            const isTop = index === 0;

            return (
              <div key={className} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isTop ? "text-frost-white font-bold" : "text-frost-muted"}`}>
                    {className}
                  </span>
                  <span className={`font-mono text-xs ${isTop ? "text-neon-lime font-bold" : "text-frost-muted"}`}>
                    {pct.toFixed(1)}%
                  </span>
                </div>

                {/* Glassmorphic probability bar */}
                <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden border border-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: index * 0.04 }}
                    className={`h-full rounded-full ${
                      isTop
                        ? `bg-gradient-to-r ${classStyle.gradient}`
                        : "bg-gradient-to-r from-frost-muted/30 to-frost-muted/20"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
};
