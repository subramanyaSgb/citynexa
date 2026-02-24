"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Star, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  url: string;
  isPrimary: boolean;
}

interface ImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  bucket?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "property-images",
  multiple = true,
  maxFiles = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Upload failed");
          return null;
        }

        return data.url as string;
      } catch {
        setError("Upload failed. Please try again.");
        return null;
      }
    },
    [bucket]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Validate counts
      if (!multiple && (fileArray.length > 1 || value.length >= 1)) {
        // Single mode: replace existing
        const file = fileArray[0];
        if (!file) return;

        setUploading(true);
        const url = await uploadFile(file);
        setUploading(false);

        if (url) {
          onChange([{ url, isPrimary: true }]);
        }
        return;
      }

      const remaining = maxFiles - value.length;
      if (fileArray.length > remaining) {
        setError(`You can only upload ${remaining} more image${remaining === 1 ? "" : "s"} (max ${maxFiles}).`);
        return;
      }

      setUploading(true);

      const results = await Promise.all(fileArray.map(uploadFile));
      const newImages: UploadedImage[] = results
        .filter((url): url is string => url !== null)
        .map((url) => ({ url, isPrimary: false }));

      if (newImages.length > 0) {
        const updated = [...value, ...newImages];
        // If no image is primary yet, set the first one as primary
        if (!updated.some((img) => img.isPrimary) && updated.length > 0) {
          updated[0].isPrimary = true;
        }
        onChange(updated);
      }

      setUploading(false);
    },
    [value, onChange, multiple, maxFiles, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      // Reset the input so the same file can be re-selected
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const updated = value.filter((_, i) => i !== index);
      // If the removed image was primary, set the first remaining as primary
      if (value[index]?.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      onChange(updated);
    },
    [value, onChange]
  );

  const setPrimary = useCallback(
    (index: number) => {
      const updated = value.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      onChange(updated);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <Loader2 className="mb-2 size-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="mb-2 size-8 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-muted-foreground">
          {uploading
            ? "Uploading..."
            : multiple
              ? "Drop images here or click to browse"
              : "Drop an image here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          JPEG, PNG, or WebP. Max 5MB{multiple ? ` per file. Up to ${maxFiles} images.` : "."}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div className={cn(
          "grid gap-3",
          multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1 max-w-[200px]"
        )}>
          {value.map((image, index) => (
            <div
              key={image.url}
              className={cn(
                "group relative overflow-hidden rounded-lg border",
                image.isPrimary && multiple && "ring-2 ring-primary"
              )}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                {/* Set as primary (only in multi mode) */}
                {multiple && !image.isPrimary && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrimary(index);
                    }}
                    title="Set as primary image"
                  >
                    <Star className="size-4" />
                  </Button>
                )}
                {/* Remove */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="size-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  title="Remove image"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Primary badge */}
              {image.isPrimary && multiple && (
                <div className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  <Star className="size-3 fill-current" />
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Single mode: show replace hint */}
      {!multiple && value.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onChange([]);
          }}
          className="gap-1"
        >
          <X className="size-3" />
          Remove
        </Button>
      )}
    </div>
  );
}
