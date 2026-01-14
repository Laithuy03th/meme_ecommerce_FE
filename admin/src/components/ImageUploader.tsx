"use client";

import { useState } from "react";
import { fileApi } from "@/services/fileApi";
import { handleApiError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
    value?: string;
    onChange?: (url: string) => void;
    onRemove?: () => void;
    className?: string;
}

export default function ImageUploader({ value, onChange, onRemove, className }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 5MB");
            return;
        }

        try {
            setUploading(true);
            const { url } = await fileApi.uploadImage(file);
            setPreview(url);
            onChange?.(url);
            alert("Upload thành công!");
        } catch (error) {
            handleApiError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onRemove?.();
    };

    return (
        <div className={className}>
            {preview ? (
                <div className="relative w-full max-w-md">
                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <>
                                    <Loader2 className="w-12 h-12 mb-4 text-gray-400 animate-spin" />
                                    <p className="text-sm text-gray-500">Đang upload...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 mb-4 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                                </>
                            )}
                        </div>
                        <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
