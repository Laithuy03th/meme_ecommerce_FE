"use client";

import { useEffect, useState } from "react";
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { dashboardApi } from "@/services/dashboardApi";
import { handleApiError } from "@/lib/error-handler";
import type { DashboardStats } from "@/types/dashboard";

const Homepage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!stats) return <div>No data available</div>;

  const statCards = [
    {
      title: "Total Revenue",
      value: `${(stats.totalRevenue ?? 0).toLocaleString()}đ`,
      subValue: `Today: ${(stats.todayRevenue ?? 0).toLocaleString()}đ`,
      icon: DollarSign,
      bgColor: "bg-emerald-500",
    },
    {
      title: "Total Orders",
      value: (stats.totalOrders ?? 0).toString(),
      subValue: `Pending: ${stats.pendingOrders ?? 0}`,
      icon: ShoppingCart,
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Customers",
      value: (stats.totalCustomers ?? 0).toString(),
      subValue: `New this month: ${stats.newCustomersThisMonth ?? 0}`,
      icon: Users,
      bgColor: "bg-purple-500",
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts.toString(),
      subValue: `Total products: ${stats.totalProducts}`,
      icon: AlertTriangle,
      bgColor: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subValue}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shippingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.canceledOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topSellingProducts.map((product) => (
              <div key={product.productId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Sold: {product.totalSold} units
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.revenue.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Transactions" />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
