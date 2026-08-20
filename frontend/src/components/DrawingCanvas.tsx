"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, RotateCcw, Zap } from "lucide-react";

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

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return new Array(784).fill(0);

    tempCtx.fillStyle = isInverted ? "white" : "black";
    tempCtx.fillRect(0, 0, 28, 28);
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    const imgData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels: number[] = [];

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      let gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      if (isInverted) {
        gray = 255 - gray;
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
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Canvas with neon glow border */}
      <div className="relative group">
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-neon-lime via-neon-cyan to-neon-magenta opacity-20 group-hover:opacity-50 blur-sm transition duration-500" />

        <div className="relative bg-surface-800 rounded-2xl p-3 border border-white/[0.06] shadow-2xl flex flex-col items-center">
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
            className="w-full max-w-[280px] h-[280px] rounded-xl cursor-crosshair touch-none bg-black border border-white/[0.04] shadow-inner"
          />

          {/* 28x28 Micro Preview */}
          <div className="absolute bottom-5 right-5 bg-surface-900/95 border border-neon-lime/20 rounded-xl p-2 flex items-center gap-2 shadow-xl backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-frost-muted tracking-wider">Input</span>
              <span className="text-[8px] text-neon-lime font-mono">28×28</span>
            </div>
            <canvas
              ref={previewRef}
              width={28}
              height={28}
              className="w-9 h-9 rounded border border-white/[0.08] bg-black image-rendering-pixelated"
            />
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="w-full max-w-[340px] glass-panel rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Paintbrush className="w-3.5 h-3.5 text-frost-muted" />
          <input
            type="range"
            min={10}
            max={32}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1 bg-surface-600 rounded-lg appearance-none cursor-pointer accent-neon-lime"
          />
        </div>

        <button
          onClick={initCanvas}
          className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-frost-muted hover:text-frost-white transition-colors border border-white/[0.04]"
          title="Clear canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Classify Button */}
      <button
        onClick={handlePredict}
        disabled={isLoading || !hasContent}
        className={`w-full max-w-[340px] py-3 px-6 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all font-heading ${
          hasContent && !isLoading
            ? "bg-gradient-to-r from-neon-lime to-neon-cyan text-surface-900 hover:shadow-neon-lime/25 hover:scale-[1.02] active:scale-[0.98]"
            : "bg-surface-700 text-frost-muted cursor-not-allowed border border-white/[0.04]"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
            <span>Classifying…</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Classify Drawing</span>
          </>
        )}
      </button>
    </div>
  );
};
