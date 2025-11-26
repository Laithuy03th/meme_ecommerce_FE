"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/mockData";

const HomeCategories = () => {
    return (
        <section className="py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
                <Link href="/products" className="group flex items-center gap-1 text-primary font-medium hover:text-primary-dark transition-colors">
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                    >
                        <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className="text-white font-bold text-lg md:text-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                {cat.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomeCategories;
