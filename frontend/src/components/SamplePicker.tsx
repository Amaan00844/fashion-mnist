"use client";

import React, { useEffect, useRef } from "react";
import { SAMPLE_PRESETS, SamplePreset } from "@/lib/samples";
import { Sparkles, ArrowUpRight } from "lucide-react";

interface SamplePickerProps {
  onSelectSample: (pixels: number[], label: string) => void;
  isLoading: boolean;
}

const SampleCard: React.FC<{
  sample: SamplePreset;
  onSelect: () => void;
  isLoading: boolean;
}> = ({ sample, onSelect, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(28, 28);
    for (let i = 0; i < sample.pixels.length; i++) {
      const val = sample.pixels[i];
      const idx = i * 4;
      imgData.data[idx] = val;
      imgData.data[idx + 1] = val;
      imgData.data[idx + 2] = val;
      imgData.data[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }, [sample]);

  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className="group text-left p-3 rounded-xl glass-panel-interactive flex flex-col justify-between h-full border border-white/[0.04] bg-surface-800/40 shadow-md hover:shadow-neon-lime/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between w-full gap-2 mb-2">
        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-surface-700 text-frost-muted border border-white/[0.04] font-heading">
          #{sample.classId}
        </span>
        <ArrowUpRight className="w-3 h-3 text-frost-muted group-hover:text-neon-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      {/* 28x28 Matrix Preview */}
      <div className="w-full h-20 bg-black rounded-lg border border-white/[0.04] flex items-center justify-center p-2 my-1 relative overflow-hidden group-hover:border-neon-lime/15 transition-colors">
        <canvas
          ref={canvasRef}
          width={28}
          height={28}
          className="w-14 h-14 image-rendering-pixelated rounded group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="mt-2">
        <h4 className="text-xs font-bold text-frost-white group-hover:text-neon-lime transition-colors font-heading">
          {sample.label}
        </h4>
        <p className="text-[9px] text-frost-muted line-clamp-1 mt-0.5">
          {sample.description}
        </p>
      </div>
    </button>
  );
};

export const SamplePicker: React.FC<SamplePickerProps> = ({ onSelectSample, isLoading }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-frost-white flex items-center gap-2 font-heading">
            <Sparkles className="w-4 h-4 text-neon-magenta" />
            Benchmark Samples
          </h3>
          <p className="text-xs text-frost-muted mt-0.5">
            Click any 28×28 sample to classify instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {SAMPLE_PRESETS.map((sample) => (
          <SampleCard
            key={sample.id}
            sample={sample}
            onSelect={() => onSelectSample(sample.pixels, sample.label)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};
