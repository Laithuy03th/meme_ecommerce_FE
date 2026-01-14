
export const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PACKED: "PACKED",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELED: "CANCELED",
    RETURN_REQUESTED: "RETURN_REQUESTED",
    RETURNED: "RETURNED",
    REFUNDED: "REFUNDED",
};

export const getOrderStatusLabel = (status: string) => {
    switch (status) {
        case ORDER_STATUS.PENDING:
            return "Chờ xác nhận";
        case ORDER_STATUS.CONFIRMED:
            return "Đã xác nhận";
        case ORDER_STATUS.PACKED:
            return "Đang đóng gói";
        case ORDER_STATUS.SHIPPED:
            return "Đang giao hàng";
        case ORDER_STATUS.DELIVERED:
            return "Giao thành công";
        case ORDER_STATUS.CANCELED:
            return "Đã hủy";
        case ORDER_STATUS.RETURN_REQUESTED:
            return "Yêu cầu trả hàng";
        case ORDER_STATUS.RETURNED:
            return "Đã trả hàng";
        case ORDER_STATUS.REFUNDED:
            return "Đã hoàn tiền";
        default:
            return status;
    }
};

export const getOrderStatusColor = (status: string) => {
    switch (status) {
        case ORDER_STATUS.PENDING:
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case ORDER_STATUS.CONFIRMED:
            return "bg-blue-100 text-blue-700 border-blue-200";
        case ORDER_STATUS.PACKED:
            return "bg-purple-100 text-purple-700 border-purple-200";
        case ORDER_STATUS.SHIPPED:
            return "bg-cyan-100 text-cyan-700 border-cyan-200";
        case ORDER_STATUS.DELIVERED:
            return "bg-green-100 text-green-700 border-green-200";
        case ORDER_STATUS.CANCELED:
            return "bg-gray-100 text-gray-500 border-gray-200";
        case ORDER_STATUS.RETURN_REQUESTED:
            return "bg-orange-100 text-orange-700 border-orange-200";
        case ORDER_STATUS.RETURNED:
            return "bg-gray-800 text-white border-gray-700";
        case ORDER_STATUS.REFUNDED:
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

export const getStepIndex = (status: string) => {
    switch (status) {
        case ORDER_STATUS.PENDING:
            return 0;
        case ORDER_STATUS.CONFIRMED:
        case ORDER_STATUS.PACKED:
            return 1;
        case ORDER_STATUS.SHIPPED:
            return 2;
        case ORDER_STATUS.DELIVERED:
        case ORDER_STATUS.RETURN_REQUESTED:
        case ORDER_STATUS.RETURNED:
        case ORDER_STATUS.REFUNDED:
            return 3;
        default:
            return -1;
    }
};
