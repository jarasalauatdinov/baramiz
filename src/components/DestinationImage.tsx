import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPlaceFallbackImage, getPlaceImageSource } from '../utils/placeArtwork';

interface DestinationImageProps {
  src?: string;
  name: string;
  city?: string;
  category?: string;
  alt?: string;
  height?: CSSProperties['height'];
  width?: CSSProperties['width'];
  aspectRatio?: CSSProperties['aspectRatio'];
  radius?: CSSProperties['borderRadius'];
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}

export function DestinationImage({
  src,
  name,
  city,
  category,
  alt,
  height = 280,
  width,
  aspectRatio,
  radius = 28,
  className,
  imageClassName,
  children,
}: DestinationImageProps) {
  const fallbackSource = createPlaceFallbackImage({ name, city, category });
  const [imageSource, setImageSource] = useState(
    getPlaceImageSource({ src, name, city, category }),
  );

  useEffect(() => {
    setImageSource(getPlaceImageSource({ src, name, city, category }));
  }, [category, city, name, src]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height,
        width,
        aspectRatio,
        borderRadius: radius,
        background: 'linear-gradient(135deg, rgba(31,67,55,0.18), rgba(212,176,113,0.2))',
      }}
    >
      <img
        src={imageSource}
        alt={alt ?? name}
        className={imageClassName}
        onError={() => setImageSource(fallbackSource)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(12,23,18,0.02) 0%, rgba(12,23,18,0.14) 58%, rgba(12,23,18,0.42) 100%)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}
