-- Drop database if it exists
DROP DATABASE IF EXISTS niya_celebration;

-- Create database
CREATE DATABASE IF NOT EXISTS niya_celebration;
USE niya_celebration;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount_percentage INT DEFAULT 0,
  category_id INT,
  stock_quantity INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  reviews_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  size VARCHAR(10) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  size VARCHAR(10),
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(10),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT IGNORE INTO categories (name, slug, description, image) VALUES
('Pashmina Shawls', 'pashmina-shawls', 'Luxurious handwoven pashmina shawls', '/images/categories/category-pashmina-shawls.png'),
('Pashmina Stoles', 'pashmina-stoles', 'Elegant pashmina stoles for any occasion', '/images/categories/category-pashmina-stoles.png'),
('Capes', 'capes', 'Stylish capes and wraps', '/images/categories/category-capes.png');

-- Insert sample products
INSERT IGNORE INTO products (name, description, price, original_price, discount_percentage, category_id, stock_quantity, rating, reviews_count, is_featured) VALUES
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Gift Hampers', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 2599.00, 8999.00, 50, 1, 3, 3.8, 42, TRUE),
('Gift Hampers', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 2599.00, 8999.00, 50, 1, 3, 3.8, 42, TRUE),
('Gift Hampers', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 2599.00, 8999.00, 50, 1, 3, 3.8, 42, TRUE),
('Gift Hampers', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 2599.00, 8999.00, 50, 1, 3, 3.8, 42, TRUE),
('Gift Hampers', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.', 2599.00, 8999.00, 50, 1, 3, 3.8, 42, TRUE),
('Multicolor Shawl with embroidery', 'Beautiful embroidered shawl with intricate patterns', 4999.00, 8999.00, 50, 1, 10, 4.2, 28, TRUE),
('Elegant Pashmina Stole', 'Soft and warm pashmina stole perfect for winter', 3999.00, 6999.00, 43, 2, 15, 4.5, 35, TRUE),
('Classic Cape with Tassels', 'Stylish cape with decorative tassels', 5999.00, 9999.00, 40, 3, 8, 4.1, 22, TRUE),
('Luxurious Cashmere Pashmina Shawl', 'Premium quality cashmere pashmina with exceptional softness and warmth', 5999.00, 10999.00, 45, 1, 12, 4.6, 38, TRUE),
('Heritage Handwoven Wool Shawl', 'Traditional handwoven shawl made from finest wool fibers', 4599.00, 7999.00, 42, 1, 8, 4.3, 45, FALSE),
('Artisan Crafted Multicolor Wrap', 'Beautifully crafted wrap with vibrant multicolor patterns', 4799.00, 8599.00, 44, 1, 15, 4.4, 32, FALSE),
('Premium Silk Blend Pashmina', 'Elegant silk blend pashmina perfect for special occasions', 5499.00, 9299.00, 41, 1, 6, 4.2, 29, TRUE),
('Designer Embroidered Shawl', 'Exclusive designer shawl with intricate embroidery work', 5799.00, 9999.00, 42, 1, 9, 4.5, 41, FALSE),
('Vintage Style Paisley Shawl', 'Classic paisley pattern shawl with vintage appeal', 4399.00, 7799.00, 44, 1, 11, 4.1, 36, FALSE),
('Bohemian Fringed Pashmina', 'Bohemian style pashmina with decorative fringe details', 4299.00, 7599.00, 43, 1, 14, 3.9, 25, FALSE),
('Royal Blue Kashmiri Shawl', 'Authentic Kashmiri shawl in royal blue with gold accents', 6299.00, 11999.00, 48, 1, 5, 4.7, 52, TRUE),
('Floral Embossed Wool Wrap', 'Beautiful wool wrap with floral embossed patterns', 4699.00, 8299.00, 43, 1, 13, 4.2, 31, FALSE),
('Traditional Tibetan Shawl', 'Authentic Tibetan style shawl with cultural motifs', 5199.00, 8999.00, 42, 1, 7, 4.4, 39, FALSE),
('Butterfly Pattern Pashmina', 'Delicate butterfly pattern pashmina in soft colors', 4899.00, 8599.00, 43, 1, 10, 4.3, 28, FALSE),
('Geometric Print Wool Shawl', 'Modern geometric print shawl in contemporary colors', 4599.00, 7999.00, 42, 1, 16, 4.0, 33, FALSE),
('Ombre Dyed Cashmere Wrap', 'Beautifully ombre dyed cashmere wrap in gradient colors', 5699.00, 9899.00, 42, 1, 8, 4.5, 44, FALSE),
('Celtic Knot Design Shawl', 'Intricate Celtic knot design shawl with cultural significance', 5299.00, 9199.00, 42, 1, 9, 4.3, 37, FALSE),
('Mandala Print Pashmina', 'Spiritual mandala print pashmina for meditation and style', 4799.00, 8399.00, 43, 1, 12, 4.1, 26, FALSE),
('Abstract Art Wool Shawl', 'Unique abstract art design wool shawl for art lovers', 4999.00, 8799.00, 43, 1, 11, 4.2, 35, FALSE),
('Striped Pattern Cashmere', 'Classic striped pattern cashmere shawl in neutral tones', 5399.00, 9299.00, 42, 1, 7, 4.4, 40, FALSE),
('Rose Garden Print Wrap', 'Romantic rose garden print wrap for elegant occasions', 4699.00, 8199.00, 43, 1, 14, 4.0, 29, FALSE),
('Feather Light Pashmina', 'Ultra-lightweight pashmina that feels like a feather', 4899.00, 8599.00, 43, 1, 13, 4.3, 32, FALSE),
('Winter Snowflake Shawl', 'Cozy winter shawl with delicate snowflake patterns', 5099.00, 8899.00, 43, 1, 10, 4.2, 34, FALSE),
('Silk Touch Pashmina Stole', 'Luxurious silk touch pashmina stole with smooth texture', 3799.00, 6599.00, 42, 2, 18, 4.4, 41, FALSE),
('Evening Glamour Stole', 'Glamorous evening stole perfect for formal events', 4199.00, 7299.00, 42, 2, 12, 4.3, 35, TRUE),
('Minimalist Design Stole', 'Clean minimalist design stole in solid colors', 3499.00, 5999.00, 42, 2, 20, 4.1, 28, FALSE),
('Beaded Border Pashmina', 'Elegant pashmina stole with beautiful beaded borders', 4499.00, 7799.00, 42, 2, 9, 4.5, 46, FALSE),
('Gradient Color Stole', 'Beautiful gradient color stole with smooth transitions', 3899.00, 6799.00, 43, 2, 15, 4.2, 32, FALSE),
('Lace Edge Pashmina', 'Delicate lace edge pashmina stole for feminine appeal', 4299.00, 7499.00, 43, 2, 11, 4.4, 38, FALSE),
('Tribal Print Stole', 'Bold tribal print stole with ethnic patterns', 3699.00, 6399.00, 42, 2, 17, 4.0, 24, FALSE),
('Metallic Thread Pashmina', 'Luxurious pashmina with metallic thread accents', 4699.00, 8199.00, 43, 2, 8, 4.6, 42, FALSE),
('Reversible Two-Tone Stole', 'Versatile reversible stole with two different colors', 4099.00, 7199.00, 43, 2, 13, 4.2, 31, FALSE),
('Angora Blend Soft Stole', 'Ultra-soft angora blend stole for maximum comfort', 4799.00, 8399.00, 43, 2, 10, 4.5, 39, FALSE),
('Printed Floral Stole', 'Charming printed floral stole for spring and summer', 3599.00, 6299.00, 43, 2, 19, 3.9, 27, FALSE),
('Shimmery Evening Wrap', 'Shimmery evening wrap perfect for special occasions', 4399.00, 7699.00, 43, 2, 12, 4.3, 36, FALSE),
('Cashmere Feel Stole', 'Affordable stole with luxurious cashmere-like feel', 3799.00, 6599.00, 42, 2, 16, 4.1, 33, FALSE),
('Plaid Pattern Stole', 'Classic plaid pattern stole in traditional colors', 3999.00, 6999.00, 43, 2, 14, 4.2, 30, FALSE),
('Hooded Winter Cape', 'Warm winter cape with detachable hood for extra protection', 6499.00, 11499.00, 43, 3, 6, 4.4, 33, FALSE),
('Victorian Style Cape', 'Elegant Victorian style cape with vintage charm', 6999.00, 12299.00, 43, 3, 4, 4.6, 28, TRUE),
('Modern Poncho Cape', 'Contemporary poncho-style cape for casual wear', 5799.00, 9999.00, 42, 3, 10, 4.2, 25, FALSE),
('Faux Fur Trimmed Cape', 'Luxurious cape with faux fur trim for glamorous look', 7499.00, 12999.00, 42, 3, 3, 4.7, 31, FALSE),
('Waterproof Rain Cape', 'Practical waterproof cape perfect for rainy seasons', 4999.00, 8799.00, 43, 3, 12, 4.0, 22, FALSE),
('Bohemian Fringe Cape', 'Bohemian style cape with long fringe details', 6199.00, 10699.00, 42, 3, 7, 4.3, 26, FALSE),
('Medieval Inspired Cloak', 'Medieval inspired cloak for costume and fashion', 6799.00, 11899.00, 43, 3, 5, 4.1, 19, FALSE),
('Lightweight Summer Cape', 'Airy lightweight cape perfect for summer evenings', 5299.00, 9199.00, 42, 3, 9, 3.9, 24, FALSE),
('Wool Blend Travel Cape', 'Practical wool blend cape ideal for travel', 6099.00, 10599.00, 42, 3, 8, 4.2, 29, FALSE),
('Designer Button Cape', 'Stylish designer cape with decorative button closure', 6899.00, 11999.00, 42, 3, 6, 4.5, 35, FALSE),
('Reversible Pattern Cape', 'Versatile reversible cape with different patterns on each side', 6299.00, 10899.00, 42, 3, 7, 4.3, 27, FALSE),
('Oversized Blanket Cape', 'Cozy oversized cape that doubles as a blanket', 5699.00, 9899.00, 42, 3, 11, 4.1, 23, FALSE);

-- Insert product images
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, '/images/products/product-1.png', TRUE, 1),
(2, '/images/products/product-2.png', FALSE, 2),
(3, '/images/products/product-3.png', FALSE, 3),
(4, '/images/products/product-4.png', FALSE, 4),
(5, '/images/products/product-1.png', TRUE, 1),
(6, '/images/products/product-2.png', FALSE, 2),
(7, '/images/products/product-3.png', FALSE, 3),
(8, '/images/products/product-4.png', FALSE, 4),
(9, '/images/products/product-1.png', TRUE, 1),
(10, '/images/products/product-2.png', FALSE, 2),
(11, '/images/products/product-3.png', FALSE, 3),
(12, '/images/products/product-4.png', FALSE, 4),
(13, '/images/products/product-1.png', TRUE, 1),
(14, '/images/products/product-2.png', FALSE, 2),
(15, '/images/products/product-3.png', FALSE, 3),
(16, '/images/products/product-4.png', FALSE, 4),
(17, '/images/products/product-3.png', FALSE, 3),
(18, '/images/products/product-5.png', FALSE, 4),
(19, '/images/products/product-6.png', FALSE, 4),
(20, '/images/products/product-7.png', FALSE, 4),
(21, '/images/products/product-8.png', TRUE, 1),
(22, '/images/products/product-5.png', FALSE, 2),
(23, '/images/products/product-4.png', FALSE, 3),
(24, '/images/products/product-3.png', TRUE, 1),
(25, '/images/products/product-4.png', FALSE, 2),
(26, '/images/products/product-4.png', TRUE, 1),
(27, '/images/products/product-1.png', FALSE, 2),
(28, '/images/products/product-5.png', TRUE, 1),
(29, '/images/products/product-6.png', FALSE, 2),
(30, '/images/products/product-6.png', TRUE, 1),
(30, '/images/products/product-1.png', FALSE, 2),
(31, '/images/products/product-1.png', TRUE, 1),
(31, '/images/products/product-2.png', FALSE, 2),
(32, '/images/products/product-2.png', TRUE, 1),
(32, '/images/products/product-3.png', FALSE, 2),
(33, '/images/products/product-3.png', TRUE, 1),
(33, '/images/products/product-4.png', FALSE, 2),
(34, '/images/products/product-4.png', TRUE, 1),
(34, '/images/products/product-5.png', FALSE, 2),
(35, '/images/products/product-5.png', TRUE, 1),
(35, '/images/products/product-6.png', FALSE, 2),
(36, '/images/products/product-6.png', TRUE, 1),
(36, '/images/products/product-1.png', FALSE, 2),
(37, '/images/products/product-1.png', TRUE, 1),
(37, '/images/products/product-2.png', FALSE, 2),
(38, '/images/products/product-2.png', TRUE, 1),
(38, '/images/products/product-3.png', FALSE, 2),
(39, '/images/products/product-3.png', TRUE, 1),
(39, '/images/products/product-4.png', FALSE, 2),
(40, '/images/products/product-4.png', TRUE, 1),
(40, '/images/products/product-5.png', FALSE, 2),
(41, '/images/products/product-5.png', TRUE, 1),
(41, '/images/products/product-6.png', FALSE, 2),
(42, '/images/products/product-6.png', TRUE, 1),
(42, '/images/products/product-1.png', FALSE, 2),
(43, '/images/products/product-1.png', TRUE, 1),
(43, '/images/products/product-2.png', FALSE, 2),
(44, '/images/products/product-2.png', TRUE, 1),
(44, '/images/products/product-3.png', FALSE, 2),
(45, '/images/products/product-3.png', TRUE, 1),
(45, '/images/products/product-4.png', FALSE, 2),
(46, '/images/products/product-4.png', TRUE, 1),
(46, '/images/products/product-5.png', FALSE, 2),
(47, '/images/products/product-5.png', TRUE, 1),
(47, '/images/products/product-6.png', FALSE, 2),
(48, '/images/products/product-6.png', TRUE, 1),
(48, '/images/products/product-1.png', FALSE, 2),
(49, '/images/products/product-1.png', TRUE, 1),
(49, '/images/products/product-2.png', FALSE, 2),
(50, '/images/products/product-2.png', TRUE, 1),
(50, '/images/products/product-3.png', FALSE, 2);

-- Insert product sizes
INSERT INTO product_sizes (product_id, size) VALUES
-- Original products (1-4)
(1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'), (1, '2XL'),
(2, 'S'), (2, 'M'), (2, 'L'), (2, 'XL'), (2, '2XL'),
(3, 'S'), (3, 'M'), (3, 'L'), (3, 'XL'),
(4, 'M'), (4, 'L'), (4, 'XL'), (4, '2XL'),
(5, 'S'), (5, 'M'), (5, 'L'), (5, 'XL'), (5, '2XL'),
(6, 'S'), (6, 'M'), (6, 'L'), (6, 'XL'), (6, '2XL'),
(7, 'S'), (7, 'M'), (7, 'L'), (7, 'XL'), (7, '2XL'),
(8, 'S'), (8, 'M'), (8, 'L'), (8, 'XL'), (8, '2XL'),
(9, 'S'), (9, 'M'), (9, 'L'), (9, 'XL'), (9, '2XL'),
(10, 'S'), (10, 'M'), (10, 'L'), (10, 'XL'),
(11, 'S'), (11, 'M'), (11, 'L'), (11, 'XL'), (11, '2XL'),
(12, 'S'), (12, 'M'), (12, 'L'), (12, 'XL'), (12, '2XL'),
(13, 'S'), (13, 'M'), (13, 'L'), (13, 'XL'),
(14, 'M'), (14, 'L'), (14, 'XL'), (14, '2XL'),
(15, 'S'), (15, 'M'), (15, 'L'), (15, 'XL'), (15, '2XL'),
(16, 'S'), (16, 'M'), (16, 'L'), (16, 'XL'),
(17, 'S'), (17, 'M'), (17, 'L'), (17, 'XL'), (17, '2XL'),
(18, 'S'), (18, 'M'), (18, 'L'), (18, 'XL'), (18, '2XL'),
(19, 'M'), (19, 'L'), (19, 'XL'), (19, '2XL'),
(20, 'S'), (20, 'M'), (20, 'L'), (20, 'XL'),
(21, 'S'), (21, 'M'), (21, 'L'), (21, 'XL'), (21, '2XL'),
(22, 'S'), (22, 'M'), (22, 'L'), (22, 'XL'), (22, '2XL'),
(23, 'S'), (23, 'M'), (23, 'L'), (23, 'XL'),
(24, 'M'), (24, 'L'), (24, 'XL'), (24, '2XL'),
(25, 'S'), (25, 'M'), (25, 'L'), (25, 'XL'),
(26, 'S'), (26, 'M'), (26, 'L'), (26, 'XL'), (26, '2XL'),
(27, 'S'), (27, 'M'), (27, 'L'), (27, 'XL'),
(28, 'S'), (28, 'M'), (28, 'L'), (28, 'XL'), (28, '2XL'),
(29, 'S'), (29, 'M'), (29, 'L'), (29, 'XL'),
(30, 'S'), (30, 'M'), (30, 'L'), (30, 'XL'), (30, '2XL'),
(31, 'S'), (31, 'M'), (31, 'L'), (31, 'XL'),
(32, 'S'), (32, 'M'), (32, 'L'), (32, 'XL'), (32, '2XL'),
(33, 'S'), (33, 'M'), (33, 'L'), (33, 'XL'),
(34, 'M'), (34, 'L'), (34, 'XL'), (34, '2XL'),
(35, 'S'), (35, 'M'), (35, 'L'), (35, 'XL'),
(36, 'S'), (36, 'M'), (36, 'L'), (36, 'XL'), (36, '2XL'),
(37, 'S'), (37, 'M'), (37, 'L'), (37, 'XL'),
(38, 'S'), (38, 'M'), (38, 'L'), (38, 'XL'), (38, '2XL'),
(39, 'M'), (39, 'L'), (39, 'XL'), (39, '2XL'),
(40, 'S'), (40, 'M'), (40, 'L'), (40, 'XL'), (40, '2XL'),
(41, 'M'), (41, 'L'), (41, 'XL'), (41, '2XL'),
(42, 'S'), (42, 'M'), (42, 'L'), (42, 'XL'), (42, '2XL'),
(43, 'M'), (43, 'L'), (43, 'XL'), (43, '2XL'),
(44, 'S'), (44, 'M'), (44, 'L'), (44, 'XL'),
(45, 'M'), (45, 'L'), (45, 'XL'), (45, '2XL'),
(46, 'S'), (46, 'M'), (46, 'L'), (46, 'XL'), (46, '2XL'),
(47, 'M'), (47, 'L'), (47, 'XL'), (47, '2XL'),
(48, 'S'), (48, 'M'), (48, 'L'), (48, 'XL'),
(49, 'M'), (49, 'L'), (49, 'XL'), (49, '2XL'),
(50, 'S'), (50, 'M'), (50, 'L'), (50, 'XL'), (50, '2XL');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
