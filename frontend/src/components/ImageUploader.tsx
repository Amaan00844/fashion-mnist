"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle2, FileImage, Camera } from "lucide-react";
import { predictImageFile, PredictionResponse } from "@/lib/api";

interface ImageUploaderProps {
  onPredict: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onPredict, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 28, 28);
      ctx.drawImage(img, 0, 0, 28, 28);
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">

      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-[340px] h-[280px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-neon-lime bg-neon-lime/[0.05] scale-[1.02]"
            : selectedFile
            ? "border-neon-cyan/30 bg-surface-800/90"
            : "border-white/[0.08] bg-surface-800/40 hover:border-neon-lime/20 hover:bg-surface-800/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {selectedFile && previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/[0.08] shadow-xl bg-surface-900">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-frost-white truncate max-w-[220px]">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-frost-muted font-mono mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/15 flex items-center justify-center text-neon-cyan">
              <Camera className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-frost-white font-heading">
                Drop your fashion photo
              </p>
              <p className="text-xs text-frost-muted mt-1">
                PNG, JPG, WebP • Auto-resized to 28×28 grayscale
              </p>
            </div>
            <span className="px-3 py-1.5 bg-surface-700 rounded-lg text-xs font-semibold text-frost-gray border border-white/[0.06] hover:bg-surface-600 transition-colors">
              Browse Files
            </span>
          </>
        )}
      </div>

      {/* 28x28 Preview Badge */}
      {selectedFile && (
        <div className="w-full max-w-[340px] glass-panel rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <canvas
              ref={previewCanvasRef}
              width={28}
              height={28}
              className="w-9 h-9 rounded border border-white/[0.08] bg-black image-rendering-pixelated"
            />
            <div>
              <p className="text-xs font-bold text-frost-white">Grayscale Tensor</p>
              <p className="text-[10px] text-frost-muted font-mono">28 × 28 Matrix</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-neon-lime" />
        </div>
      )}

      {/* Predict Button */}
      <button
        onClick={() => selectedFile && onPredict(selectedFile)}
        disabled={isLoading || !selectedFile}
        className={`w-full max-w-[340px] py-3 px-6 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all font-heading ${
          selectedFile && !isLoading
            ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-surface-900 hover:shadow-neon-magenta/25 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-surface-700 text-frost-muted cursor-not-allowed border border-white/[0.04]"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
            <span>Processing…</span>
          </>
        ) : (
          <>
            <FileImage className="w-4 h-4" />
            <span>Classify Image</span>
          </>
        )}
      </button>
    </div>
  );
};
