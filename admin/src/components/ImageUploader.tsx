import { useState, useEffect } from "react";
import { fileApi } from "@/services/fileApi";
import { handleApiError } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    value?: string;
    onChange?: (url: string) => void;
    onRemove?: () => void;
    className?: string;
    label?: string;
}

export default function ImageUploader({ value, onChange, onRemove, className, label }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value || "");
    const [urlInput, setUrlInput] = useState<string>(value || "");
    const [mode, setMode] = useState<"upload" | "url">("upload");

    useEffect(() => {
        setPreview(value || "");
        setUrlInput(value || "");
    }, [value]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 5MB");
            return;
        }

        try {
            setUploading(true);
            const { fileUrl } = await fileApi.uploadImage(file);
            setPreview(fileUrl);
            setUrlInput(fileUrl);
            onChange?.(fileUrl);
        } catch (error) {
            handleApiError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setUrlInput(url);
        setPreview(url);
        onChange?.(url);
    };

    const handleRemove = () => {
        setPreview("");
        setUrlInput("");
        onRemove?.();
    };

    return (
        <div className={className}>
            {label && <label className="text-sm font-medium mb-2 block">{label}</label>}
            
            {preview ? (
                <div className="relative w-full group">
                    <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted/50">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{preview}</p>
                </div>
            ) : (
                <div className="w-full space-y-4">
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
                        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 mb-4 text-primary animate-spin" />
                                        <p className="text-sm text-muted-foreground text-center">Uploading...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground text-center">
                                            <span className="font-semibold text-primary">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center">PNG, JPG, JPEG (MAX. 5MB)</p>
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
                    ) : (
                        <div className="space-y-2">
                            <Input
                                placeholder="Paste image URL here..."
                                value={urlInput}
                                onChange={handleUrlChange}
                            />
                            <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                                <ImageIcon className="w-8 h-8 text-muted-foreground opacity-20" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

