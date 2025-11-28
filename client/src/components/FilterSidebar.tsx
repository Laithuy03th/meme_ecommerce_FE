"use client";

import { CategoryType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
    categories: CategoryType[];
}

const FilterSidebar = ({ categories }: FilterSidebarProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page when filtering
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
    };

    const currentCategory = searchParams.get("category");

    return (
        <div className="w-full space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            checked={!currentCategory}
                            onChange={() => handleFilterChange("category", "")}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className={`text-sm ${!currentCategory ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-primary'}`}>
                            All Categories
                        </span>
                    </label>
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={currentCategory === cat.slug}
                                onChange={() => handleFilterChange("category", cat.slug)}
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <span className={`text-sm ${currentCategory === cat.slug ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-primary'}`}>
                                {cat.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                    {[
                        { label: "All Prices", min: "", max: "" },
                        { label: "Under $50", min: "", max: "50" },
                        { label: "$50 - $100", min: "50", max: "100" },
                        { label: "$100 - $200", min: "100", max: "200" },
                        { label: "$200 - $300", min: "200", max: "300" },
                        { label: "Over $300", min: "300", max: "" }
                    ].map((range, index) => {
                        const isSelected =
                            (range.min === "" && range.max === "" && !searchParams.get("minPrice") && !searchParams.get("maxPrice")) ||
                            (searchParams.get("minPrice") === range.min && searchParams.get("maxPrice") === range.max);

                        return (
                            <label key={index} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    checked={isSelected}
                                    onChange={() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (range.min) params.set("minPrice", range.min);
                                        else params.delete("minPrice");

                                        if (range.max) params.set("maxPrice", range.max);
                                        else params.delete("maxPrice");

                                        params.set("page", "1");
                                        router.push(`/products?${params.toString()}`);
                                    }}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-primary'}`}>
                                    {range.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Colors (Hardcoded for now as API doesn't provide global colors list yet) */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-4">Colors</h3>
                <div className="flex flex-wrap gap-2">
                    {['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple'].map((color) => (
                        <button
                            key={color}
                            className={`w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform ${searchParams.get('color') === color ? 'ring-2 ring-primary ring-offset-2' : ''
                                }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleFilterChange('color', searchParams.get('color') === color ? "" : color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
