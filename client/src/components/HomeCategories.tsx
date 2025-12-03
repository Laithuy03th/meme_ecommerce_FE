"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { CategoryType } from "@/types";

interface HomeCategoriesProps {
    categories: CategoryType[];
}

const HomeCategories = ({ categories }: HomeCategoriesProps) => {
    const getCategoryImage = (cat: CategoryType) => {
        return cat.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500";
    };

    return (
        <section className="py-16 md:py-24">
            <div className="flex items-end justify-between mb-10 px-2">
                <div>
                    <div className="flex items-center gap-2 mb-2 animate-fade-in-up">
                        <span className="p-1.5 bg-primary/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </span>
                        <span className="text-sm font-bold text-primary tracking-wider uppercase">Collections</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                        Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Category</span>
                    </h2>
                </div>

                <Link href="/products" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all duration-300 group shadow-sm hover:shadow-md animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {categories.map((cat, index) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100 shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                        <Image
                            src={getCategoryImage(cat)}
                            alt={cat.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white font-bold text-xl md:text-2xl mb-2 drop-shadow-md">
                                    {cat.name}
                                </h3>
                                <div className="h-0.5 w-12 bg-white/50 group-hover:w-full group-hover:bg-primary transition-all duration-500 mb-3" />
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Explore Collection <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>

                        {/* Glass Border Effect */}
                        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none group-hover:border-white/30 transition-colors duration-500" />
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    View All Categories <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
};

export default HomeCategories;
