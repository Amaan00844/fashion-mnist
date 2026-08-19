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
  CheckCircle2,
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

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-brand-500 selection:text-white pb-16">
      
      {/* Header Bar */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive PyTorch ANN Visualizer & FastAPI Endpoint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-['Outfit']">
            Classify Fashion Items with <span className="text-gradient">Deep Neural Networks</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans max-w-2xl mx-auto">
            Draw custom clothing shapes, drag & drop fashion photographs, or evaluate canonical 28×28 dataset samples in real time.
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex justify-center">
          <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 border border-slate-800 shadow-xl">
            
            <button
              onClick={() => setActiveTab("draw")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "draw"
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-lg shadow-brand-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Interactive Draw Pad</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-lg shadow-brand-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>

            <button
              onClick={() => setActiveTab("samples")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === "samples"
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-lg shadow-brand-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Benchmark Samples</span>
            </button>

          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="px-3 py-1 bg-rose-900/60 rounded-lg hover:bg-rose-800 text-rose-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Layout Grid */}
        {activeTab === "samples" ? (
          /* Full Width Layout for Benchmark Samples */
          <div className="space-y-8">
            <SamplePicker onSelectSample={handleSelectSample} isLoading={isLoading} />
            <div className="max-w-2xl mx-auto">
              <PredictionCard prediction={prediction} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          /* 2-Column Split Grid for Draw / Upload */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Input Studio */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Outfit']">
                    {activeTab === "draw" ? (
                      <>
                        <PenTool className="w-4 h-4 text-brand-400" />
                        Draw Studio
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-pink-400" />
                        Image Upload Studio
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeTab === "draw"
                      ? "Draw clothing items with custom brush sizes"
                      : "Drop any fashion photo to downsample to 28x28"}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg">
                  784 Float Tensor
                </span>
              </div>

              {activeTab === "draw" ? (
                <DrawingCanvas onPredict={handlePredictCanvas} isLoading={isLoading} />
              ) : (
                <ImageUploader onPredict={handlePredictFile} isLoading={isLoading} />
              )}
            </div>

            {/* Right Column: Animated Inference Results */}
            <div className="lg:col-span-7">
              <PredictionCard prediction={prediction} isLoading={isLoading} />
            </div>

          </div>
        )}

        {/* Feature Spec Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">ANN Architecture</h4>
              <p className="text-xs text-slate-400 mt-1">
                Multi-layer Perceptron with BatchNorm1d, ReLU, Dropout, and Softmax output.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent-pink/10 text-pink-400 border border-accent-pink/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">10 Fashion Classes</h4>
              <p className="text-xs text-slate-400 mt-1">
                T-shirt, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent-cyan/10 text-cyan-400 border border-accent-cyan/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">FastAPI Backend</h4>
              <p className="text-xs text-slate-400 mt-1">
                Containerized REST API with <code className="text-brand-300">/health</code>, <code className="text-brand-300">/predict</code>, & <code className="text-brand-300">/predict-image</code>.
              </p>
            </div>
          </div>
      {/* Footer Credit */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-800/60 mt-12">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span>Fashion-MNIST AI Studio</span>
          <span>•</span>
          <span>Developed & Deployed by <strong className="text-gradient">Amaan Chauhan</strong></span>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

    </div>
  );
}
