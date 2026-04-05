"use client";

import { Search, X, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPopularSearchKeywords, getSearchSuggestions } from "@/services/api";
import { ProductType, SearchKeywordSuggestion } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getSafeImageUrl } from "@/lib/imageUtils";

interface SearchBarProps {
  onToggle?: (isOpen: boolean) => void;
}

const SearchBar = ({ onToggle }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);
  // Store full object array to access category name
  const [popularKeywords, setPopularKeywords] = useState<Record<string, SearchKeywordSuggestion[]>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const currentCategory = searchParams.get("category");

  // Notify parent when isOpen changes
  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen, onToggle]);

  useEffect(() => {
    const fetchKeywords = async () => {
      const keywords = await getPopularSearchKeywords();
      // Group by categorySlug
      const grouped = keywords.reduce((acc, item) => {
        if (!acc[item.categorySlug]) {
          acc[item.categorySlug] = [];
        }
        acc[item.categorySlug].push(item);
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
      const data = await getSearchSuggestions(keyword, currentCategory || undefined);
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
      params.set("keyword", query);
      if (currentCategory) {
        params.set("category", currentCategory);
      }
      router.push(`/products?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const handleKeywordClick = (keyword: string, categorySlug: string) => {
    const params = new URLSearchParams();
    params.set("keyword", keyword);
    params.set("category", categorySlug);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
    setQuery(keyword);
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
        className={`flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-5 py-2.5 transition-all duration-500 ease-out shadow-sm hover:shadow-md ${isOpen ? "w-[300px] md:w-[450px] ring-2 ring-primary/30 border-primary bg-white shadow-lg" : "w-[220px] md:w-[280px] hover:bg-white"
          }`}
      >
        <Search className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-primary" : "text-slate-400"}`} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={currentCategory ? `Search in ${currentCategory}...` : "Search for products..."}
          className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium"
        />
        {query ? (
          <button type="button" onClick={() => { setQuery(""); setSuggestions([]); }} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        ) : (
          <div className={`w-6 h-6 rounded-md  flex items-center justify-center text-[10px] text-slate-400 font-sans transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>

          </div>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 w-[90vw] max-w-[600px] md:w-[600px]">

          {/* Decorative Gradient Line */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-secondary" />

          {/* Case 1: Autocomplete Suggestions */}
          {query.length >= 2 ? (
            <div className="p-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-400 tracking-wider">
                    <Sparkles className="w-3 h-3 text-primary" />
                    SUGGESTED PRODUCTS
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-primary/5 rounded-xl transition-all group border border-transparent hover:border-primary/10"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <Image
                            src={getSafeImageUrl(product.thumbnailUrl || product.image, product.id, product.name)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            {product.categoryName && (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                                {product.categoryName}
                              </span>
                            )}
                            <span className="font-bold text-primary">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 font-medium">No results found for "{query}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try checking your spelling or use different keywords</p>
                </div>
              )}
            </div>
          ) : (
            /* Case 2: Quick Keyword Suggestions */
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Popular Searches</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(popularKeywords).map(([categorySlug, items]) => (
                  <div key={categorySlug}>
                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {items[0]?.categoryName || categorySlug}
                    </h4>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item.keyword}>
                          <button
                            onClick={() => handleKeywordClick(item.keyword, item.categorySlug)}
                            className="text-sm text-slate-600 hover:text-primary hover:translate-x-1 transition-all text-left w-full py-1.5 px-3 rounded-lg hover:bg-slate-50 flex items-center justify-between group"
                          >
                            <span>{item.keyword}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
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