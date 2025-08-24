const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'niya_celebration',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let dbPool;

// Initialize database connection
async function connectDB() {
    try {
        dbPool = mysql.createPool(dbConfig);

        // Test the connection
        const connection = await dbPool.getConnection();
        connection.release();
        return dbPool;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

// Helper function to execute queries
async function executeQuery(query, params = []) {
    try {
        const [results] = await dbPool.execute(query, params);
        return results;
    } catch (error) {
        throw error;
    }
}

// Basic Routes
app.get('/', (req, res) => {
    res.json({ message: 'Niya Celebration API Server Running!' });
});

// Products Routes
app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                c.slug as category_slug,
                GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.sort_order) as images,
                GROUP_CONCAT(DISTINCT ps.size) as sizes
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_sizes ps ON p.id = ps.product_id AND ps.is_available = true
            GROUP BY p.id
            ORDER BY p.is_featured DESC, p.created_at DESC
        `;

        const products = await executeQuery(query);

        // Transform the data to match frontend expectations
        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: parseFloat(product.original_price),
            discount: product.discount_percentage,
            rating: parseFloat(product.rating),
            reviews: product.reviews_count,
            category: product.category_name,
            categorySlug: product.category_slug,
            images: product.images ? product.images.split(',') : [],
            sizes: product.sizes ? product.sizes.split(',') : [],
            inStock: product.stock_quantity > 0,
            stockLeft: product.stock_quantity,
            isFeatured: product.is_featured
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                c.slug as category_slug,
                GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.sort_order) as images,
                GROUP_CONCAT(DISTINCT ps.size) as sizes
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_sizes ps ON p.id = ps.product_id AND ps.is_available = true
            WHERE p.id = ?
            GROUP BY p.id
        `;

        const [product] = await executeQuery(query, [productId]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Format the product data
        const formattedProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: parseFloat(product.original_price),
            discount: product.discount_percentage,
            rating: parseFloat(product.rating),
            reviews: product.reviews_count,
            category: product.category_name,
            categorySlug: product.category_slug,
            images: product.images ? product.images.split(',') : [],
            sizes: product.sizes ? product.sizes.split(',') : [],
            inStock: product.stock_quantity > 0,
            stockLeft: product.stock_quantity,
            isFeatured: product.is_featured
        };

        res.json(formattedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
    try {
        const query = `
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id
            ORDER BY c.name
        `;

        const categories = await executeQuery(query);

        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            productCount: category.product_count
        }));

        res.json(formattedCategories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get products by category
app.get('/api/categories/:slug/products', async (req, res) => {
    try {
        const categorySlug = req.params.slug;
        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                c.slug as category_slug,
                GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.sort_order) as images,
                GROUP_CONCAT(DISTINCT ps.size) as sizes
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN product_sizes ps ON p.id = ps.product_id AND ps.is_available = true
            WHERE c.slug = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;

        const products = await executeQuery(query, [categorySlug]);

        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: parseFloat(product.original_price),
            discount: product.discount_percentage,
            rating: parseFloat(product.rating),
            reviews: product.reviews_count,
            category: product.category_name,
            categorySlug: product.category_slug,
            images: product.images ? product.images.split(',') : [],
            sizes: product.sizes ? product.sizes.split(',') : [],
            inStock: product.stock_quantity > 0,
            stockLeft: product.stock_quantity,
            isFeatured: product.is_featured
        }));

        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category products' });
    }
});

// Cart Routes
// Get or create cart for session
app.get('/api/cart/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Get or create cart
        let [cart] = await executeQuery(
            'SELECT id FROM cart WHERE session_id = ?',
            [sessionId]
        );

        if (!cart) {
            const result = await executeQuery(
                'INSERT INTO cart (session_id) VALUES (?)',
                [sessionId]
            );
            cart = { id: result.insertId };
        }

        // Get cart items with product details
        const cartItems = await executeQuery(`
            SELECT 
                ci.*,
                p.name as product_name,
                pi.image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
            WHERE ci.cart_id = ?
            ORDER BY ci.created_at DESC
        `, [cart.id]);

        const formattedItems = cartItems.map(item => ({
            id: item.id,
            productId: item.product_id,
            name: item.product_name,
            size: item.size,
            quantity: item.quantity,
            price: parseFloat(item.price),
            image: item.image_url || '/images/products/placeholder.png'
        }));

        const subtotal = formattedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        res.json({
            cartId: cart.id,
            items: formattedItems,
            subtotal: subtotal
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add item to cart
app.post('/api/cart/:sessionId/items', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { productId, size, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Get product details and price
        const [product] = await executeQuery(
            'SELECT id, name, price FROM products WHERE id = ?',
            [productId]
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get or create cart
        let [cart] = await executeQuery(
            'SELECT id FROM cart WHERE session_id = ?',
            [sessionId]
        );

        if (!cart) {
            const result = await executeQuery(
                'INSERT INTO cart (session_id) VALUES (?)',
                [sessionId]
            );
            cart = { id: result.insertId };
        }

        // Check if item already exists in cart
        const [existingItem] = await executeQuery(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND size = ?',
            [cart.id, productId, size || null]
        );

        if (existingItem) {
            // Update existing item quantity
            await executeQuery(
                'UPDATE cart_items SET quantity = quantity + ?, updated_at = NOW() WHERE id = ?',
                [quantity, existingItem.id]
            );
        } else {
            // Add new item to cart
            await executeQuery(
                'INSERT INTO cart_items (cart_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [cart.id, productId, size || null, quantity, product.price]
            );
        }

        res.json({ success: true, message: 'Item added to cart' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

// Update cart item quantity
app.put('/api/cart/items/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        await executeQuery(
            'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
            [quantity, itemId]
        );

        res.json({ success: true, message: 'Cart item updated' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart item' });
    }
});

// Remove cart item
app.delete('/api/cart/items/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;

        await executeQuery('DELETE FROM cart_items WHERE id = ?', [itemId]);

        res.json({ success: true, message: 'Item removed from cart' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
});

// Clear cart
app.delete('/api/cart/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const [cart] = await executeQuery(
            'SELECT id FROM cart WHERE session_id = ?',
            [sessionId]
        );

        if (cart) {
            await executeQuery('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
            await executeQuery('DELETE FROM cart WHERE id = ?', [cart.id]);
        }

        res.json({ success: true, message: 'Cart cleared' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

// Start server
connectDB();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
