export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;

    // Optional fields (might not be in the simple stats API)
    todayRevenue?: number;
    monthRevenue?: number;
    pendingOrders?: number;
    shippingOrders?: number;
    completedOrders?: number;
    canceledOrders?: number;
    totalCustomers?: number; // Deprecated or alias for totalUsers
    newCustomersThisMonth?: number;
    lowStockProducts?: number;
    topSellingProducts?: TopProduct[];
}

export interface TopProduct {
    productId: number;
    productName: string;
    totalSold: number;
    revenue: number;
}
