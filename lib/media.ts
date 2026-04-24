/**
 * Shared media URL helpers used across card and detail media components.
 */

export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = getYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export function getVimeoEmbedUrl(url: string): string {
  const videoId = getVimeoId(url);
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}

export function isDirectVideoUrl(url: string): boolean {
  if (/\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?.*)?$/i.test(url)) {
    return true;
  }
  if (/cloudinary.*\/video\//i.test(url)) {
    return true;
  }
  if (/\/videos?\//i.test(url) && !isYouTubeUrl(url) && !isVimeoUrl(url)) {
    return true;
  }
  return false;
}
