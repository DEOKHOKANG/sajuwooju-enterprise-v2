"use client";

/**
 * Image Uploader Component
 *
 * Features:
 * - 드래그 앤 드롭 업로드
 * - 클릭하여 파일 선택
 * - 업로드 진행 상태 표시
 * - 미리보기
 * - 삭제 기능
 */

import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string | null) => void;
  className?: string;
  placeholder?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  value,
  onChange,
  className,
  placeholder = "이미지를 드래그하거나 클릭하여 업로드",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.");
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "업로드에 실패했습니다.");
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!value) return;

    try {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
    } catch (err) {
      console.error("Failed to delete file:", err);
    }

    onChange(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          uploadFile(file);
          break;
        }
      }
    }
  }, []);

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              title="변경"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-white transition-colors"
              title="삭제"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          dragActive
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600",
          error && "border-red-400 dark:border-red-600"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              업로드 중...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="text-xs text-purple-600 hover:underline"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {placeholder}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PNG, JPG, GIF, WebP (최대 {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Multi-image uploader
interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  className?: string;
  maxImages?: number;
  maxSizeMB?: number;
}

export function MultiImageUploader({
  values = [],
  onChange,
  className,
  maxImages = 10,
  maxSizeMB = 5,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.");
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "업로드에 실패했습니다.");
      }

      onChange([...values, data.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (index: number) => {
    const urlToRemove = values[index];

    try {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      });
    } catch (err) {
      console.error("Failed to delete file:", err);
    }

    onChange(values.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => uploadFile(file));
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Image Grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {values.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {values.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            "border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                이미지 추가 ({values.length}/{maxImages})
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
