"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import type { PropertyImage } from "@/generated/prisma/client";

interface ImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

export function ImageGallery({ images, propertyTitle }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext]);

  // No images fallback
  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900">
        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImageOff className="size-16 opacity-40" />
          <p className="text-lg font-medium">No images available</p>
        </div>
      </div>
    );
  }

  const maxVisibleThumbs = 5;
  const remainingCount = images.length - maxVisibleThumbs;

  return (
    <>
      {/* Main Image */}
      <div className="space-y-3">
        <button
          type="button"
          className="relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => openLightbox(selectedIndex)}
          aria-label={`View ${propertyTitle} image ${selectedIndex + 1} of ${images.length} in full screen`}
        >
          <Image
            src={images[selectedIndex].imageUrl}
            alt={`${propertyTitle} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
            priority
          />
          {/* Image counter overlay */}
          <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </button>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.slice(0, maxVisibleThumbs).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:w-24 ${
                  selectedIndex === index
                    ? "border-primary ring-1 ring-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.imageUrl}
                  alt={`${propertyTitle} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() => openLightbox(maxVisibleThumbs)}
                className="relative flex aspect-[16/10] w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-transparent bg-muted transition-all hover:border-primary sm:w-24"
                aria-label={`View ${remainingCount} more images`}
              >
                <span className="text-sm font-semibold text-muted-foreground">
                  +{remainingCount}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 text-sm font-medium text-white/80">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-8" />
            </button>
          )}

          {/* Main lightbox image */}
          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={images[selectedIndex].imageUrl}
              alt={`${propertyTitle} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
              aria-label="Next image"
            >
              <ChevronRight className="size-8" />
            </button>
          )}

          {/* Click backdrop to close */}
          <button
            type="button"
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
            tabIndex={-1}
          />
        </div>
      )}
    </>
  );
}
