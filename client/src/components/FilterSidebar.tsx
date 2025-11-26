"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FilterSidebar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="w-full space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    {['Electronics', 'Fashion', 'Home & Living', 'Beauty'].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                onChange={(e) => {
                                    // Handle multiple categories logic if needed, for now simple toggle
                                }}
                            />
                            <span className="text-gray-600 group-hover:text-primary transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    />
                </div>
                <button
                    className="mt-3 w-full bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("minPrice", priceRange.min.toString());
                        params.set("maxPrice", priceRange.max.toString());
                        router.push(`/products?${params.toString()}`);
                    }}
                >
                    Apply Price
                </button>
            </div>

            {/* Colors */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Colors</h3>
                <div className="flex flex-wrap gap-2">
                    {['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple'].map((color) => (
                        <button
                            key={color}
                            className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform ${searchParams.get('color') === color ? 'ring-2 ring-primary ring-offset-2' : ''
                                }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleFilterChange('color', color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                            key={size}
                            className={`px-3 py-1 border rounded-md text-sm transition-colors ${searchParams.get('size') === size
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                            onClick={() => handleFilterChange('size', size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
