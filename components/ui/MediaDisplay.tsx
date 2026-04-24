"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  isYouTubeUrl,
  isVimeoUrl,
  getYouTubeId,
  getYouTubeThumbnail,
  getVimeoId,
  isDirectVideoUrl,
} from "@/lib/media";
import {
  HiPlay,
  HiPause,
  HiVideoCamera,
  HiVolumeUp,
  HiVolumeOff,
} from "react-icons/hi";
import { FaYoutube, FaExpand } from "react-icons/fa";

// ============================================================================
// SKELETON / LOADING COMPONENTS
// ============================================================================

function VideoSkeleton() {
  return (
    <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
      <motion.div
        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <HiPlay className="w-6 h-6 text-white/60" />
      </motion.div>
    </div>
  );
}

// ============================================================================
// MINI VIDEO PLAYER (for cards) - Hover/Tap to play
// ============================================================================

interface MiniVideoPlayerProps {
  videoUrl: string;
  thumbnail?: string | null;
  alt: string;
  className?: string;
}

/**
 * Mini video player for cards
 * - Desktop: Hover to play, mouse leave to pause
 * - Mobile/touch: Preview is disabled to preserve card tap navigation
 * - Works with direct video files
 * - YouTube/Vimeo shows thumbnail with play indicator
 */
export function MiniVideoPlayer({
  videoUrl,
  thumbnail,
  alt,
  className = ""
}: MiniVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isTouchDevice = useMediaQuery("(hover: none), (pointer: coarse)");

  const isYouTube = isYouTubeUrl(videoUrl);
  const isVimeo = isVimeoUrl(videoUrl);
  const canPlayDirectly = isDirectVideoUrl(videoUrl);
  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;
  const youtubeThumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

  // Play video
  const playVideo = useCallback(async () => {
    if (!videoRef.current || !canPlayDirectly) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [canPlayDirectly]);

  // Pause video
  const pauseVideo = useCallback(() => {
    if (!videoRef.current || !canPlayDirectly) return;
    videoRef.current.pause();
    setIsPlaying(false);
  }, [canPlayDirectly]);

  // Desktop: Mouse enter - start playing
  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    playVideo();
  }, [isTouchDevice, playVideo]);

  // Desktop: Mouse leave - pause
  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    pauseVideo();
  }, [isTouchDevice, pauseVideo]);

  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // For direct videos, render actual video element
  if (canPlayDirectly && !hasError) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail shown when not playing */}
        {thumbnail && !isPlaying && (
          <img
            src={thumbnail}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover z-1"
          />
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 z-2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VideoSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play indicator when not playing */}
        <AnimatePresence>
          {!isPlaying && !isLoading && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="absolute -inset-2.5 rounded-full bg-accent-soft-hover blur-xl" />
                <span className="absolute -inset-1 rounded-full border border-white/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-linear-to-br from-white/95 via-white/90 to-accent/10 text-accent shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
                  <HiPlay className="h-7 w-7 translate-x-0.5 text-accent" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview badge */}
        <div className="absolute top-3 right-3 z-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white rounded-full">
            <HiVideoCamera className="w-3.5 h-3.5" />
            Preview
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none z-2" />
      </div>
    );
  }

  // For YouTube/Vimeo or fallback, show thumbnail with play button
  const displayThumbnail = thumbnail || youtubeThumbnail;

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
    >
      {displayThumbnail ? (
        <img
          src={displayThumbnail}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-accent-soft-hover to-primary-soft-hover flex items-center justify-center">
          <span className="text-4xl font-bold text-accent/30">{alt.charAt(0)}</span>
        </div>
      )}

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <span className="absolute -inset-3 rounded-full bg-white/10 blur-2xl" />
          <span className="absolute -inset-1.5 rounded-full border border-white/25" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-linear-to-br from-white/95 via-white/90 to-accent/10 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
            {isYouTube ? (
              <FaYoutube className="h-8 w-8 text-red-600 drop-shadow-sm" />
            ) : (
              <HiPlay className="h-7 w-7 translate-x-0.5 text-accent drop-shadow-sm" />
            )}
          </div>
        </div>
      </div>

      {/* Platform badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white rounded-full">
          {isYouTube ? (
            <><FaYoutube className="w-3.5 h-3.5 text-red-500" /> YouTube</>
          ) : isVimeo ? (
            <><HiVideoCamera className="w-3.5 h-3.5 text-blue-400" /> Vimeo</>
          ) : (
            <><HiVideoCamera className="w-3.5 h-3.5" /> Video</>
          )}
        </span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// ============================================================================
// FULL VIDEO PLAYER (for detail pages)
// ============================================================================

interface VideoPlayerProps {
  url: string;
  thumbnail?: string | null;
  title?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
}

/**
 * Full-featured video player for detail pages
 * Supports YouTube, Vimeo, and direct video files with custom controls
 */
export function VideoPlayer({
  url,
  thumbnail,
  title = "Video",
  className = "",
  aspectRatio = "video",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isYouTube = isYouTubeUrl(url);
  const isVimeo = isVimeoUrl(url);
  const youtubeId = isYouTube ? getYouTubeId(url) : null;
  const vimeoId = isVimeo ? getVimeoId(url) : null;

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && hasStarted) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, hasStarted, showControls]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render YouTube embed
  if (isYouTube && youtubeId) {
    const youtubeThumbnail = thumbnail || getYouTubeThumbnail(youtubeId);

    if (!hasStarted) {
      return (
        <div className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-2xl overflow-hidden ${className}`}>
          <img
            src={youtubeThumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={() => setHasStarted(true)}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaYoutube className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-black/70 backdrop-blur-sm text-white rounded-full">
              <FaYoutube className="w-4 h-4 text-red-500" />
              Watch on YouTube
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-2xl overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Render Vimeo embed
  if (isVimeo && vimeoId) {
    if (!hasStarted) {
      return (
        <div className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-2xl overflow-hidden ${className}`}>
          {thumbnail && (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          )}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={() => setHasStarted(true)}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
            >
              <HiPlay className="w-10 h-10 text-white ml-1" />
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-2xl overflow-hidden ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Render direct video player with custom controls
  return (
    <div
      ref={containerRef}
      className={`relative ${aspectClasses[aspectRatio]} bg-black rounded-2xl overflow-hidden ${className} group`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        poster={thumbnail || undefined}
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VideoSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play overlay (before started) */}
      <AnimatePresence>
        {!hasStarted && !isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={() => { togglePlay(); setHasStarted(true); }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiPlay className="w-10 h-10 text-accent ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom controls */}
      <AnimatePresence>
        {(showControls || !isPlaying) && hasStarted && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress"
              onClick={handleSeek}
            >
              <motion.div
                className="h-full bg-accent rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
              </motion.div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <HiPause className="w-5 h-5 text-white" />
                  ) : (
                    <HiPlay className="w-5 h-5 text-white ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? (
                    <HiVolumeOff className="w-5 h-5 text-white" />
                  ) : (
                    <HiVolumeUp className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                <span className="text-sm text-white/80 font-medium">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <motion.button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <FaExpand className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <HiVideoCamera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-70">Video unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MEDIA THUMBNAIL (wrapper component for cards)
// ============================================================================

interface MediaThumbnailProps {
  image?: string | null;
  videoUrl?: string | null;
  alt: string;
  className?: string;
}

/**
 * Smart media thumbnail - shows video player if available, otherwise image
 * Uses MiniVideoPlayer for video content
 */
export function MediaThumbnail({
  image,
  videoUrl,
  alt,
  className = "",
}: MediaThumbnailProps) {
  const hasVideo = !!videoUrl;

  // If video exists, use MiniVideoPlayer
  if (hasVideo) {
    return (
      <MiniVideoPlayer
        videoUrl={videoUrl}
        thumbnail={image}
        alt={alt}
        className={className}
      />
    );
  }

  // Image only
  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // No media placeholder
  return (
    <div className={`relative overflow-hidden bg-linear-to-br from-accent-soft-hover to-primary-soft-hover flex items-center justify-center ${className}`}>
      <span className="text-4xl font-bold text-accent/30">{alt.charAt(0)}</span>
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// ============================================================================
// MEDIA DISPLAY (main component for detail pages)
// ============================================================================

interface MediaDisplayProps {
  image?: string | null;
  videoUrl?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  priority?: boolean;
}

/**
 * Smart media display - shows video player or image
 * Use this on detail pages for full-featured playback
 */
export function MediaDisplay({
  image,
  videoUrl,
  alt,
  className = "",
  aspectRatio = "video",
  priority = false,
}: MediaDisplayProps) {
  const hasVideo = !!videoUrl;

  // Video takes precedence
  if (hasVideo) {
    return (
      <VideoPlayer
        url={videoUrl}
        thumbnail={image}
        title={alt}
        className={className}
        aspectRatio={aspectRatio === "auto" ? "video" : aspectRatio}
      />
    );
  }

  // Image
  if (image) {
    const aspectClasses = {
      video: "aspect-video",
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      auto: "",
    };

    return (
      <div className={`relative ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden ${className}`}>
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    );
  }

  // Placeholder
  return (
    <div className={`relative aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-accent-soft-hover to-primary-soft-hover flex items-center justify-center ${className}`}>
      <div className="text-center">
        <HiVideoCamera className="w-16 h-16 mx-auto text-accent/30 mb-2" />
        <span className="text-sm text-muted">No media</span>
      </div>
    </div>
  );
}

export default MediaDisplay;
