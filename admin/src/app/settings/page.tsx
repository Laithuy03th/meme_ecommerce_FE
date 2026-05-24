"use client";

import { useState, useEffect } from "react";
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
    Loader2,
} from "lucide-react";

interface Settings {
    storeName: string;
    currency: string;
    timezone: string;
    description: string;
    notifications: {
        newOrder: boolean;
        lowStock: boolean;
        reviews: boolean;
        payments: boolean;
    };
    shipping: {
        fee: number;
        threshold: number;
        international: boolean;
    };
    email: {
        support: string;
        order: string;
    };
    security: {
        twoFactor: boolean;
        sessionTimeout: boolean;
        loginNotif: boolean;
    };
}

const DEFAULT_SETTINGS: Settings = {
    storeName: "MemeShop E-Commerce",
    currency: "vnd",
    timezone: "utc7",
    description: "Điểm đến mua sắm trực tuyến đáng tin cậy của bạn",
    notifications: {
        newOrder: true,
        lowStock: true,
        reviews: true,
        payments: true,
    },
    shipping: {
        fee: 30000,
        threshold: 500000,
        international: false,
    },
    email: {
        support: "support@memeshop.com",
        order: "orders@memeshop.com",
    },
    security: {
        twoFactor: true,
        sessionTimeout: true,
        loginNotif: false,
    },
};

const SettingsPage = () => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("app_settings");
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load settings", e);
            }
        }
        setInitialized(true);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.setItem("app_settings", JSON.stringify(settings));
        setSaving(false);
        alert("Đã lưu thay đổi thành công!");
    };

    if (!initialized) return null;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cài Đặt</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý cấu hình cửa hàng và các tùy chọn ưu tiên của bạn
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Lưu Thay Đổi
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                Cấu Hình Chung
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tên Cửa Hàng</Label>
                                <Input 
                                    value={settings.storeName} 
                                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                                    placeholder="Nhập tên cửa hàng của bạn"
                                />
                                <p className="text-xs text-muted-foreground">Tên này sẽ hiển thị trên hóa đơn và email gửi khách hàng.</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tiền Tệ</Label>
                                    <Select 
                                        value={settings.currency} 
                                        onValueChange={(v) => setSettings({...settings, currency: v})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vnd">VND (₫)</SelectItem>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Múi Giờ</Label>
                                    <Select 
                                        value={settings.timezone}
                                        onValueChange={(v) => setSettings({...settings, timezone: v})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utc7">UTC +7 (Việt Nam)</SelectItem>
                                            <SelectItem value="utc0">UTC +0 (GMT)</SelectItem>
                                            <SelectItem value="utc-5">UTC -5 (EST)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mô Tả Cửa Hàng</Label>
                                <Textarea
                                    rows={3}
                                    value={settings.description}
                                    onChange={(e) => setSettings({...settings, description: e.target.value})}
                                    placeholder="Mô tả ngắn gọn về cửa hàng..."
                                />
                                <p className="text-xs text-muted-foreground">Sử dụng cho SEO và hiển thị ở phần giới thiệu.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-amber-500" />
                                Cài Đặt Thông Báo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    id: "newOrder",
                                    label: "Thông báo đơn hàng mới",
                                    description: "Nhận cảnh báo ngay lập tức khi có khách đặt hàng mới.",
                                },
                                {
                                    id: "lowStock",
                                    label: "Cảnh báo hết hàng",
                                    description: "Thông báo khi số lượng sản phẩm trong kho xuống mức thấp.",
                                },
                                {
                                    id: "reviews",
                                    label: "Đánh giá của khách hàng",
                                    description: "Nhận thông báo khi có khách hàng để lại bình luận hoặc đánh giá.",
                                },
                                {
                                    id: "payments",
                                    label: "Cập nhật thanh toán",
                                    description: "Cảnh báo khi trạng thái thanh toán của đơn hàng thay đổi.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg border"
                                >
                                    <div className="pr-4">
                                        <p className="font-semibold">{item.label}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={(settings.notifications as any)[item.id]} 
                                        onCheckedChange={(checked) => setSettings({
                                            ...settings, 
                                            notifications: { ...settings.notifications, [item.id]: checked }
                                        })}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Shipping Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-emerald-600" />
                                Cấu Hình Giao Hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phí vận chuyển mặc định (₫)</Label>
                                    <Input 
                                        type="number" 
                                        value={settings.shipping.fee}
                                        onChange={(e) => setSettings({
                                            ...settings, 
                                            shipping: { ...settings.shipping, fee: parseFloat(e.target.value) || 0 }
                                        })}
                                    />
                                    <p className="text-xs text-muted-foreground">Áp dụng cho các đơn hàng thông thường.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ngưỡng miễn phí vận chuyển (₫)</Label>
                                    <Input 
                                        type="number" 
                                        value={settings.shipping.threshold}
                                        onChange={(e) => setSettings({
                                            ...settings, 
                                            shipping: { ...settings.shipping, threshold: parseFloat(e.target.value) || 0 }
                                        })}
                                    />
                                    <p className="text-xs text-muted-foreground">Miễn phí ship nếu đơn hàng đạt mức này.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Giao hàng quốc tế</Label>
                                    <p className="text-sm text-muted-foreground">Kích hoạt tính năng vận chuyển ra ngoài lãnh thổ Việt Nam.</p>
                                </div>
                                <Switch 
                                    checked={settings.shipping.international} 
                                    onCheckedChange={(c) => setSettings({
                                        ...settings,
                                        shipping: { ...settings.shipping, international: c }
                                    })}
                                />
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
                                <Mail className="h-5 w-5 text-indigo-600" />
                                Liên Hệ Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email Hỗ Trợ</Label>
                                <Input 
                                    type="email" 
                                    value={settings.email.support}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        email: { ...settings.email, support: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Nhận Đơn Hàng</Label>
                                <Input 
                                    type="email" 
                                    value={settings.email.order}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        email: { ...settings.email, order: e.target.value }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-rose-600" />
                                Bảo Mật
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Xác thực 2 lớp (2FA)</Label>
                                    <p className="text-xs text-muted-foreground">Tăng cường bảo mật tài khoản Admin.</p>
                                </div>
                                <Switch 
                                    checked={settings.security.twoFactor}
                                    onCheckedChange={(c) => setSettings({
                                        ...settings,
                                        security: { ...settings.security, twoFactor: c }
                                    })}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Tự động đăng xuất (30 phút)</Label>
                                    <p className="text-xs text-muted-foreground">Đăng xuất nếu không hoạt động.</p>
                                </div>
                                <Switch 
                                    checked={settings.security.sessionTimeout}
                                    onCheckedChange={(c) => setSettings({
                                        ...settings,
                                        security: { ...settings.security, sessionTimeout: c }
                                    })}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Thông báo đăng nhập</Label>
                                    <p className="text-xs text-muted-foreground">Gửi email khi có đăng nhập mới.</p>
                                </div>
                                <Switch 
                                    checked={settings.security.loginNotif}
                                    onCheckedChange={(c) => setSettings({
                                        ...settings,
                                        security: { ...settings.security, loginNotif: c }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Gateway Config */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-slate-700" />
                                Cổng Thanh Toán
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: "Cấu hình Stripe", desc: "Quản lý API keys thanh toán thẻ." },
                                { name: "Cấu hình VNPAY", desc: "Quản lý tài khoản kết nối VNPAY." },
                                { name: "Cấu hình Momo", desc: "Quản lý API settings ví Momo." }
                            ].map((gateway, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3 px-4"
                                >
                                    <div className="text-left">
                                        <p className="font-semibold">{gateway.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {gateway.desc}
                                        </p>
                                    </div>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
