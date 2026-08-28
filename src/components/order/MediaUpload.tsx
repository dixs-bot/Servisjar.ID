"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Video, X, UploadCloud, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderWizard, makeUploadedFile } from "@/lib/order-wizard-store";
import { FILE_LIMITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "@/lib/types";

interface MediaUploadProps {
  kind: "PHOTOS" | "VIDEOS";
}

export function MediaUpload({ kind }: MediaUploadProps) {
  const { form, patch } = useOrderWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = FILE_LIMITS[kind];
  const files = kind === "PHOTOS" ? form.photos : form.videos;
  const setFiles = (next: UploadedFile[]) => {
    if (kind === "PHOTOS") patch({ photos: next });
    else patch({ videos: next });
  };

  const validateFile = (file: File): string | null => {
    if (!limit.mime.includes(file.type)) {
      return `${file.name}: tipe tidak didukung. Allowed: ${limit.ext.join(", ")}`;
    }
    if (file.size > limit.maxBytes) {
      const mb = Math.round((limit.maxBytes / 1024 / 1024) * 10) / 10;
      return `${file.name}: melebihi ${mb} MB`;
    }
    return null;
  };

  const handleFiles = (incoming: FileList | File[]) => {
    setError(null);
    const arr = Array.from(incoming);
    const slotsLeft = limit.maxCount - files.length;
    if (slotsLeft <= 0) {
      setError(`Maksimal ${limit.maxCount} file.`);
      return;
    }
    const toAdd: UploadedFile[] = [];
    for (const f of arr.slice(0, slotsLeft)) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        continue;
      }
      toAdd.push(makeUploadedFile(f));
    }
    if (toAdd.length > 0) {
      setFiles([...files, ...toAdd]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    // Revoke object URL to free memory
    if (files[idx].preview) URL.revokeObjectURL(files[idx].preview!);
    setFiles(next);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const isPhotos = kind === "PHOTOS";
  const Icon = isPhotos ? ImageIcon : Video;
  const maxMb = Math.round((limit.maxBytes / 1024 / 1024) * 10) / 10;

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all",
          dragOver
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-700 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={limit.mime.join(",")}
          multiple={limit.maxCount > 1}
          onChange={onInputChange}
          className="sr-only"
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              isPhotos
                ? "bg-cyan-500/15 border border-cyan-500/30"
                : "bg-blue-500/15 border border-blue-500/30"
            )}
          >
            <Icon className={cn("w-7 h-7", isPhotos ? "text-cyan-400" : "text-blue-400")} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-2 justify-center">
              <UploadCloud className="w-4 h-4" />
              {isPhotos ? "Upload Foto" : "Upload Video"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Klik atau drag file ke sini. Maks {limit.maxCount} file, {maxMb} MB/file.
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
              {limit.ext.join(" • ")}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <FileWarning className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-200">{error}</p>
        </div>
      )}

      {/* Preview list */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">
              {files.length} / {limit.maxCount} file
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
                setFiles([]);
              }}
              className="h-7 text-xs text-slate-400 hover:text-red-400"
            >
              Hapus semua
            </Button>
          </div>
          <div className={cn("grid gap-3", isPhotos ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1")}>
            {files.map((f, i) => (
              <FilePreview key={i} file={f} onRemove={() => removeFile(i)} isPhotos={isPhotos} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilePreview({
  file,
  onRemove,
  isPhotos,
}: {
  file: UploadedFile;
  onRemove: () => void;
  isPhotos: boolean;
}) {
  const sizeKb = Math.round(file.file.size / 1024);
  const sizeText = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-900/60 border border-slate-700">
      <div className="aspect-video bg-slate-950 flex items-center justify-center">
        {isPhotos && file.preview ? (
           
          <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
        ) : !isPhotos && file.preview ? (
          <video src={file.preview} className="w-full h-full object-cover" controls />
        ) : (
          <Video className="w-8 h-8 text-slate-600" />
        )}
      </div>
      <div className="p-2">
        <p className="text-xs text-slate-300 truncate">{file.file.name}</p>
        <p className="text-[10px] text-slate-500">{sizeText}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Hapus file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
