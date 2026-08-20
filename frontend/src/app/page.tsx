"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { ImageUploader } from "@/components/ImageUploader";
import { SamplePicker } from "@/components/SamplePicker";
import { PredictionCard } from "@/components/PredictionCard";
import { SettingsModal } from "@/components/SettingsModal";
import { predictPixels, predictImageFile, PredictionResponse } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"draw" | "upload" | "samples">("draw");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handlePredict = async (action: () => Promise<PredictionResponse>) => {
    setIsLoading(true); setErrorMessage(null);
    try { setPrediction(await action()); }
    catch (err: any) { setErrorMessage(err.message || "Error connecting to backend."); }
    finally { setIsLoading(false); }
  };

  const tabClass = (tab: string) =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      activeTab === tab ? "border-claude-text text-claude-text" : "border-transparent text-claude-muted hover:text-claude-text"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-claude-bg">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-12">
        
        {/* Header Section */}
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-serif text-claude-text mb-4">
            Fashion classifier
          </h2>
          <p className="text-lg text-claude-muted leading-relaxed">
            A minimalist demonstration of deep learning. Draw an item, upload a photo, or select a sample to test the neural network in real time.
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100 flex justify-between items-center">
            {errorMessage}
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">✕</button>
          </div>
        )}

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="flex border-b border-claude-border">
              <button onClick={() => setActiveTab("draw")} className={tabClass("draw")}>Draw</button>
              <button onClick={() => setActiveTab("upload")} className={tabClass("upload")}>Upload</button>
              <button onClick={() => setActiveTab("samples")} className={tabClass("samples")}>Samples</button>
            </div>

            <div className="minimal-panel p-6 flex justify-center">
              {activeTab === "draw" && <DrawingCanvas onPredict={(p) => handlePredict(() => predictPixels(p))} isLoading={isLoading} />}
              {activeTab === "upload" && <ImageUploader onPredict={(f) => handlePredict(() => predictImageFile(f))} isLoading={isLoading} />}
              {activeTab === "samples" && <SamplePicker onSelectSample={(p) => handlePredict(() => predictPixels(p))} isLoading={isLoading} />}
            </div>
          </div>

          <div className="lg:col-span-7">
            <PredictionCard prediction={prediction} isLoading={isLoading} />
          </div>

        </div>

      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}