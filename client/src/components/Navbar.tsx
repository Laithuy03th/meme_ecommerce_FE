"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Heart, User } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname } from "next/navigation";
import useWishlistStore from "@/stores/wishlistStore";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { wishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" }, // We might need to create this page
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">T</span>
              </div>
            </div>
            <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              TrendLama
            </span>
          </Link>

          {/* CENTER: Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-slate-600"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: Icons & Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <SearchBar />

            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/wishlist" className="relative group">
                <Heart className="w-5 h-5 text-slate-600 group-hover:text-secondary transition-colors" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <ShoppingCartIcon />

              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
