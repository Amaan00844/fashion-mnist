"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { ImageUploader } from "@/components/ImageUploader";
import { SamplePicker } from "@/components/SamplePicker";
import { PredictionCard } from "@/components/PredictionCard";
import { SettingsModal } from "@/components/SettingsModal";
import { predictPixels, predictImageFile, PredictionResponse } from "@/lib/api";
import {
  PenTool,
  Upload,
  Grid,
  Cpu,
  Sparkles,
  Zap,
  Layers,
  Activity,
  Brain,
  Shirt,
  Image as ImageIcon,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"draw" | "upload" | "samples">("draw");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handlePredictCanvas = async (pixels: number[]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await predictPixels(pixels);
      setPrediction(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to PyTorch API backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await predictImageFile(file);
      setPrediction(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to PyTorch API backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = async (pixels: number[], label: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await predictPixels(pixels);
      setPrediction(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not connect to PyTorch API backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabClasses = (tab: string) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 font-heading ${
      activeTab === tab
        ? "bg-gradient-to-r from-neon-lime to-neon-cyan text-surface-900 shadow-lg shadow-neon-lime/15"
        : "text-frost-muted hover:text-frost-white hover:bg-surface-700/60"
    }`;

  return (
    <div className="min-h-screen flex flex-col text-frost-white selection:bg-neon-lime/30 selection:text-white pb-16">

      {/* Header Bar */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* ═══════════════ HERO SECTION with Photo ═══════════════ */}
        <div className="relative overflow-hidden rounded-2xl glass-panel border border-white/[0.06] p-8 sm:p-12">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-neon-lime/[0.06] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-neon-magenta/[0.06] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Left: Text Content */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-[10px] font-bold tracking-widest uppercase font-heading">
                <Brain className="w-3.5 h-3.5" />
                <span>PyTorch Neural Network &bull; Live Inference</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-frost-white font-heading leading-tight">
                Classify Fashion Items with{" "}
                <span className="text-gradient">Deep Learning</span>
              </h2>
              <p className="text-sm sm:text-base text-frost-gray max-w-lg leading-relaxed">
                Draw clothing shapes, drag & drop fashion photographs, or evaluate
                canonical 28&times;28 dataset samples — all classified in real time by a
                multi-layer ANN running on FastAPI.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700/60 border border-white/[0.04] text-[11px] text-frost-muted">
                  <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>784-dim Tensor Input</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700/60 border border-white/[0.04] text-[11px] text-frost-muted">
                  <Layers className="w-3.5 h-3.5 text-neon-magenta" />
                  <span>10 Fashion Classes</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700/60 border border-white/[0.04] text-[11px] text-frost-muted">
                  <Activity className="w-3.5 h-3.5 text-neon-lime" />
                  <span>Softmax Probabilities</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image / Fashion Collage */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glowing ring behind */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-neon-lime/20 via-neon-cyan/10 to-neon-magenta/20 blur-xl opacity-60 animate-pulse-slow" />

                {/* Main hero image card */}
                <div className="relative w-full max-w-sm glass-panel rounded-2xl border border-white/[0.08] p-4 shadow-2xl">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Fashion item cards — simulated lookbook grid */}
                    {[
                      { icon: Shirt, label: "T-shirt", color: "text-neon-lime" },
                      { icon: Sparkles, label: "Dress", color: "text-neon-magenta" },
                      { icon: Zap, label: "Sneaker", color: "text-neon-cyan" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-surface-800/80 border border-white/[0.06] flex flex-col items-center justify-center gap-2 hover:border-neon-lime/20 transition-all duration-300 group cursor-default"
                      >
                        <item.icon className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-bold text-frost-muted font-heading">{item.label}</span>
                      </div>
                    ))}
                    {[
                      { icon: ImageIcon, label: "Bag", color: "text-violet-400" },
                      { icon: Layers, label: "Coat", color: "text-amber-400" },
                      { icon: Grid, label: "Trouser", color: "text-sky-400" },
                    ].map((item, i) => (
                      <div
                        key={i + 3}
                        className="aspect-square rounded-xl bg-surface-800/80 border border-white/[0.06] flex flex-col items-center justify-center gap-2 hover:border-neon-cyan/20 transition-all duration-300 group cursor-default"
                      >
                        <item.icon className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-bold text-frost-muted font-heading">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Terminal-style overlay badge */}
                  <div className="mt-3 bg-black/50 rounded-lg p-3 border border-white/[0.04] font-mono text-[10px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-neon-lime"></span>
                      <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
                      <span className="w-2 h-2 rounded-full bg-neon-magenta"></span>
                      <span className="text-frost-muted ml-1">model.inference()</span>
                    </div>
                    <p className="text-neon-lime">&#x3e; ANN loaded &bull; 10 classes &bull; ready</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════ INPUT MODE TABS ═══════════════ */}
        <div className="flex justify-center">
          <div className="glass-panel p-1.5 rounded-xl flex items-center gap-1 border border-white/[0.04] shadow-xl">
            <button onClick={() => setActiveTab("draw")} className={tabClasses("draw")}>
              <PenTool className="w-4 h-4" />
              <span>Draw Pad</span>
            </button>

            <button onClick={() => setActiveTab("upload")} className={tabClasses("upload")}>
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>

            <button onClick={() => setActiveTab("samples")} className={tabClasses("samples")}>
              <Grid className="w-4 h-4" />
              <span>Samples</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-3 py-1 bg-red-900/40 rounded-lg hover:bg-red-800/60 text-red-200 transition-colors text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ═══════════════ WORKSPACE LAYOUT ═══════════════ */}
        {activeTab === "samples" ? (
          <div className="space-y-8">
            <SamplePicker onSelectSample={handleSelectSample} isLoading={isLoading} />
            <div className="max-w-2xl mx-auto">
              <PredictionCard prediction={prediction} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left: Input Studio */}
            <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-white/[0.06] shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-5 mb-5 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-bold text-frost-white flex items-center gap-2 font-heading">
                    {activeTab === "draw" ? (
                      <>
                        <PenTool className="w-4 h-4 text-neon-lime" />
                        Draw Studio
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-neon-magenta" />
                        Upload Studio
                      </>
                    )}
                  </h3>
                  <p className="text-[11px] text-frost-muted mt-0.5">
                    {activeTab === "draw"
                      ? "Draw clothing items with custom brush sizes"
                      : "Drop any fashion photo — auto-resized to 28×28"}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-surface-800 border border-white/[0.04] text-[9px] font-mono text-frost-muted rounded-lg">
                  784 float
                </span>
              </div>

              {activeTab === "draw" ? (
                <DrawingCanvas onPredict={handlePredictCanvas} isLoading={isLoading} />
              ) : (
                <ImageUploader onPredict={handlePredictFile} isLoading={isLoading} />
              )}
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-7">
              <PredictionCard prediction={prediction} isLoading={isLoading} />
            </div>

          </div>
        )}

        {/* ═══════════════ FEATURE CARDS ═══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="glass-panel p-5 rounded-xl border border-white/[0.06] flex items-start gap-4 group hover:border-neon-lime/15 transition-all duration-300">
            <div className="p-3 rounded-xl bg-neon-lime/10 text-neon-lime border border-neon-lime/15 group-hover:shadow-lg group-hover:shadow-neon-lime/10 transition-shadow">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-frost-white uppercase tracking-wider font-heading">ANN Architecture</h4>
              <p className="text-[11px] text-frost-muted mt-1 leading-relaxed">
                Multi-layer Perceptron with BatchNorm1d, ReLU, Dropout, and Softmax output.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/[0.06] flex items-start gap-4 group hover:border-neon-magenta/15 transition-all duration-300">
            <div className="p-3 rounded-xl bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/15 group-hover:shadow-lg group-hover:shadow-neon-magenta/10 transition-shadow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-frost-white uppercase tracking-wider font-heading">10 Fashion Classes</h4>
              <p className="text-[11px] text-frost-muted mt-1 leading-relaxed">
                T-shirt, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-white/[0.06] flex items-start gap-4 group hover:border-neon-cyan/15 transition-all duration-300">
            <div className="p-3 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/15 group-hover:shadow-lg group-hover:shadow-neon-cyan/10 transition-shadow">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-frost-white uppercase tracking-wider font-heading">FastAPI Backend</h4>
              <p className="text-[11px] text-frost-muted mt-1 leading-relaxed">
                Containerized REST API with <code className="text-neon-lime">/health</code>, <code className="text-neon-lime">/predict</code>, & <code className="text-neon-lime">/predict-image</code>.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-frost-muted border-t border-white/[0.04] mt-12">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>Fashion-MNIST AI Studio</span>
          <span className="text-neon-lime">•</span>
          <span>Developed & Deployed by <strong className="text-gradient">Amaan Chauhan</strong></span>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

    </div>
  );
}