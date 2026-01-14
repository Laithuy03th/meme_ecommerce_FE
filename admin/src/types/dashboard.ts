export interface DashboardStats {
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    shippingOrders: number;
    completedOrders: number;
    canceledOrders: number;
    totalCustomers: number;
    newCustomersThisMonth: number;
    totalProducts: number;
    lowStockProducts: number;
    topSellingProducts: TopProduct[];
}

export interface TopProduct {
    productId: number;
    productName: string;
    totalSold: number;
    revenue: number;
}
