const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const fileApi = {
    /**
     * POST /api/v1/files/upload
     * Upload image file
     * 
     * @returns { fileUrl: string } - Uploaded file URL
     */
    async uploadImage(file: File): Promise<{ fileUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('accessToken');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData, // Don't set Content-Type, browser will set multipart/form-data
            headers: headers, // Add headers
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },
};
