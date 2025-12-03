// Image utility functions

/**
 * Array of placeholder images for products when image fails to load
 * Using stable Unsplash URLs with specific photo IDs
 */
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop", // Watch
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop", // Product
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop", // Sunglasses
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1000&fit=crop", // Sneakers
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop", // Clothes
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop", // Fashion
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=1000&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=1000&fit=crop", // Bag
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop", // Store
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop", // Sunglasses 2
];

/**
 * Get a placeholder image URL based on product ID or name
 * Uses consistent placeholder for the same product
 */
export const getPlaceholderImage = (productId?: number | string, productName?: string): string => {
    // Create a simple hash from product ID or name to get consistent image
    const seed = productId?.toString() || productName || '0';
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
};

/**
 * Get safe image URL with fallback
 * Returns placeholder if image URL is invalid or empty
 */
export const getSafeImageUrl = (
    imageUrl?: string | null,
    productId?: number | string,
    productName?: string
): string => {
    // Check if image URL is valid
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'null' || imageUrl === 'undefined') {
        return getPlaceholderImage(productId, productName);
    }

    // Return original URL if it looks valid
    return imageUrl;
};

/**
 * Get safe array of image URLs with fallback
 * Filters out invalid images and adds placeholder if array is empty
 */
export const getSafeImageArray = (
    images?: (string | null)[],
    productId?: number | string,
    productName?: string
): string[] => {
    if (!images || images.length === 0) {
        return [getPlaceholderImage(productId, productName)];
    }

    // Filter valid images
    const validImages = images.filter(
        (img): img is string =>
            img !== null &&
            img !== undefined &&
            img.trim() !== '' &&
            img !== 'null' &&
            img !== 'undefined'
    );

    // If no valid images, return placeholder
    if (validImages.length === 0) {
        return [getPlaceholderImage(productId, productName)];
    }

    return validImages;
};

/**
 * Handle image error event
 * Sets fallback placeholder image when image fails to load
 */
export const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    productId?: number | string,
    productName?: string
) => {
    const img = event.currentTarget;
    // Prevent infinite loop
    if (!img.src.includes('unsplash.com')) {
        img.src = getPlaceholderImage(productId, productName);
    }
};
