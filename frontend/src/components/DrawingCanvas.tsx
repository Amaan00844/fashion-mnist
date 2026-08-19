"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, RotateCcw, Zap, Eye, Sparkles } from "lucide-react";

interface DrawingCanvasProps {
  onPredict: (pixels: number[]) => void;
  isLoading: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onPredict, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(18);
  const [hasContent, setHasContent] = useState(false);
  const [isInverted, setIsInverted] = useState(false);

  // Initialize main canvas with black background
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = isInverted ? "white" : "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
    updatePreview();
  };

  useEffect(() => {
    initCanvas();
  }, [isInverted]);

  // Extract flat 784 array of 28x28 grayscale pixels (0-255)
  const extractPixels = (): number[] => {
    const canvas = canvasRef.current;
    if (!canvas) return new Array(784).fill(0);

    // Temp 28x28 offscreen canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return new Array(784).fill(0);

    // Fill background
    tempCtx.fillStyle = isInverted ? "white" : "black";
    tempCtx.fillRect(0, 0, 28, 28);

    // Downscale full resolution drawing
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    const imgData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels: number[] = [];

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      let gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      if (isInverted) {
        gray = 255 - gray; // Flip if background was white
      }
      pixels.push(gray);
    }
    return pixels;
  };

  const updatePreview = () => {
    const previewCanvas = previewRef.current;
    const mainCanvas = canvasRef.current;
    if (!previewCanvas || !mainCanvas) return;
    const pCtx = previewCanvas.getContext("2d");
    if (!pCtx) return;

    pCtx.imageSmoothingEnabled = false;
    pCtx.drawImage(mainCanvas, 0, 0, 28, 28);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasContent(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath();
    }
    updatePreview();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isInverted ? "black" : "white";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    updatePreview();
  };

  const handlePredict = () => {
    const pixels = extractPixels();
    onPredict(pixels);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Canvas container with neon border */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-500 via-accent-violet to-accent-pink opacity-30 group-hover:opacity-60 blur transition duration-500" />
        
        <div className="relative bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full max-w-[280px] h-[280px] rounded-xl cursor-crosshair touch-none bg-black border border-slate-800 shadow-inner"
          />

          {/* 28x28 Micro Preview Badge */}
          <div className="absolute bottom-6 right-6 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2 flex items-center gap-2 shadow-xl backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Model Input</span>
              <span className="text-[9px] text-brand-400 font-mono">28 × 28 px</span>
            </div>
            <canvas
              ref={previewRef}
              width={28}
              height={28}
              className="w-10 h-10 rounded border border-slate-700 bg-black image-rendering-pixelated"
            />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="w-full max-w-[340px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
        
        {/* Brush Size Slider */}
        <div className="flex items-center gap-2 flex-1 px-2">
          <Paintbrush className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min={10}
            max={32}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>

        {/* Clear Button */}
        <button
          onClick={initCanvas}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Clear canvas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Action Button */}
      <button
        onClick={handlePredict}
        disabled={isLoading || !hasContent}
        className={`w-full max-w-[340px] py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all ${
          hasContent && !isLoading
            ? "bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet text-white hover:shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Classifying Fashion Item...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            <span>Classify Drawing</span>
          </>
        )}
      </button>
    </div>
  );
};
