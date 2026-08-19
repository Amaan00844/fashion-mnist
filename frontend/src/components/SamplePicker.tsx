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
      imgData.data[idx] = val; // R
      imgData.data[idx + 1] = val; // G
      imgData.data[idx + 2] = val; // B
      imgData.data[idx + 3] = 255; // A
    }
    ctx.putImageData(imgData, 0, 0);
  }, [sample]);

  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className="group text-left p-3 rounded-2xl glass-panel-interactive flex flex-col justify-between h-full border border-slate-800/80 hover:border-brand-500/50 bg-slate-900/60 shadow-md hover:shadow-brand-500/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between w-full gap-2 mb-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
          Class #{sample.classId}
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>

      {/* 28x28 Matrix Preview */}
      <div className="w-full h-24 bg-black rounded-xl border border-slate-800 flex items-center justify-center p-2 my-1 shadow-inner relative overflow-hidden group-hover:border-slate-700 transition-colors">
        <canvas
          ref={canvasRef}
          width={28}
          height={28}
          className="w-16 h-16 image-rendering-pixelated rounded shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="mt-2">
        <h4 className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors">
          {sample.label}
        </h4>
        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
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
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Benchmark Fashion Samples
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any canonical 28×28 matrix sample to test instant classification
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
