"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home, ShoppingCart } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useSearchParams } from "next/navigation";

const Navbar = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 py-3 px-4 bg-white">
      {/* LEFT */}
      <Link href="/" className="flex items-center">
        <Image
          src="/shoplogo.png"
          alt="TrendLama"
          width={36}
          height={36}
          className="w-8 h-8 md:w-9 md:h-9 rounded-lg"
        />
        <p className="ml-3 hidden md:block text-md font-semibold tracking-wider">
          LAITHUYSHOP.
        </p>
      </Link>

      {/* CENTER MENU */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/"
          className="px-4 py-2 rounded-full text-sm font-medium 
                    text-white bg-gradient-to-r from-blue-500 to-indigo-500
                    shadow-md hover:shadow-lg hover:scale-105
                    transition-all duration-300 ease-out 
                    hover:from-indigo-500 hover:to-blue-500 active:scale-95"
        >
          Home
        </Link>

        <Link
          href={category ? `/products/?category=${category}` : "/products"}
          className="px-4 py-2 rounded-full text-sm font-medium 
                    text-white bg-gradient-to-r from-pink-500 to-red-500
                    shadow-md hover:shadow-lg hover:scale-105
                    transition-all duration-300 ease-out 
                    hover:from-red-500 hover:to-pink-500 active:scale-95"
        >
          All Products
        </Link>

        <Link
          href="/contact"
          className="px-4 py-2 rounded-full text-sm font-medium 
                    text-white bg-gradient-to-r from-green-500 to-emerald-500
                    shadow-md hover:shadow-lg hover:scale-105
                    transition-all duration-300 ease-out 
                    hover:from-emerald-500 hover:to-green-500 active:scale-95"
        >
          Information
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors" />
        </Link>
        <Bell className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors" />
        <ShoppingCartIcon />
        <Link
          href="/login"
          className="px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700
                     hover:bg-gray-100 transition-all duration-200"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
