export interface AppSettings {
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

export const DEFAULT_SETTINGS: AppSettings = {
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

export const getSettings = (): AppSettings => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const saved = localStorage.getItem("app_settings");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    }
    return DEFAULT_SETTINGS;
};
