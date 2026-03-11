import { apiRequest } from "../lib/apiClient";

export const getCartItems = async () => {
    const response = await apiRequest("/market/cart");
    return Array.isArray(response?.data) ? response.data : [];
};

export const getCartCount = async () => {
    const cart = await getCartItems();
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

export const addProductToCart = async (product, quantity = 1) => {
    const response = await apiRequest("/market/cart", {
        method: "POST",
        body: JSON.stringify({
            productId: product.id,
            quantity,
        }),
    });

    return response?.data;
};

export const removeCartItem = async (cartItemId) => {
    await apiRequest(`/market/cart/${cartItemId}`, {
        method: "DELETE",
    });
};

export const checkoutCart = async (pin) => {
    const response = await apiRequest("/market/checkout", {
        method: "POST",
        body: JSON.stringify({ pin }),
    });

    return response?.data;
};

export const getOrders = async () => {
    const response = await apiRequest("/orders/me");
    return Array.isArray(response?.data) ? response.data : [];
};
