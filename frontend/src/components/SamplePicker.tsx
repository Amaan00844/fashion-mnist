"use client";

import React, { useEffect, useRef } from "react";
import { SAMPLE_PRESETS, SamplePreset } from "@/lib/samples";

interface SamplePickerProps {
  onSelectSample: (pixels: number[], label: string) => void;
  isLoading: boolean;
}

const SampleCard: React.FC<{ sample: SamplePreset; onSelect: () => void; isLoading: boolean; }> = ({ sample, onSelect, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.createImageData(28, 28);
    for (let i = 0; i < sample.pixels.length; i++) {
      const v = sample.pixels[i];
      imgData.data[i * 4] = v; imgData.data[i * 4 + 1] = v; imgData.data[i * 4 + 2] = v; imgData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }, [sample]);

  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className="minimal-panel-interactive text-left p-3 rounded-xl bg-white border border-claude-border flex flex-col gap-3 disabled:opacity-50"
    >
      <div className="w-full aspect-square bg-claude-bg rounded-lg flex items-center justify-center border border-claude-border/50 overflow-hidden">
        <canvas ref={canvasRef} width={28} height={28} className="w-16 h-16 image-rendering-pixelated" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-claude-text">{sample.label}</h4>
      </div>
    </button>
  );
};

export const SamplePicker: React.FC<SamplePickerProps> = ({ onSelectSample, isLoading }) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-claude-text mb-4">Select a sample</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {SAMPLE_PRESETS.map((sample) => (
          <SampleCard key={sample.id} sample={sample} onSelect={() => onSelectSample(sample.pixels, sample.label)} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
};
