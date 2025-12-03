"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Heart, Menu } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname, useRouter } from "next/navigation";
import useWishlistStore from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { wishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled ? "glass shadow-lg py-2" : "bg-transparent py-4"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">M</span>
              </div>
            </div>
            <span className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-slate-900 bg-[length:200%_auto] group-hover:bg-[position:100%_0] transition-all duration-500">
              MEMESHOP
            </span>
          </Link>

          {/* CENTER: Navigation */}
          <div className={`hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden scale-90' : 'opacity-100 w-auto scale-100'}`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                    ? "text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 scale-105"
                    : "text-slate-600 hover:text-primary hover:bg-white/80"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Icons & Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:block transform hover:scale-105 transition-transform duration-300">
              <SearchBar onToggle={setIsSearchOpen} />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => router.push(isAuthenticated ? "/wishlist" : "/login?redirect=/wishlist")}
                className="relative p-2.5 rounded-full hover:bg-white/80 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 group border border-transparent hover:border-pink-100"
              >
                <Heart className="w-5 h-5 text-slate-600 group-hover:text-pink-500 group-hover:fill-pink-50 transition-colors" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <div className="hover:scale-105 transition-transform duration-300">
                <ShoppingCartIcon />
              </div>

              <div className="pl-2 border-l border-slate-200">
                <ProfileDropdown />
              </div>

              <button className="md:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform">
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
