"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { getSafeImageUrl } from "@/lib/imageUtils";

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
    src: string | undefined | null;
    productId?: number | string;
    productName?: string;
    fallbackSrc?: string;
}

/**
 * SafeImage Component
 * Wrapper around Next.js Image with automatic fallback handling
 * Handles broken/404 images from backend gracefully
 */
const SafeImage = ({
    src,
    productId,
    productName,
    fallbackSrc,
    alt,
    ...props
}: SafeImageProps) => {
    // Get safe initial source
    const initialSrc = getSafeImageUrl(src, productId, productName);
    const [imgSrc, setImgSrc] = useState<string>(initialSrc);
    const [hasError, setHasError] = useState(false);

    // Update internal state when prop src changes
    useEffect(() => {
        const newSrc = getSafeImageUrl(src, productId, productName);
        setImgSrc(newSrc);
        setHasError(false);
    }, [src, productId, productName]);

    // Handle image load error
    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            // Use custom fallback or get from utilities
            const fallback = fallbackSrc || getSafeImageUrl(undefined, productId, productName);
            setImgSrc(fallback);
        }
    };

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={handleError}
            // Add unoptimized for external images that might fail
            unoptimized={imgSrc.includes('unsplash.com')}
        />
    );
};

export default SafeImage;
