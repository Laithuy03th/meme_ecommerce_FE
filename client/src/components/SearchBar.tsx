"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
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
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")}>
            <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Mock Suggestions */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <p className="text-xs font-semibold text-gray-400 px-3 py-2">SUGGESTIONS</p>
            {['Headphones', 'Smart Watch', 'T-Shirt'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  router.push(`/products?search=${encodeURIComponent(item)}`);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-3 h-3 text-gray-400" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;