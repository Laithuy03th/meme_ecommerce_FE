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
  AlertTriangle
} from "lucide-react";

const Homepage = () => {
  // Mock statistics data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
      bgColor: "bg-emerald-500",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+12.5% from last month",
      icon: ShoppingCart,
      trend: "up",
      bgColor: "bg-blue-500",
    },
    {
      title: "New Customers",
      value: "89",
      change: "+8.2% from last month",
      icon: Users,
      trend: "up",
      bgColor: "bg-purple-500",
    },
    {
      title: "Low Stock Items",
      value: "12",
      change: "5 items critical",
      icon: AlertTriangle,
      trend: "warning",
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
              <p className={`text-xs ${stat.trend === "up" ? "text-emerald-600" :
                  stat.trend === "warning" ? "text-amber-600" : "text-muted-foreground"
                } mt-1 flex items-center gap-1`}>
                {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Popular Products" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
