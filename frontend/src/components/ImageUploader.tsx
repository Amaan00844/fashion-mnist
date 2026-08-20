"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onPredict: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onPredict, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-[280px] h-[280px] rounded-xl border border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
          dragActive
            ? "border-claude-accent bg-claude-accent/5"
            : selectedFile
            ? "border-claude-border bg-claude-bg/50"
            : "border-claude-border bg-claude-bg hover:bg-white"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" />

        {selectedFile && previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-claude-border bg-white p-1">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs font-medium text-claude-text truncate max-w-[200px] px-4">
              {selectedFile.name}
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white border border-claude-border flex items-center justify-center text-claude-muted">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-claude-text">Upload image</p>
              <p className="text-xs text-claude-muted mt-1">PNG, JPG, WebP</p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => selectedFile && onPredict(selectedFile)}
        disabled={isLoading || !selectedFile}
        className="btn-primary w-full max-w-[280px] py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Classifying..." : "Classify Image"}
      </button>
    </div>
  );
};
