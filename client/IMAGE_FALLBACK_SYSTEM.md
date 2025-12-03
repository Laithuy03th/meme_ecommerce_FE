# 🖼️ Hệ Thống Xử Lý Ảnh Fallback

## ✅ **Đã Được Tích Hợp Hoàn Chỉnh**

Hệ thống tự động xử lý ảnh lỗi/thiếu cho tất cả sản phẩm từ Backend.

### 📁 **File Utilities**: `/lib/imageUtils.ts`

#### **Placeholder Images Pool** (10 ảnh)
- Watch, Product, Sunglasses, Sneakers, Clothes
- Fashion, Shoes, Bag, Store, Sunglasses 2
- URLs: Stable Unsplash với format `?w=800&h=1000&fit=crop`

#### **Functions:**

1. **`getSafeImageUrl(imageUrl, productId, productName)`**
   - Kiểm tra URL có hợp lệ không
   - Nếu null/undefined/empty → trả về placeholder
   - Placeholder được chọn dựa trên productId (consistent)

2. **`getSafeImageArray(images, productId, productName)`**
   - Filter các URL hợp lệ từ array
   - Nếu array rỗng/invalid → trả về [placeholder]

3. **`handleImageError(event, productId, productName)`**
   - Event handler cho `onError` của Image component
   - Set fallback placeholder khi load ảnh fail
   - Prevent infinite loop

---

## 🎯 **Các Component Đã Được Bảo Vệ**

### ✅ **ProductCard** (`/components/ProductCard.tsx`)
```typescript
// Import utilities
import { getSafeImageUrl, handleImageError } from "@/lib/imageUtils";

// Sử dụng safe image
const mainImage = getSafeImageUrl(
  product.thumbnailUrl || product.image, 
  product.id, 
  product.name
);

// Thêm onError handler
<Image
  src={currentImage}
  onError={(e) => handleImageError(e, product.id, product.name)}
/>
```

### ✅ **ProductView** (`/components/ProductView.tsx`)
```typescript
// Safe images với fallback
const safeImages = getSafeImageArray(product.images, product.id, product.name);
const safeMainImage = getSafeImageUrl(product.image, product.id, product.name);

// Main image + thumbnails có onError handler
<Image onError={(e) => handleImageError(e, product.id, product.name)} />
```

### ✅ **BestSellersSlider** (`/components/BestSellersSlider.tsx`)
```typescript
// Safe image cho slider
const safeImage = getSafeImageUrl(
  product.thumbnailUrl || product.image,
  product.id,
  product.name
);

// onError handler
<Image onError={(e) => handleImageError(e, product.id, product.name)} />
```

### ✅ **ProductList** (`/components/ProductList.tsx`)
- Sử dụng ProductCard → Tự động được bảo vệ

---

## 🛡️ **Cơ Chế Bảo Vệ 2 Lớp**

### **Layer 1: Pre-check (getSafeImageUrl)**
- Kiểm tra URL trước khi render
- Ngăn chặn invalid URLs ngay từ đầu
- Return placeholder cho: null, undefined, empty, "null", "undefined"

### **Layer 2: Runtime Error Handling (onError)**
- Xử lý khi ảnh load fail (404, network error, etc.)
- Tự động thay bằng placeholder
- Prevent infinite loop với check Unsplash domain

---

## 📊 **Luồng Xử Lý**

```
Backend API Response
    ↓
    ├─ Có URL ảnh hợp lệ?
    │  ├─ YES → Dùng URL từ BE
    │  └─ NO  → Dùng Placeholder (dựa vào productId)
    ↓
Next.js Image Component
    ↓
    ├─ Load thành công?
    │  ├─ YES → Hiển thị ảnh
    │  └─ NO  → onError trigger → Thay bằng Placeholder
    ↓
User thấy ảnh (luôn luôn có ảnh)
```

---

## ✨ **Ưu Điểm**

1. **Không Bao Giờ Thấy Ảnh Broken** 🚫🖼️
2. **Consistent**: Cùng sản phẩm luôn có cùng placeholder
3. **Diverse**: 10 ảnh khác nhau tránh lặp lại
4. **Performance**: Pre-check giảm failed requests
5. **UX Friendly**: Ảnh placeholder vẫn đẹp và professional

---

## 🔧 **Cách Sử Dụng Cho Components Mới**

```tsx
import { getSafeImageUrl, handleImageError } from "@/lib/imageUtils";

// Component
const MyComponent = ({ product }) => {
  const safeImage = getSafeImageUrl(
    product.image, 
    product.id, 
    product.name
  );

  return (
    <Image
      src={safeImage}
      onError={(e) => handleImageError(e, product.id, product.name)}
      // ... other props
    />
  );
};
```

---

## ✅ **Tất Cả Sản Phẩm Đã Được Bảo Vệ**

Mọi nơi hiển thị sản phẩm trong website đều:
- ✅ Kiểm tra URL hợp lệ
- ✅ Có onError handler
- ✅ Sử dụng placeholder khi cần
- ✅ Đảm bảo UX mượt mà

**→ User sẽ LUÔN thấy ảnh đẹp, không bao giờ thấy broken image!** 🎉
