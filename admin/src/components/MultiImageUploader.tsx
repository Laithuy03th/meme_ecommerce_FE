import { useState, useEffect } from "react";
import { fileApi } from "@/services/fileApi";
import { handleApiError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Link as LinkIcon, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MultiImageUploaderProps {
    value?: string; // Comma separated URLs
    onChange?: (value: string) => void;
    className?: string;
    label?: string;
}

export default function MultiImageUploader({ value, onChange, className, label }: MultiImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [urlInput, setUrlInput] = useState("");
    const [mode, setMode] = useState<"upload" | "url">("upload");

    useEffect(() => {
        if (value) {
            const urls = value.split(",").map(u => u.trim()).filter(u => u);
            setImages(urls);
        } else {
            setImages([]);
        }
    }, [value]);

    const updateImages = (newImages: string[]) => {
        setImages(newImages);
        onChange?.(newImages.join(", "));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const uploadedUrls: string[] = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith("image/")) continue;
                
                const { fileUrl } = await fileApi.uploadImage(file);
                uploadedUrls.push(fileUrl);
            }

            updateImages([...images, ...uploadedUrls]);
        } catch (error) {
            handleApiError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;
        updateImages([...images, urlInput.trim()]);
        setUrlInput("");
    };

    const handleRemove = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        updateImages(newImages);
    };

    return (
        <div className={className}>
            {label && <label className="text-sm font-medium mb-2 block">{label}</label>}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted/50">
                        <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex p-1 bg-muted rounded-md w-full">
                    <button
                        type="button"
                        onClick={() => setMode("upload")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                            mode === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("url")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                            mode === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LinkIcon className="w-4 h-4" />
                        URL
                    </button>
                </div>
                
                {mode === "upload" ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 mb-2 text-primary animate-spin" />
                                    <p className="text-xs text-muted-foreground">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold text-primary">Click to upload</span>
                                    </p>
                                </>
                            )}
                        </div>
                        <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                ) : (
                    <div className="flex gap-2">
                        <Input
                            placeholder="Paste image URL here..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddUrl();
                                }
                            }}
                        />
                        <Button type="button" onClick={handleAddUrl} size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

