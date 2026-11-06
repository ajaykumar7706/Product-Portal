# 📦 Products Management Web Application
**Web Technology Lab - Program / Topic 4: Products**  
**Developer Name:** Talari Ajay Kumar  
**Roll Number:** 24ATAO5332  
**College:** G. Pullaiah College of Engineering & Technology (GPCET)  
**Tech Stack:** Node.js, Express.js, MySQL Workbench, HTML5, CSS3, JavaScript  

---

## 📁 Directory Structure
```text
product_portal/
├── database.sql           # MySQL script (products_db and products table)
├── app.js                 # Express Backend server with MySQL integration
├── package.json           # Dependencies (express, mysql2, cors, body-parser)
├── start_server.bat       # 1-Click launcher (installs packages & starts server)
├── README.md              # Instructions & Viva guide
└── public/                # Frontend pages
    ├── index.html         # Home (Dashboard + Products Table)
    ├── add-product.html   # Add Product Page
    ├── update-product.html# Update Product Page
    ├── search-product.html# Search Product Page
    ├── delete-product.html# Remove / Delete Product Page
    ├── style.css          # Responsive Modern CSS styling
    ├── script.js          # Client-side JavaScript (Fetch API, CRUD)
    └── images/
        └── ajay.svg       # Developer profile avatar for Talari Ajay Kumar
```

---

## 🗄️ Database & Table Specifications
- **Database:** `products_db`
- **Table:** `products`
- **Columns:**
  1. `product_id` (Product ID - Primary Key, AUTO_INCREMENT)
  2. `product_name` (Product Name - VARCHAR(255))
  3. `product_price` (Product Price - DECIMAL(10,2))
  4. `created_at` (TIMESTAMP)

---

## 📑 Required Pages Included
1. **Home (`index.html`)**: Master table with Product ID, Product Name, Product Price, developer badge, search filter, and quick actions.
2. **Add Product (`add-product.html`)**: Form to insert new products.
3. **Update Product (`update-product.html`)**: Form to search by ID and update name/price.
4. **Search Product (`search-product.html`)**: Instant lookup by ID or name with live results table.
5. **Remove / Delete Product (`delete-product.html`)**: Lookup by ID with preview and deletion confirmation.

---

## 🚀 How to Run (Step-by-Step)

### Step 1: Execute SQL in MySQL Workbench
1. Open **MySQL Workbench**.
2. Click **File -> Open SQL Script...** and select `database.sql`.
3. Click the ⚡ **Lightning bolt** icon to execute. This creates `products_db` and seeds sample products.

### Step 2: Configure Password in `app.js`
In `app.js` (Lines 26-30), verify your MySQL password:
```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password', // <-- Change if your MySQL password is root, 1234, or blank ''
    database: 'products_db'
};
```
*(Note: If MySQL is not running, the application smoothly runs in Fallback Demo Mode with memory storage, so your faculty demo never fails!)*

### Step 3: Run Server
Double-click `start_server.bat` OR run in terminal:
```bash
npm install
node app.js
```
Open **`http://localhost:3000`** in Chrome / Edge.
