"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PredictionResponse, CLASS_NAMES } from "@/lib/api";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";

interface PredictionCardProps {
  prediction: PredictionResponse | null;
  isLoading: boolean;
}

// Map class names to visual theme colors
const CLASS_COLORS: Record<string, string> = {
  "T-shirt/top": "from-indigo-500 to-blue-500",
  Trouser: "from-cyan-500 to-teal-500",
  Pullover: "from-purple-500 to-indigo-500",
  Dress: "from-pink-500 to-rose-500",
  Coat: "from-amber-500 to-orange-500",
  Sandal: "from-emerald-500 to-green-500",
  Shirt: "from-sky-500 to-indigo-500",
  Sneaker: "from-yellow-500 to-amber-500",
  Bag: "from-violet-500 to-fuchsia-500",
  "Ankle boot": "from-rose-500 to-red-500",
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLoading }) => {
  // Fire celebratory confetti when high confidence prediction arrives
  useEffect(() => {
    if (prediction && prediction.confidence > 0.7) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#ec4899", "#06b6d4", "#10b981"],
      });
    }
  }, [prediction]);

  if (isLoading) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 border border-slate-800/80 flex flex-col items-center justify-center min-h-[380px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-accent-violet/5 to-accent-pink/5 animate-pulse-slow" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-brand-400 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-200">Evaluating Neural Activations</h3>
            <p className="text-xs text-slate-400 mt-1">Passing 784 pixel tensor through feedforward ANN layers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 border border-slate-800/80 flex flex-col items-center justify-center min-h-[380px] text-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-300">Awaiting Input Pattern</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Draw an item on the canvas, upload an image file, or choose a benchmark preset to generate live predictions.
        </p>
      </div>
    );
  }

  const confidencePct = (prediction.confidence * 100).toFixed(1);
  const colorGradient = CLASS_COLORS[prediction.predicted_label] || "from-brand-500 to-accent-violet";

  // Sort probabilities for ranking
  const sortedProbs = Object.entries(prediction.probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl flex flex-col gap-6"
    >
      
      {/* Top Winner Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950 p-6 border border-slate-800/90 shadow-xl overflow-hidden">
        {/* Ambient glow accent */}
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${colorGradient} opacity-15 rounded-full blur-2xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${colorGradient} p-[1px] shadow-lg`}>
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Predicted Category
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Class #{prediction.predicted_class}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1 font-['Outfit']">
                {prediction.predicted_label}
              </h2>
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs text-slate-400 font-medium">Confidence Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">{confidencePct}%</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>High Certainty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Class Probability Distribution Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Class Probability Distribution (Softmax Outputs)
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">10 Fashion Classes</span>
        </div>

        <div className="space-y-2.5">
          {sortedProbs.map(([className, prob], index) => {
            const pct = Math.round(prob * 1000) / 10;
            const isTop = index === 0;
            const barGradient = isTop
              ? colorGradient
              : "from-slate-700 to-slate-800";

            return (
              <div key={className} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isTop ? "text-white font-bold" : "text-slate-400"}`}>
                    {className}
                  </span>
                  <span className={`font-mono text-xs ${isTop ? "text-brand-300 font-bold" : "text-slate-400"}`}>
                    {pct.toFixed(1)}%
                  </span>
                </div>

                {/* Animated bar */}
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: index * 0.04 }}
                    className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
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
