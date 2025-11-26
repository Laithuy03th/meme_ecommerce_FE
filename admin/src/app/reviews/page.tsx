"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Star,
    CheckCircle,
    MessageSquare,
    Trash2,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock reviews data
const reviews = [
    {
        id: 1,
        productName: "Wireless Headphones",
        productId: 1,
        customerName: "John Doe",
        rating: 5,
        comment:
            "Amazing product! The sound quality is exceptional and the noise cancellation works perfectly. Highly recommend!",
        status: "APPROVED",
        date: "2024-01-15",
        verified: true,
    },
    {
        id: 2,
        productName: "Smart Watch",
        productId: 2,
        customerName: "Jane Smith",
        rating: 4,
        comment:
            "Good watch with many features. Battery life could be better but overall satisfied with the purchase.",
        status: "PENDING",
        date: "2024-01-14",
        verified: false,
    },
    {
        id: 3,
        productName: "Cotton T-Shirt",
        productId: 3,
        customerName: "Mike Johnson",
        rating: 2,
        comment:
            "The quality is not as expected. The fabric feels cheap and started fading after first wash.",
        status: "PENDING",
        date: "2024-01-13",
        verified: true,
    },
];

const ReviewsPage = () => {
    const [filter, setFilter] = useState("all");

    const getStatusColor = (status: string) => {
        return status === "APPROVED"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700";
    };

    const filteredReviews =
        filter === "all"
            ? reviews
            : reviews.filter((r) => r.status.toLowerCase() === filter.toLowerCase());

    const stats = [
        { label: "Total Reviews", value: "2,543", color: "bg-blue-500" },
        { label: "Pending", value: "89", color: "bg-amber-500" },
        { label: "Approved", value: "2,234", color: "bg-emerald-500" },
        { label: "Avg Rating", value: "4.5", color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Reviews & Ratings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Moderate customer reviews and feedback
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <div className={`${stat.color} p-2 rounded-lg`}>
                                <Star className="h-4 w-4 text-white fill-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        {["all", "pending", "approved"].map((filterOption) => (
                            <Button
                                key={filterOption}
                                variant={filter === filterOption ? "default" : "outline"}
                                onClick={() => setFilter(filterOption)}
                                className="capitalize"
                            >
                                {filterOption}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="p-6">
                            <div className="flex gap-6">
                                {/* Product Info */}
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center">
                                        <Image
                                            src="/products/placeholder.png"
                                            alt={review.productName}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-xl"
                                        />
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {review.productName}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {review.customerName}
                                                </p>
                                                {review.verified && (
                                                    <Badge className="bg-emerald-50 text-emerald-600">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verified Purchase
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {review.date}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(review.status)}>
                                            {review.status}
                                        </Badge>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-semibold">
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    <p className="text-muted-foreground mb-3">{review.comment}</p>

                                    <Separator className="my-3" />

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        {review.status === "PENDING" && (
                                            <Button size="sm" className="gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </Button>
                                        )}
                                        {review.status === "APPROVED" && (
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Hide
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Reply
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="gap-2 ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReviewsPage;
