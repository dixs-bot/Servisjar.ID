"use client";

import { Image as ImageIcon, Video, Camera, AlertCircle } from "lucide-react";
import { MediaUpload } from "./MediaUpload";

export function MediaStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Photo / Video</h2>
        <p className="text-sm text-slate-400">
          Upload foto/video kerusakan device untuk membantu teknisi memahami kondisi.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
        <Camera className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div className="text-xs text-cyan-200/80 leading-relaxed">
          <p className="font-semibold mb-1">Tips foto:</p>
          <p>Bisa foto layar, body, kerusakan fisik, port charger, motherboard, pesan error, bootloop, atau stuck logo.</p>
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Foto Kerusakan</h3>
          <span className="text-xs text-slate-500">maks 5 foto</span>
        </div>
        <MediaUpload kind="PHOTOS" />
      </div>

      {/* Videos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Video Kerusakan</h3>
          <span className="text-xs text-slate-500">maks 2 video</span>
        </div>
        <MediaUpload kind="VIDEOS" />
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-200/80 leading-relaxed">
          File opsional. Anda bisa skip tahap ini jika tidak ada foto/video, tapi sangat membantu
          teknisi menyiapkan diagnosis awal.
        </p>
      </div>
    </div>
  );
}
