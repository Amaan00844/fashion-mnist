"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, RotateCcw } from "lucide-react";

interface DrawingCanvasProps {
  onPredict: (pixels: number[]) => void;
  isLoading: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onPredict, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(16);
  const [hasContent, setHasContent] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const extractPixels = (): number[] => {
    const canvas = canvasRef.current;
    if (!canvas) return new Array(784).fill(0);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return new Array(784).fill(0);

    tempCtx.fillStyle = "black";
    tempCtx.fillRect(0, 0, 28, 28);
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    const imgData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels: number[] = [];

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      pixels.push(Math.round(0.299 * r + 0.587 * g + 0.114 * b));
    }
    return pixels;
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
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;

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
    ctx.strokeStyle = "white";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="bg-claude-bg p-2 rounded-xl border border-claude-border">
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
          className="w-full max-w-[280px] h-[280px] rounded-lg cursor-crosshair touch-none bg-black"
        />
      </div>

      <div className="w-full max-w-[280px] flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-claude-bg px-3 py-2 rounded-lg border border-claude-border">
          <Paintbrush className="w-4 h-4 text-claude-muted" />
          <input
            type="range"
            min={8}
            max={28}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1 bg-claude-border rounded-lg appearance-none cursor-pointer accent-claude-text"
          />
        </div>
        <button
          onClick={initCanvas}
          className="p-2 rounded-lg bg-claude-bg border border-claude-border hover:bg-white text-claude-muted hover:text-claude-text transition-colors"
          title="Clear"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => onPredict(extractPixels())}
        disabled={isLoading || !hasContent}
        className="btn-primary w-full max-w-[280px] py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Classifying..." : "Classify Drawing"}
      </button>
    </div>
  );
};
