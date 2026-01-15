"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button, Card, Spinner, Input, Tabs } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload, FaTrash, FaCopy, FaCheck, FaImages, FaCloudUploadAlt, FaVideo, FaImage, FaPlay } from "react-icons/fa";
import Image from "next/image";

interface CloudinaryResource {
  asset_id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video";
  created_at: string;
}

export default function MediaManagementPage() {
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Fetch resources from Cloudinary
  const fetchResources = useCallback(async (resourceType: "image" | "video" | "all" = "all", cursor?: string) => {
    try {
      setLoading(true);

      if (resourceType === "all") {
        // Fetch both images and videos
        const [imagesRes, videosRes] = await Promise.all([
          fetch(`/api/cloudinary/resources?resource_type=image${cursor ? `&next_cursor=${cursor}` : ""}`).then(r => r.json()),
          fetch(`/api/cloudinary/resources?resource_type=video${cursor ? `&next_cursor=${cursor}` : ""}`).then(r => r.json()),
        ]);

        const allResources = [
          ...(imagesRes.resources || []),
          ...(videosRes.resources || []),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (cursor) {
          setResources(prev => [...prev, ...allResources]);
        } else {
          setResources(allResources);
        }

        setHasMore(!!(imagesRes.next_cursor || videosRes.next_cursor));
        setNextCursor(imagesRes.next_cursor || videosRes.next_cursor);
      } else {
        const response = await fetch(
          `/api/cloudinary/resources?resource_type=${resourceType}${cursor ? `&next_cursor=${cursor}` : ""}`
        );
        const data = await response.json();

        if (cursor) {
          setResources(prev => [...prev, ...(data.resources || [])]);
        } else {
          setResources(data.resources || []);
        }

        setHasMore(!!data.next_cursor);
        setNextCursor(data.next_cursor);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load resources on mount and tab change
  useEffect(() => {
    const resourceType = activeTab === "all" ? "all" : activeTab === "images" ? "image" : "video";
    fetchResources(resourceType as any);
  }, [activeTab, fetchResources]);

  const handleUpload = async (files: FileList | null, resourceType: "image" | "video" = "image") => {
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

        const endpoint = resourceType === "video" ? "video" : "image";
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      // Refresh the list
      const resourceType = activeTab === "all" ? "all" : activeTab === "images" ? "image" : "video";
      fetchResources(resourceType as any);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file(s)");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resource: CloudinaryResource) => {
    if (!confirm(`Are you sure you want to delete this ${resource.resource_type}?`)) return;

    setDeleting(resource.asset_id);
    try {
      const response = await fetch("/api/cloudinary/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: resource.public_id,
          resourceType: resource.resource_type,
        }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setResources(prev => prev.filter(r => r.asset_id !== resource.asset_id));
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
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
      const files = e.dataTransfer.files;
      const isVideo = files[0].type.startsWith("video/");
      handleUpload(files, isVideo ? "video" : "image");
    }
  }, []);

  const filteredResources = resources.filter(resource => {
    if (activeTab === "all") return true;
    if (activeTab === "images") return resource.resource_type === "image";
    if (activeTab === "videos") return resource.resource_type === "video";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
          <p className="text-muted mt-1">
            Upload and manage images and videos from Cloudinary.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onPress={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = true;
              input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files, "image");
              input.click();
            }}
            isPending={uploading}
          >
            <FaImage className="w-4 h-4" />
            Upload Image
          </Button>
          <Button
            onPress={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "video/*";
              input.multiple = true;
              input.onchange = (e) => handleUpload((e.target as HTMLInputElement).files, "video");
              input.click();
            }}
            isPending={uploading}
            variant="secondary"
          >
            <FaVideo className="w-4 h-4" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Config Info */}
      {(!cloudName || !uploadPreset) && (
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Note:</strong> Configure Cloudinary environment variables to enable uploads.
            Set <code className="px-1 py-0.5 bg-surface rounded text-xs">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code>,{" "}
            <code className="px-1 py-0.5 bg-surface rounded text-xs">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>,{" "}
            <code className="px-1 py-0.5 bg-surface rounded text-xs">CLOUDINARY_API_KEY</code>, and{" "}
            <code className="px-1 py-0.5 bg-surface rounded text-xs">CLOUDINARY_API_SECRET</code>.
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
            {dragActive ? "Drop your files here" : "Drag and drop images or videos"}
          </h3>
          <p className="text-sm text-muted mb-4">
            or use the upload buttons above
          </p>
          <p className="text-xs text-muted">
            Images: JPG, PNG, GIF, WebP • Videos: MP4, WebM • Max 100MB per file
          </p>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as any)}
      >
        <Tabs.ListContainer>
        <Tabs.List className="mb-4 border-b border-separator">
          <Tabs.Tab
            key="all"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent px-4 py-2"
            id="all"
          >
            All
          </Tabs.Tab>
          <Tabs.Tab
            key="images"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent px-4 py-2"
            id="images"
          >
            Images
          </Tabs.Tab>
          <Tabs.Tab
            key="videos"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent px-4 py-2"
            id="videos"
          >
            Videos
          </Tabs.Tab>
        </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      {/* Loading State */}
      {loading && resources.length === 0 ? (
        <Card className="p-12 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted">Loading media from Cloudinary...</p>
        </Card>
      ) : filteredResources.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 mx-auto flex items-center justify-center mb-4">
            <FaImages className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No {activeTab === "all" ? "media" : activeTab} yet</h3>
          <p className="text-muted">
            Upload your first {activeTab === "all" ? "file" : activeTab === "images" ? "image" : "video"} to get started.
          </p>
        </Card>
      ) : (
        <>
          {/* Resources Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.asset_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="group overflow-hidden">
                    {/* Media */}
                    <div className="relative aspect-square bg-muted/10">
                      {resource.resource_type === "image" ? (
                        <Image
                          src={resource.secure_url}
                          alt={resource.public_id}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={resource.secure_url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                              <FaPlay className="w-5 h-5 text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyUrl(resource.secure_url, resource.asset_id)}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                          title="Copy URL"
                        >
                          {copiedId === resource.asset_id ? (
                            <FaCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <FaCopy className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(resource)}
                          disabled={deleting === resource.asset_id}
                          className="p-2 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === resource.asset_id ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaTrash className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-2">
                      <p className="text-xs text-muted truncate flex items-center gap-1">
                        {resource.resource_type === "video" ? (
                          <FaVideo className="w-3 h-3" />
                        ) : (
                          <FaImage className="w-3 h-3" />
                        )}
                        {resource.width}×{resource.height} • {resource.format.toUpperCase()}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                onPress={() => {
                  const resourceType = activeTab === "all" ? "all" : activeTab === "images" ? "image" : "video";
                  fetchResources(resourceType as any, nextCursor || undefined);
                }}
                isPending={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
