import { toast } from "sonner";
import { ApiError } from "@/services/api";

export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
        // Suppress 401 errors as they are handled by api-client redirect
        if (error.status === 401) {
            return;
        }

        const message = error.message;

        if (message.includes('Invalid status transition')) {
            toast.error('Không thể chuyển trạng thái đơn hàng này');
        } else if (message.includes('Cannot delete yourself')) {
            toast.error('Không thể xóa chính mình');
        } else if (message.includes('last administrator')) {
            toast.error('Không thể xóa admin cuối cùng');
        } else if (message.includes('Cannot change your own status')) {
            toast.error('Không thể thay đổi trạng thái của chính mình');
        } else if (error.status === 403) {
            toast.error('Không có quyền Admin');
        } else if (error.status === 404) {
            toast.error('Không tìm thấy dữ liệu', { description: (error as any).path });
        } else {
            toast.error(message || 'Đã có lỗi xảy ra');
        }
    } else if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error('Đã có lỗi không xác định');
    }
}

// Helper for building query params
export function buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });
    return query.toString();
}
