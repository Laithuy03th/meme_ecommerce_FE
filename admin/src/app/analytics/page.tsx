import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import AppLineChart from "@/components/AppLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingCart } from "lucide-react";

const AnalyticsPage = () => {
    const stats = [
        {
            title: "Total Revenue",
            value: "$125,438",
            change: "+25.4%",
            icon: TrendingUp,
            bgColor: "bg-emerald-500",
        },
        {
            title: "Total Visitors",
            value: "45,231",
            change: "+18.2%",
            icon: Users,
            bgColor: "bg-blue-500",
        },
        {
            title: "Conversion Rate",
            value: "3.24%",
            change: "+2.1%",
            icon: BarChart3,
            bgColor: "bg-purple-500",
        },
        {
            title: "Avg Order Value",
            value: "$86.50",
            change: "+5.3%",
            icon: ShoppingCart,
            bgColor: "bg-amber-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Detailed insights into your store performance
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
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
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AppBarChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AppPieChart />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Traffic & Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AppAreaChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AppLineChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Wireless Headphones", sales: 234, revenue: "$12,450" },
                                { name: "Smart Watch", sales: 189, revenue: "$9,876" },
                                { name: "Cotton T-Shirt", sales: 456, revenue: "$6,543" },
                            ].map((product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-primary font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.sales} sold
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-primary">{product.revenue}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
