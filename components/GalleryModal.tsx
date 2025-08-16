// GalleryModal.tsx
"use client";
import { useEffect } from "react";

type Props = {
  open: boolean;
  images: string[];
  index: number;
  title?: string;
  onClose: () => void;
  onPrev: () => void;                          // step -1
  onNext: (delta?: number) => void;            // step +1 by default OR custom delta
  onSelect?: (idx: number) => void;            // jump to absolute index (optional)
};

export default function GalleryModal({
  open,
  images,
  index,
  title,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: Props) {
  // Close on ESC, navigate with arrows
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  const img = images[index] ?? images[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="font-medium truncate">{title ?? "Galeria"}</div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-gray-100">
            Fechar ✕
          </button>
        </div>

        <div className="relative bg-black flex items-center justify-center" style={{ minHeight: 400 }}>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-white/80 hover:bg-white"
            aria-label="Anterior"
          >
            ←
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="max-h-[70vh] w-auto object-contain" draggable={false} />

          <button
            type="button"
            onClick={() => onNext()}   // default +1
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-white/80 hover:bg-white"
            aria-label="Seguinte"
          >
            →
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                onClick={() => (onSelect ? onSelect(i) : onNext(i - index))} // jump exact, else delta
                alt=""
                className={`h-16 w-auto object-cover rounded-lg border cursor-pointer ${
                  i === index ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
