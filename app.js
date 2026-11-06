// ==========================================================
// PRODUCTS MANAGEMENT SERVER (Node.js + Express + MySQL)
// Developer: Talari Ajay Kumar
// Roll No: 24ATAO5332
// Topic: 4. Products (Product ID, Product Name, Product Price)
// ==========================================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------
// MySQL Workbench Configuration
// (Change password below if your MySQL Workbench password differs)
// ----------------------------------------------------------
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password', // <-- CHANGE TO YOUR MYSQL WORKBENCH PASSWORD (e.g., 'root', '1234', '')
    database: 'products_db',
    multipleStatements: true
};

let db = null;
let isDbConnected = false;

// Fallback in-memory products array so the app NEVER crashes during viva/evaluation
let inMemoryProducts = [
    { product_id: 101, product_name: 'Dell XPS 15 Laptop (Intel Core i7, 16GB RAM)', product_price: 125000.00 },
    { product_id: 102, product_name: 'Apple iPhone 15 Pro (128GB, Natural Titanium)', product_price: 134900.00 },
    { product_id: 103, product_name: 'Sony WH-1000XM5 Wireless Headphones', product_price: 28990.00 },
    { product_id: 104, product_name: 'Logitech MX Master 3S Wireless Mouse', product_price: 8495.00 },
    { product_id: 105, product_name: 'Samsung 32-inch 4K UHD Curved Monitor', product_price: 34500.00 },
    { product_id: 106, product_name: 'Keychron K2 Mechanical Keyboard (RGB)', product_price: 9499.00 },
    { product_id: 107, product_name: 'Apple Watch Series 9 GPS 45mm', product_price: 44900.00 },
    { product_id: 108, product_name: 'JBL Charge 5 Portable Bluetooth Speaker', product_price: 14999.00 }
];

function connectToDatabase() {
    try {
        db = mysql.createConnection(dbConfig);
        db.connect((err) => {
            if (err) {
                console.warn('⚠️ [MySQL Notice]: Could not connect to MySQL Workbench database "products_db".');
                console.warn('   Reason:', err.message);
                console.warn('   Running in Fallback Demo Mode with in-memory storage (Demo will still work smoothly!).');
                console.warn('   Tip: Check your MySQL password in app.js and execute database.sql in Workbench.');
                isDbConnected = false;
            } else {
                console.log('✅ [MySQL Success]: Connected to MySQL Workbench database "products_db" successfully!');
                isDbConnected = true;
            }
        });

        db.on('error', (err) => {
            console.error('MySQL connection error:', err);
            isDbConnected = false;
        });
    } catch (e) {
        console.warn('⚠️ Running in fallback mode:', e.message);
        isDbConnected = false;
    }
}

connectToDatabase();

// ----------------------------------------------------------
// API ROUTES FOR PRODUCTS
// ----------------------------------------------------------

// 1. Connection status check
app.get('/api/status', (req, res) => {
    res.json({
        connected: isDbConnected,
        database: 'products_db',
        mode: isDbConnected ? 'MySQL Workbench Live' : 'Demo Mode (Offline Fallback)',
        developer: 'Talari Ajay Kumar (24ATAO5332)'
    });
});

// 2. GET all products (or search by query ?q=)
app.get('/api/products', (req, res) => {
    const query = (req.query.q || '').trim().toLowerCase();

    if (isDbConnected) {
        let sql = 'SELECT * FROM products';
        let params = [];
        if (query) {
            sql += ' WHERE product_name LIKE ? OR product_id = ? ORDER BY product_id DESC';
            params = [`%${query}%`, isNaN(query) ? -1 : Number(query)];
        } else {
            sql += ' ORDER BY product_id DESC';
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Database query error', details: err.message });
            }
            res.json(results);
        });
    } else {
        if (query) {
            const filtered = inMemoryProducts.filter(p =>
                p.product_name.toLowerCase().includes(query) || String(p.product_id) === query
            );
            return res.json(filtered);
        }
        res.json(inMemoryProducts);
    }
});

// 3. GET single product by ID (For Search & Update forms)
app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;

    if (isDbConnected) {
        const sql = 'SELECT * FROM products WHERE product_id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: `Product with ID ${id} not found!` });
            }
            res.json(results[0]);
        });
    } else {
        const found = inMemoryProducts.find(p => String(p.product_id) === String(id));
        if (!found) {
            return res.status(404).json({ error: `Product with ID ${id} not found!` });
        }
        res.json(found);
    }
});

// 4. POST: Add a new product
app.post('/api/products', (req, res) => {
    const { product_id, product_name, product_price } = req.body;

    if (!product_name || product_price === undefined || product_price === '') {
        return res.status(400).json({ error: 'Product Name and Product Price are required!' });
    }

    const priceNum = parseFloat(product_price);
    if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Please enter a valid positive numeric price.' });
    }

    if (isDbConnected) {
        let sql = '';
        let params = [];
        if (product_id) {
            sql = 'INSERT INTO products (product_id, product_name, product_price) VALUES (?, ?, ?)';
            params = [product_id, product_name, priceNum];
        } else {
            sql = 'INSERT INTO products (product_name, product_price) VALUES (?, ?)';
            params = [product_name, priceNum];
        }

        db.query(sql, params, (err, result) => {
            if (err) {
                console.error('Error inserting product:', err);
                return res.status(500).json({ error: 'Database insert failed: ' + err.message });
            }
            res.status(201).json({
                message: 'Product added successfully to MySQL Workbench!',
                product_id: product_id || result.insertId
            });
        });
    } else {
        const newId = product_id ? Number(product_id) : (inMemoryProducts.length > 0 ? Math.max(...inMemoryProducts.map(p => p.product_id)) + 1 : 101);
        const newProduct = {
            product_id: newId,
            product_name,
            product_price: priceNum
        };
        inMemoryProducts.unshift(newProduct);
        res.status(201).json({
            message: 'Product added successfully (Demo fallback mode)!',
            product_id: newId
        });
    }
});

// 5. PUT: Update an existing product
app.put('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const { product_name, product_price } = req.body;

    if (!product_name || product_price === undefined || product_price === '') {
        return res.status(400).json({ error: 'Product Name and Product Price are required for update!' });
    }

    const priceNum = parseFloat(product_price);
    if (isNaN(priceNum)) {
        return res.status(400).json({ error: 'Please provide a valid price.' });
    }

    if (isDbConnected) {
        const sql = 'UPDATE products SET product_name = ?, product_price = ? WHERE product_id = ?';
        db.query(sql, [product_name, priceNum, id], (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ error: 'Database update failed: ' + err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: `Product ID #${id} not found in database.` });
            }
            res.json({ message: `Product #${id} updated successfully in MySQL Workbench!` });
        });
    } else {
        const index = inMemoryProducts.findIndex(p => String(p.product_id) === String(id));
        if (index === -1) {
            return res.status(404).json({ error: `Product ID #${id} not found.` });
        }
        inMemoryProducts[index].product_name = product_name;
        inMemoryProducts[index].product_price = priceNum;
        res.json({ message: `Product #${id} updated successfully (Demo fallback mode)!` });
    }
});

// 6. DELETE: Remove / Delete product
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;

    if (isDbConnected) {
        const sql = 'DELETE FROM products WHERE product_id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Database delete failed: ' + err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: `Product ID #${id} does not exist.` });
            }
            res.json({ message: `Product #${id} deleted successfully from MySQL database!` });
        });
    } else {
        const beforeLen = inMemoryProducts.length;
        inMemoryProducts = inMemoryProducts.filter(p => String(p.product_id) !== String(id));
        if (inMemoryProducts.length === beforeLen) {
            return res.status(404).json({ error: `Product ID #${id} not found.` });
        }
        res.json({ message: `Product #${id} deleted successfully (Demo fallback mode)!` });
    }
});

// Serve frontend home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 PRODUCTS MANAGEMENT PORTAL STARTED`);
    console.log(`👨‍💻 Developer: Talari Ajay Kumar (Roll No: 24ATAO5332)`);
    console.log(`🌐 Website URL: http://localhost:${PORT}`);
    console.log(`📂 Public Folder: ${path.join(__dirname, 'public')}`);
    console.log(`=======================================================`);
});
