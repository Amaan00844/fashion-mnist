"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, ArrowRight, CheckCircle2, FileImage } from "lucide-react";
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

    // Draw to 28x28 preview canvas
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
    <div className="w-full flex flex-col items-center gap-6">
      
      {/* Dropzone container */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-[340px] h-[280px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
          dragActive
            ? "border-brand-500 bg-brand-500/10 scale-[1.02]"
            : selectedFile
            ? "border-emerald-500/50 bg-slate-900/90"
            : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80"
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
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[220px]">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-200">
                Drop your fashion image here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PNG, JPG, WebP (Auto 28×28 grayscale conversion)
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700">
              Browse Files
            </span>
          </>
        )}
      </div>

      {/* 28x28 Resized Preview Badge */}
      {selectedFile && (
        <div className="w-full max-w-[340px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <canvas
              ref={previewCanvasRef}
              width={28}
              height={28}
              className="w-10 h-10 rounded border border-slate-700 bg-black image-rendering-pixelated"
            />
            <div>
              <p className="text-xs font-bold text-slate-200">Auto-Resized Grayscale</p>
              <p className="text-[10px] text-slate-400 font-mono">28 × 28 Tensor Matrix</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      )}

      {/* Predict Button */}
      <button
        onClick={() => selectedFile && onPredict(selectedFile)}
        disabled={isLoading || !selectedFile}
        className={`w-full max-w-[340px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all ${
          selectedFile && !isLoading
            ? "bg-gradient-to-r from-accent-violet via-brand-500 to-accent-pink text-white hover:shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing Image Upload...</span>
          </>
        ) : (
          <>
            <FileImage className="w-4 h-4 text-pink-300" />
            <span>Predict Uploaded Image</span>
          </>
        )}
      </button>

    </div>
  );
};
