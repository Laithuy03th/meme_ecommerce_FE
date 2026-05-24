"use client";

import { Cpu, Smartphone, Zap, Camera, Battery, Droplet, Sparkles, Leaf, Shirt, Scissors, Maximize, Ruler, Home, Monitor, Clock, ShieldCheck, Box } from "lucide-react";
import React from "react";

interface ProductSpecsTabProps {
  specifications: Record<string, string>;
  categorySlug?: string;
}

// Icon mapper for common specification keys
const getIconForKey = (key: string, category?: string) => {
  const k = key.toLowerCase();
  
  // Electronics
  if (k.includes("màn hình")) return <Monitor className="w-5 h-5" />;
  if (k.includes("cpu") || k.includes("chip") || k.includes("vi xử lý")) return <Cpu className="w-5 h-5" />;
  if (k.includes("ram") || k.includes("bộ nhớ")) return <Box className="w-5 h-5" />;
  if (k.includes("pin") || k.includes("battery")) return <Battery className="w-5 h-5" />;
  if (k.includes("camera")) return <Camera className="w-5 h-5" />;
  if (k.includes("kết nối") || k.includes("mạng")) return <Zap className="w-5 h-5" />;
  if (k.includes("hệ điều hành")) return <Smartphone className="w-5 h-5" />;

  // Beauty
  if (k.includes("dung tích") || k.includes("thể tích")) return <Droplet className="w-5 h-5" />;
  if (k.includes("thành phần")) return <Leaf className="w-5 h-5" />;
  if (k.includes("công dụng") || k.includes("hiệu quả")) return <Sparkles className="w-5 h-5" />;
  
  // Fashion
  if (k.includes("chất liệu") || k.includes("vải")) return <Shirt className="w-5 h-5" />;
  if (k.includes("co giãn") || k.includes("kích thước") || k.includes("size")) return <Maximize className="w-5 h-5" />;
  if (k.includes("kiểu dáng") || k.includes("phong cách")) return <Scissors className="w-5 h-5" />;

  // Home
  if (k.includes("kích thước") || k.includes("diện tích") || k.includes("dài") || k.includes("rộng")) return <Ruler className="w-5 h-5" />;
  if (k.includes("bảo hành")) return <ShieldCheck className="w-5 h-5" />;
  if (k.includes("hạn sử dụng")) return <Clock className="w-5 h-5" />;
  if (k.includes("xuất xứ")) return <Home className="w-5 h-5" />;

  return <Box className="w-5 h-5" />; // Default icon
};

const ProductSpecsTab: React.FC<ProductSpecsTabProps> = ({ specifications, categorySlug }) => {
  const entries = Object.entries(specifications || {});

  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        Thông số kỹ thuật
      </h3>
      
      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <tbody>
            {entries.map(([key, value], index) => (
              <tr 
                key={key} 
                className={`transition-colors hover:bg-primary/5 ${
                  index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                }`}
              >
                <td className="py-4 px-6 border-b border-gray-100 font-medium text-gray-700 w-1/3 flex items-center gap-3">
                  <div className="text-primary/70 bg-primary/10 p-2 rounded-xl">
                    {getIconForKey(key, categorySlug)}
                  </div>
                  {key}
                </td>
                <td className="py-4 px-6 border-b border-gray-100 text-gray-600">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductSpecsTab;
