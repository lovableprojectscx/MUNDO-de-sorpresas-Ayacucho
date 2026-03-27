import { useState, useEffect } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/**
 * OptimizedImage
 * 
 * Componente inteligente que intenta usar la API de Transformación de Imágenes de Supabase
 * para reducir el tamaño de descarga (LCP). Si la API no está activada o se alcanza el límite
 * del plan gratuito, hace un fallback (onError) transparente hacia la imagen original pesada.
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  ...props 
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Calcular URL optimizada si proviene de Supabase
    if (src && src.includes(".supabase.co/storage/v1/object/public/") && !hasError) {
      // Reemplazamos endpoint base al de renderizado
      const optimizedUrl = src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
      // Añadimos parámetros de optimización
      setImgSrc(`${optimizedUrl}?width=${width}&quality=80`);
    } else {
      setImgSrc(src);
    }
  }, [src, width, hasError]);

  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={(e) => {
        if (!hasError) {
          // Si falló la versión optimizada (ej. límite de cuota), volvemos a la original
          setHasError(true);
          setImgSrc(src);
        } else {
          // Si también falla la original, mostramos placeholder
          e.currentTarget.src = "/placeholder.svg";
        }
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
