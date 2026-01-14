import { BASE_URL } from "./base";
import { useAuthStore } from "@/stores/authStore";

export interface FileUploadResponse {
    fileName: string;
    fileUrl: string;
}

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = useAuthStore.getState().accessToken;

    const res = await fetch(`${BASE_URL}/files/upload/public`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Upload failed");
    }

    const data: FileUploadResponse = await res.json();
    return data.fileUrl;
};
