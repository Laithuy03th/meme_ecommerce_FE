"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Save,
    Globe,
    Bell,
    Shield,
    CreditCard,
    Truck,
    Mail,
} from "lucide-react";

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your store configuration and preferences
                    </p>
                </div>
                <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                General Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Store Name</Label>
                                <Input defaultValue="MemeShop E-Commerce" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Currency</Label>
                                    <Select defaultValue="usd">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="vnd">VND (₫)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Timezone</Label>
                                    <Select defaultValue="utc7">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utc7">UTC +7 (Vietnam)</SelectItem>
                                            <SelectItem value="utc0">UTC +0 (GMT)</SelectItem>
                                            <SelectItem value="utc-5">UTC -5 (EST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Store Description</Label>
                                <Textarea
                                    rows={3}
                                    defaultValue="Your trusted online shopping destination"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    label: "New Order Notifications",
                                    description: "Receive alerts when new orders are placed",
                                },
                                {
                                    label: "Low Stock Alerts",
                                    description: "Get notified when products are low in stock",
                                },
                                {
                                    label: "Customer Reviews",
                                    description: "Notifications for new customer reviews",
                                },
                                {
                                    label: "Payment Updates",
                                    description: "Alerts for payment status changes",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold">{item.label}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Shipping Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Default Shipping Fee</Label>
                                    <Input type="number" defaultValue="10.00" />
                                </div>
                                <div>
                                    <Label>Free Shipping Threshold</Label>
                                    <Input type="number" defaultValue="100.00" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="international" defaultChecked />
                                <Label htmlFor="international">
                                    Enable international shipping
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Email Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Support Email</Label>
                                <Input type="email" defaultValue="support@memeshop.com" />
                            </div>
                            <div>
                                <Label>Order Email</Label>
                                <Input type="email" defaultValue="orders@memeshop.com" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="2fa">Two-factor authentication</Label>
                                <Switch id="2fa" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <Label htmlFor="session">Session timeout (30 min)</Label>
                                <Switch id="session" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <Label htmlFor="login-notif">Login notifications</Label>
                                <Switch id="login-notif" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Gateway Config */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Gateway
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {["Stripe Configuration", "VNPAY Configuration", "Momo Configuration"].map(
                                (gateway, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold">{gateway}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {index === 0
                                                    ? "Manage API keys"
                                                    : index === 1
                                                        ? "Manage credentials"
                                                        : "Manage API settings"}
                                            </p>
                                        </div>
                                    </Button>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
