const API_BASE_URL = 'http://localhost:5001';

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Generate a session ID for cart operations
const getSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
};

// Product API
export const productAPI = {
    // Get all products
    getProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        return handleResponse(response);
    },

    // Get single product by ID
    getProduct: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        return handleResponse(response);
    },

    // Get products by category
    getProductsByCategory: async (categorySlug) => {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categorySlug}/products`);
        return handleResponse(response);
    }
};

// Category API
export const categoryAPI = {
    // Get all categories
    getCategories: async () => {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        return handleResponse(response);
    }
};

// Cart API
export const cartAPI = {
    // Get cart contents
    getCart: async () => {
        const sessionId = getSessionId();
        const response = await fetch(`${API_BASE_URL}/api/cart/${sessionId}`);
        return handleResponse(response);
    },

    // Add item to cart
    addToCart: async (productId, size, quantity = 1) => {
        const sessionId = getSessionId();
        const response = await fetch(`${API_BASE_URL}/api/cart/${sessionId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, size, quantity }),
        });
        return handleResponse(response);
    },

    // Update cart item quantity
    updateCartItem: async (itemId, quantity) => {
        const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });
        return handleResponse(response);
    },

    // Remove cart item
    removeCartItem: async (itemId) => {
        const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Clear entire cart
    clearCart: async () => {
        const sessionId = getSessionId();
        const response = await fetch(`${API_BASE_URL}/api/cart/${sessionId}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    }
};

// The following types are now just comments for reference:
// 
// Product: {
//   id, name, description, price, originalPrice, discount, rating, reviews,
//   category, categorySlug, images, sizes, inStock, stockLeft, isFeatured,
//   care?, returnPolicy?
// }
//
// Category: { id, name, slug, description, image, productCount }
//
// CartItem: { id, productId, name, size?, quantity, price, image }
//
// CartResponse: { cartId, items, subtotal }
