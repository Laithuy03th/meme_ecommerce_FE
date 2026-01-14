import { authenticatedFetch } from "./api";
import type { DashboardStats } from "@/types/dashboard";

export const dashboardApi = {
    /**
     * GET /api/v1/admin/dashboard/stats
     * Lấy thống kê tổng quan cho admin dashboard
     */
    async getStats(): Promise<DashboardStats> {
        return authenticatedFetch<DashboardStats>('/admin/dashboard/stats');
    },
};
