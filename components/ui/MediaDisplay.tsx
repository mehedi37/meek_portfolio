"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlay,
  HiPause,
  HiVideoCamera,
  HiVolumeUp,
  HiVolumeOff,
} from "react-icons/hi";
import { FaYoutube, FaExpand } from "react-icons/fa";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Detect if URL is from YouTube
 */
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

/**
 * Detect if URL is from Vimeo
 */
function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

/**
 * Extract YouTube video ID from URL
 */
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Get YouTube thumbnail URL
 */
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Extract Vimeo video ID from URL
 */
function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Check if URL is a direct video file (improved detection)
 * Supports common video extensions and CDN URLs
 */
function isDirectVideo(url: string): boolean {
  // Check for common video extensions
  if (/\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?.*)?$/i.test(url)) {
    return true;
  }
  // Check for Cloudinary video URLs
  if (/cloudinary.*\/video\//i.test(url)) {
    return true;
  }
  // Check for common video CDN patterns
  if (/\/videos?\//i.test(url) && !isYouTubeUrl(url) && !isVimeoUrl(url)) {
    return true;
  }
  return false;
}

/**
 * Check if URL might be playable as video (broader detection)
 */
function isPossibleVideo(url: string): boolean {
  return isDirectVideo(url) || isYouTubeUrl(url) || isVimeoUrl(url);
}

// ============================================================================
// SKELETON / LOADING COMPONENTS
// ============================================================================

function VideoSkeleton() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
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
 * - Mobile: Tap to toggle play/pause
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isYouTube = isYouTubeUrl(videoUrl);
  const isVimeo = isVimeoUrl(videoUrl);
  const canPlayDirectly = !isYouTube && !isVimeo;
  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;
  const youtubeThumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches ||
                  window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Play video
  const playVideo = useCallback(async () => {
    if (!videoRef.current || !canPlayDirectly) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.log("Autoplay blocked:", err);
    }
  }, [canPlayDirectly]);

  // Pause video
  const pauseVideo = useCallback(() => {
    if (!videoRef.current || !canPlayDirectly) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  }, [canPlayDirectly]);

  // Desktop: Mouse enter - start playing
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    setIsHovered(true);
    playVideo();
  }, [isMobile, playVideo]);

  // Desktop: Mouse leave - pause
  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    setIsHovered(false);
    pauseVideo();
  }, [isMobile, pauseVideo]);

  // Mobile: Tap to toggle
  const handleTap = useCallback(() => {
    if (!isMobile || !canPlayDirectly) return;
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [isMobile, canPlayDirectly, isPlaying, playVideo, pauseVideo]);

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
        ref={containerRef}
        className={`relative overflow-hidden cursor-pointer ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
      >
        {/* Thumbnail shown when not playing */}
        {thumbnail && !isPlaying && (
          <img
            src={thumbnail}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover z-[1]"
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
              className="absolute inset-0 z-[2]"
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
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-[3]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiPlay className="w-6 h-6 text-accent ml-1" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video badge */}
        <div className="absolute top-3 right-3 z-[4]">
          <motion.span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white rounded-full"
            animate={{ opacity: isPlaying ? 0 : 1 }}
          >
            <HiVideoCamera className="w-3.5 h-3.5" />
            {isMobile ? "Tap to play" : "Hover to play"}
          </motion.span>
        </div>

        {/* Playing indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="absolute bottom-3 left-3 z-[4]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-accent/90 backdrop-blur-sm text-white rounded-full">
                <motion.div
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.4, 0.75] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                Playing
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[2]" />
      </div>
    );
  }

  // For YouTube/Vimeo or fallback, show thumbnail with play button
  const displayThumbnail = thumbnail || youtubeThumbnail;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayThumbnail ? (
        <img
          src={displayThumbnail}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <span className="text-4xl font-bold text-accent/30">{alt.charAt(0)}</span>
        </div>
      )}

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <motion.div
          className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isYouTube ? (
            <FaYoutube className="w-8 h-8 text-red-600" />
          ) : (
            <HiPlay className="w-7 h-7 text-accent ml-1" />
          )}
        </motion.div>
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
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
  autoPlay?: boolean;
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
  autoPlay = false,
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
  const canPlayDirectly = !isYouTube && !isVimeo;
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
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // No media placeholder
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center ${className}`}>
      <span className="text-4xl font-bold text-accent/30">{alt.charAt(0)}</span>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
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
    <div className={`relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <HiVideoCamera className="w-16 h-16 mx-auto text-accent/30 mb-2" />
        <span className="text-sm text-muted">No media</span>
      </div>
    </div>
  );
}

export default MediaDisplay;
