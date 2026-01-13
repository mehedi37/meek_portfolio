"use client";

import { useState, useRef, useCallback } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaTrash, FaCopy, FaCheck, FaImages, FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";

interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  uploadedAt: string;
}

const STORAGE_KEY = "admin_uploaded_images";

export default function MediaManagementPage() {
  const [images, setImages] = useState<UploadedImage[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const saveImages = (newImages: UploadedImage[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
    setImages(newImages);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!cloudName || !uploadPreset) {
      alert("Cloudinary is not configured. Please set environment variables.");
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "meek_portfolio");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        return {
          id: data.public_id,
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          uploadedAt: new Date().toISOString(),
        } as UploadedImage;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      saveImages([...uploadedImages, ...images]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image(s)");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: UploadedImage) => {
    if (!confirm("Are you sure you want to remove this image from the list?")) return;

    setDeleting(image.id);
    try {
      // Note: This only removes from local storage
      // To delete from Cloudinary, you'd need a server-side API route
      const updated = images.filter((img) => img.id !== image.id);
      saveImages(updated);
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setDeleting(null);
    }
  };

  const copyUrl = useCallback((url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
          <p className="text-muted mt-1">
            Upload and manage your images and media files.
          </p>
        </div>
        <Button
          onPress={() => fileInputRef.current?.click()}
          isPending={uploading}
        >
          {({ isPending }) => (
            <>
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <FaUpload className="w-4 h-4" />
              )}
              {isPending ? "Uploading..." : "Upload Image"}
            </>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Config Info */}
      {(!cloudName || !uploadPreset) && (
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Note:</strong> Configure Cloudinary environment variables to enable uploads.
            Set <code className="px-1 py-0.5 bg-surface rounded text-xs">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{" "}
            <code className="px-1 py-0.5 bg-surface rounded text-xs">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>.
          </p>
        </Card>
      )}

      {/* Upload Zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive
            ? "border-accent bg-accent/5"
            : "border-border hover:border-muted"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mb-4">
            <FaCloudUploadAlt className="w-8 h-8 text-muted" />
          </div>
          <h3 className="font-semibold mb-2">
            {dragActive ? "Drop your files here" : "Drag and drop images"}
          </h3>
          <p className="text-sm text-muted mb-4">
            or click the upload button to browse
          </p>
          <p className="text-xs text-muted">
            Supports: JPG, PNG, GIF, WebP • Max 10MB per file
          </p>
        </div>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaImages className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No images yet</h3>
          <p className="text-muted">
            Upload your first image to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {images.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="group overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-square bg-muted/10">
                    <Image
                      src={image.url}
                      alt={image.publicId}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(image.url, image.id)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === image.id ? (
                          <FaCheck className="w-4 h-4 text-green-400" />
                        ) : (
                          <FaCopy className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        disabled={deleting === image.id}
                        className="p-2 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === image.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <FaTrash className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-muted truncate">
                      {image.width}×{image.height} • {image.format.toUpperCase()}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
