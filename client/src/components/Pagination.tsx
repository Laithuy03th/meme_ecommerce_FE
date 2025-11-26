"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string; // e.g., "/products"
}

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary text-gray-600 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" />
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, current, and neighbors
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <Link
                                key={page}
                                href={createPageUrl(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage === page
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </Link>
                        );
                    } else if (
                        (page === currentPage - 2 && page > 1) ||
                        (page === currentPage + 2 && page < totalPages)
                    ) {
                        return (
                            <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                ...
                            </span>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary text-gray-600 transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronRight className="w-5 h-5" />
                </span>
            )}
        </div>
    );
};

export default Pagination;
