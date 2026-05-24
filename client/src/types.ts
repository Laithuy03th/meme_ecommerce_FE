import { z } from "zod";

export type CategoryType = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  parentName?: string;
  sortOrder?: number;
  status?: "ACTIVE" | "INACTIVE";
  imageUrl?: string;
};

export type ProductImageType = {
  id: number;
  imageUrl: string;
  thumbnail: boolean;
  sortOrder: number;
};

export type ProductVariantType = {
  id: number;
  sku: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  status: string;
};

export type ProductType = {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  price: number; // Used in list view
  basePrice?: number; // Used in detail view
  categorySlug?: string;
  categoryName?: string;

  brand?: string | null;
  averageRating?: number | null;
  reviewCount?: number;
  soldCount?: number;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  isFeatured?: boolean | null;
  discountPercent?: number | null;

  createdAt?: string;
  updatedAt?: string;
  status?: string;

  description?: string; // UI alias
  shortDesc?: string;
  longDesc?: string;

  rating?: number; // UI alias
  reviews?: number; // UI alias

  images?: { id: number; imageUrl: string; thumbnail: boolean; sortOrder: number }[] | string[];
  image?: string; // UI alias for thumbnailUrl

  isNew?: boolean; // Derived or optional
  isSale?: boolean; // Derived or optional
  originalPrice?: number;

  startRating?: number; // for review summary

  colors?: string[]; // UI helper
  sizes?: string[]; // UI helper
  variantImages?: Record<string, string>; // UI helper
  variants?: ProductVariantType[];

  weight?: number;
  stockQuantity?: number;
  viewCount?: number;
  videoUrl?: string | null;

  // Added for specs feature
  specifications?: Record<string, string> | null;
};

export type SearchKeywordSuggestion = {
  keyword: string;
  categoryName: string;
  categorySlug: string;
};

export type PaginatedResponse<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type ProductsType = ProductType[];

// Updated Cart Types to match API
export type CartItemType = {
  id: number; // Cart Item ID
  productId: number;
  variantId?: number;
  productName: string;
  productSlug: string;
  thumbnailUrl: string;
  color?: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;

  // UI helper props (optional)
  selectedSize?: string;
  selectedColor?: string;
};

export type CartType = {
  id: number;
  totalAmount: number;
  totalItems: number;
  items: CartItemType[];
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z
    .string()
    .min(7, "Phone number must be between 7 and 10 digits!")
    .max(10, "Phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder is required!"),
  cardNumber: z
    .string()
    .min(16, "Card Number is required!")
    .max(16, "Card Number is required!"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Expiration date must be in MM/YY format!"
    ),
  cvv: z.string().min(3, "CVV is required!").max(3, "CVV is required!"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  cartId: number | null;
  totalAmount: number;
  totalItems: number;
  hasHydrated: boolean;
  isLoading: boolean;
  selectedItemIds: number[];
};

export type CartStoreActionsType = {
  fetchCart: () => Promise<void>;
  addToCart: (product: ProductType, quantity: number, variantId?: number, color?: string, size?: string) => Promise<CartItemType[] | null>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>; // For merging local cart after login if needed
  toggleSelection: (itemId: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setSelectedItems: (itemIds: number[]) => void;
};

// Auth Types
export type UserType = {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
  avatarUrl?: string; // New
  memberSince?: string; // New
  totalOrders?: number; // New
  totalSpent?: number; // New
  membershipLevel?: string; // New
  verified?: boolean; // New
  gender?: string; // New
  dateOfBirth?: string; // New
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string | null;
  user: UserType;
};

export type RegisterResponse = UserType;

// --- ADDRESS TYPES ---
export type AddressType = {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  label?: string;
  zipCode?: string;
  isDefault?: boolean; // UI uses isDefault
  default?: boolean;   // API returns default
  createdAt?: string;
};

// --- VOUCHER TYPES ---
export type VoucherType = {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
};

export type VoucherValidationResponse = {
  valid: boolean;
  message?: string;
  discountAmount: number;
  voucher?: VoucherType;
};

// --- ORDER TYPES ---
export type OrderItemType = {
  id: number;
  productId?: number;
  variantId?: number;
  productName: string;
  productSlug?: string;
  thumbnailUrl?: string;     // Legacy
  productImageUrl?: string;  // New API
  color?: string;            // Legacy
  size?: string;             // Legacy
  variantInfo?: string;      // New API
  unitPrice?: number;        // Legacy
  price?: number;            // New API
  quantity: number;
  totalPrice?: number;
  hasReviewed?: boolean; // New field for per-item review tracking
};

export type OrderTimelineType = {
  status: string;
  timestamp: string;
  completed: boolean;
};

export type OrderType = {
  id: number;
  orderNumber?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | { type: string; last4?: string };
  totalAmount: number;
  shippingFee: number;
  subtotal?: number; // Added from GET /orders/1 response
  note?: string;
  createdAt: string;
  deliveredAt?: string;
  items?: OrderItemType[];

  timeline?: OrderTimelineType[];
  shippingAddress?: {
    fullName: string;
    addressLine: string; // API returns addressLine
    phone: string;
  };
  itemCount?: number; // List view has this
  firstItemImageUrl?: string; // List view has this
};

// --- WISHLIST TYPES ---
export type WishlistItemType = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  thumbnailUrl: string;
  basePrice: number;
  createdAt: string;
};

// --- REVIEW TYPES ---
export type ReviewType = {
  id: number;
  userFullName: string;
  productId: number;        // BE returns this
  productName: string;      // BE returns this
  productImage: string;     // BE returns this (note: productImage, not productImageUrl)
  rating: number;
  comment: string;
  createdAt: string;
  imageUrl?: string;
  adminReply?: string;
  adminRepliedAt?: string;
  user?: { // Frontend often maps this sometimes
    id?: number;
    fullName?: string;
    avatarUrl?: string;
  };
};

export type ReviewSummaryType = {
  productId: number;
  averageRating: number;
  totalReviews: number;
  starCounts: Record<string, number>;
};
