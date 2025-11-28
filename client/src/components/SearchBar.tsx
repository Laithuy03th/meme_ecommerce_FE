"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductSuggestions, getPopularSearchKeywords } from "@/services/api";
import { ProductType, SearchKeywordSuggestion } from "@/types";
import Image from "next/image";
import Link from "next/link";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<Record<string, SearchKeywordSuggestion[]>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Determine current category from URL if any
  const currentCategory = searchParams.get("category");

  // Fetch popular keywords on mount
  useEffect(() => {
    const fetchKeywords = async () => {
      const keywords = await getPopularSearchKeywords();
      // Group by category
      const grouped = keywords.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, SearchKeywordSuggestion[]>);
      setPopularKeywords(grouped);
    };
    fetchKeywords();
  }, []);

  const fetchSuggestions = async (keyword: string) => {
    if (keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getProductSuggestions(keyword, currentCategory || undefined);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query);
      if (currentCategory) {
        params.set("category", currentCategory);
      }
      router.push(`/products?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const handleKeywordClick = (keyword: string, categorySlug: string) => {
    const params = new URLSearchParams();
    params.set("search", keyword);
    params.set("category", categorySlug);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
    setQuery(keyword); // Optional: update input to show selected keyword
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-50">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-gray-100/50 border border-gray-200 rounded-full px-4 py-2 w-[200px] md:w-[300px] focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300"
      >
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={currentCategory ? `Search in ${currentCategory}...` : "Search products..."}
          className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setSuggestions([]); }}>
            <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 w-[300px] md:w-[600px] -left-[50px] md:-left-[150px]">

          {/* Case 1: Autocomplete Suggestions (User is typing) */}
          {query.length >= 2 ? (
            <div className="p-2">
              {isLoading ? (
                <p className="text-xs text-center text-gray-400 py-4">Searching...</p>
              ) : suggestions.length > 0 ? (
                <>
                  <p className="text-xs font-semibold text-gray-400 px-3 py-2">PRODUCT SUGGESTIONS</p>
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.thumbnailUrl || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=100"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{product.categoryName}</span>
                          <span>•</span>
                          <span className="font-semibold text-primary">${product.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <p className="text-xs text-center text-gray-400 py-4">No results found</p>
              )}
            </div>
          ) : (
            /* Case 2: Quick Keyword Suggestions (User focused but hasn't typed much) */
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">Popular Searches</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(popularKeywords).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{category}</h4>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li key={item.keyword}>
                          <button
                            onClick={() => handleKeywordClick(item.keyword, item.categorySlug)}
                            className="text-sm text-gray-600 hover:text-primary hover:translate-x-1 transition-all text-left w-full py-1"
                          >
                            {item.keyword}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;