"use client";

import { useState, useEffect } from "react";
import { reviewApi } from "@/services/reviewApi";
import { Review, ReviewResponse } from "@/types/review";
import { handleApiError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Star, MessageSquare, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<ReviewResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [replyingReview, setReplyingReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewingReview, setViewingReview] = useState<Review | null>(null);

    useEffect(() => {
        loadReviews();
    }, [page]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewApi.list(page, 20);
            console.log("Reviews data:", data);
            setReviews(data);
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyingReview || !replyText.trim()) return;

        try {
            setIsSubmitting(true);
            await reviewApi.reply(replyingReview.id, replyText);
            toast.success("Đã trả lời đánh giá thành công");
            setReplyingReview(null);
            setReplyText("");
            loadReviews(); 
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.")) return;
        try {
            await reviewApi.delete(id);
            toast.success("Đã xóa đánh giá");
            loadReviews();
        } catch (error) {
            handleApiError(error);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current" : "text-gray-300"}`} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reviews Management</h1>
                <p className="text-muted-foreground mt-1">
                    Manage customer reviews and replies
                </p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews?.content?.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="max-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            {review.productImage && (
                                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={review.productImage}
                                                        alt={review.productName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <Link href={`/products/${review.productId}`} className="font-medium hover:underline text-primary text-sm">
                                                    {review.productName}
                                                </Link>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{review.userFullName}</TableCell>
                                    <TableCell>{renderStars(review.rating)}</TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <p className="truncate text-sm">{review.comment}</p>
                                        {review.adminReply && (
                                            <p className="text-xs text-muted-foreground mt-1 truncate pl-2 border-l-2">
                                                Reply: {review.adminReply}
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        {review.adminReply ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Replied</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setViewingReview(review)}>
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </Button>
                                            {!review.adminReply && (
                                                <Button variant="ghost" size="icon" onClick={() => { setReplyingReview(review); setReplyText(""); }}>
                                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!reviews?.content || reviews.content.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {reviews && reviews.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Page {page + 1} of {reviews.totalPages} ({reviews.totalElements} total)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 0}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= reviews.totalPages - 1}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reply Dialog */}
            <Dialog open={!!replyingReview} onOpenChange={(open) => !open && setReplyingReview(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Review</DialogTitle>
                    </DialogHeader>
                    {replyingReview && (
                        <div className="space-y-4">
                            <div className="bg-muted p-3 rounded-md text-sm">
                                <p className="font-semibold mb-1">{replyingReview.userFullName} rated {replyingReview.rating} stars</p>
                                <p className="text-muted-foreground">"{replyingReview.comment}"</p>
                            </div>
                            <Textarea
                                placeholder="Write your reply here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyingReview(null)}>Cancel</Button>
                        <Button onClick={handleReply} disabled={isSubmitting || !replyText.trim()}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Send Reply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={!!viewingReview} onOpenChange={(open) => !open && setViewingReview(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Review Detail</DialogTitle>
                    </DialogHeader>
                    {viewingReview && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                {viewingReview.productImage && (
                                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border">
                                        <Image
                                            src={viewingReview.productImage}
                                            alt={viewingReview.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold">{viewingReview.productName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {renderStars(viewingReview.rating)}
                                        <span className="text-sm text-muted-foreground">
                                            by {viewingReview.userFullName}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-md bg-slate-50">
                                <p className="text-sm italic">"{viewingReview.comment}"</p>
                                {viewingReview.imageUrl && (
                                    <div className="mt-3 relative w-full h-48 rounded overflow-hidden">
                                        <img
                                            src={viewingReview.imageUrl}
                                            alt="Review attachment"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2 text-right">
                                    {format(new Date(viewingReview.createdAt), 'PPpp')}
                                </p>
                            </div>

                            {viewingReview.adminReply && (
                                <div className="p-4 border rounded-md bg-blue-50 border-blue-100">
                                    <p className="text-sm font-semibold text-blue-700 mb-1">Store Response:</p>
                                    <p className="text-sm text-blue-900">{viewingReview.adminReply}</p>
                                    <p className="text-xs text-blue-400 mt-2 text-right">
                                        Replied: {viewingReview.adminRepliedAt ? format(new Date(viewingReview.adminRepliedAt), 'PPpp') : 'N/A'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setViewingReview(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
