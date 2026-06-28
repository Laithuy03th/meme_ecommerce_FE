import { getCategories } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

const CategoriesPage = async () => {
    const categories = await getCategories();


    const getCategoryImage = (cat: any) => {
        return cat.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Promotional Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 mb-12 h-[300px] md:h-[400px]">
                <Image
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
                    alt="New Collection"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                    <span className="text-amber-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
                        New Season
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                            Unique Style
                        </span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-md">
                        Explore our latest collections carefully curated for the modern trendsetter.
                    </p>
                    <Link
                        href="/products"
                        className="w-fit bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                    >
                        Explore All Categories
                    </Link>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Link
                        href={`/products?category=${category.slug}`}
                        key={category.id}
                        className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <Image
                            src={getCategoryImage(category)}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {category.name}
                            </h3>
                            <span className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                Explore Collection &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
