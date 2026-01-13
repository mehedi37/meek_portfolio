import { CldImage } from "next-cloudinary";

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "png" | "jpg";
    crop?: "fill" | "fit" | "scale" | "thumb";
  }
): string {
  const { width, height, quality = 80, format = "auto", crop = "fill" } = options || {};

  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);
  transforms.push(`c_${crop}`);

  const transformString = transforms.join(",");
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(publicId: string, alt: string) {
  return {
    src: publicId,
    alt,
    loader: ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
      getCloudinaryUrl(src, { width, quality: quality || 80 }),
  };
}

// Re-export CldImage for convenience
export { CldImage };
