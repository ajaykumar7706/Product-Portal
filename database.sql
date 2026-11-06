-- ==========================================================
-- PRODUCTS MANAGEMENT DATABASE SCRIPT FOR MYSQL WORKBENCH
-- Prepared for: Talari Ajay Kumar (Roll No: 24ATAO5332)
-- College: GPCET Web Technology Lab
-- Topic: 4. Products (Product ID, Product Name, Product Price)
-- ==========================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS products_db;
USE products_db;

-- 2. Create the Products Table with required columns:
--    product_id, product_name, product_price
CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert Initial Sample Records
INSERT INTO products (product_name, product_price) VALUES
('Dell XPS 15 Laptop (Intel Core i7, 16GB RAM)', 125000.00),
('Apple iPhone 15 Pro (128GB, Natural Titanium)', 134900.00),
('Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 28990.00),
('Logitech MX Master 3S Wireless Performance Mouse', 8495.00),
('Samsung 32-inch 4K UHD Curved Gaming Monitor', 34500.00),
('Keychron K2 Mechanical Keyboard (RGB Backlit)', 9499.00),
('Apple Watch Series 9 GPS 45mm (Midnight)', 44900.00),
('JBL Charge 5 Portable Bluetooth Speaker', 14999.00);

-- 4. Verify table and data
SELECT * FROM products;
