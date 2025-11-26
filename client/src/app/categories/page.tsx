import { categories } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";

const CategoriesPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        href={`/products?category=${category.slug}`}
                        key={category.id}
                        className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100"
                    >
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-2xl font-bold text-white text-center px-4">
                                {category.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
