// ==========================================================
// PRODUCTS MANAGEMENT CLIENT SCRIPT
// Developer: Talari Ajay Kumar (Roll No: 24ATAO5332)
// ==========================================================

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    checkDbStatus();
    if (document.getElementById('productsTableBody')) {
        loadProducts();
    }
});

// 1. Check MySQL status
async function checkDbStatus() {
    const badge = document.getElementById('dbStatusBadge');
    if (!badge) return;

    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.connected) {
            badge.className = 'db-badge connected';
            badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> MySQL Workbench Connected';
        } else {
            badge.className = 'db-badge offline';
            badge.innerHTML = '<i class="fa-solid fa-circle-info"></i> Running in Demo Mode (Ready for Viva)';
        }
    } catch (e) {
        badge.className = 'db-badge offline';
        badge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Server Offline';
    }
}

// 2. Load all products for Home table
async function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="loading-td">
                    <i class="fa-solid fa-spinner fa-spin"></i> Fetching products from MySQL database...
                </td>
            </tr>
        `;
    }

    try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        allProducts = await res.json();
        updateStats(allProducts);
        renderTable(allProducts);
    } catch (err) {
        console.error(err);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-td">
                        <i class="fa-solid fa-triangle-exclamation"></i> Unable to load products from server.
                    </td>
                </tr>
            `;
        }
    }
}

// 3. Render Table with exact headings: Product ID, Product Name, Product Price + Actions
function renderTable(products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-td">
                    <i class="fa-solid fa-box-open"></i> No products found in the database.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => {
        const formattedPrice = formatCurrency(product.product_price);
        return `
            <tr>
                <td><span class="product-id-cell">#${product.product_id}</span></td>
                <td><span class="product-name-cell">${escapeHtml(product.product_name)}</span></td>
                <td><span class="product-price-cell">${formattedPrice}</span></td>
                <td>
                    <div class="action-buttons-group">
                        <a href="update-product.html?id=${product.product_id}" class="btn-sm-edit" title="Update Product">
                            <i class="fa-solid fa-pen-to-square"></i> Update
                        </a>
                        <button onclick="deleteProductDirect(${product.product_id}, '${escapeHtml(product.product_name)}')" class="btn-sm-delete" title="Delete Product">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 4. Update KPI numbers
function updateStats(products) {
    const totalElem = document.getElementById('totalProductsCount');
    const valueElem = document.getElementById('totalInventoryValue');
    const avgElem = document.getElementById('avgPriceBadge');

    if (totalElem) totalElem.innerText = products.length;

    if (products.length > 0) {
        const totalVal = products.reduce((sum, p) => sum + parseFloat(p.product_price || 0), 0);
        const avgVal = totalVal / products.length;

        if (valueElem) valueElem.innerText = formatCurrency(totalVal);
        if (avgElem) avgElem.innerText = formatCurrency(avgVal);
    }
}

// 5. Real-time Search filter on Home page
function filterProducts() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const filtered = allProducts.filter(p =>
        p.product_name.toLowerCase().includes(query) ||
        String(p.product_id).includes(query) ||
        String(p.product_price).includes(query)
    );
    renderTable(filtered);
}

// 6. Direct Delete handler from table
async function deleteProductDirect(id, name) {
    const confirmed = confirm(`Are you sure you want to delete Product #${id} ("${name}") from MySQL database?`);
    if (!confirmed) return;

    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Delete failed');

        showToast(`🗑️ Product #${id} removed successfully!`);
        await loadProducts();
    } catch (err) {
        showToast('Error: ' + err.message, true);
    }
}

// Format currency
function formatCurrency(num) {
    const val = parseFloat(num);
    if (isNaN(val)) return '₹0.00';
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Toast
function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.innerHTML = `<i id="toastIcon"></i> <span id="toastMsg"></span>`;
        document.body.appendChild(toast);
    }
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.innerText = message;
    if (isError) {
        toast.className = 'toast show error';
        toastIcon.className = 'fa-solid fa-triangle-exclamation';
    } else {
        toast.className = 'toast show';
        toastIcon.className = 'fa-solid fa-circle-check';
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3500);
}
