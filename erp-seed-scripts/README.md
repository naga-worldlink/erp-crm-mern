# ERP/CRM Seed Scripts - Complete Guide

This directory contains fully functional seed scripts to populate your ERP/CRM MongoDB database with demo data.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Script Execution Order](#script-execution-order)
4. [Individual Scripts](#individual-scripts)
5. [Understanding Company Selection](#understanding-company-selection)
6. [Troubleshooting](#troubleshooting)
7. [API Endpoints Reference](#api-endpoints-reference)

---

## ✅ Prerequisites

### 1. Node.js & Dependencies
Ensure you have installed the required packages:
```bash
npm install axios tough-cookie axios-cookiejar-support
```

### 2. Backend Server Running
Make sure the Express backend is running on `http://localhost:8888`:
```bash
cd backend
npm start
```

### 3. Admin Account
You need an admin account to login. Default credentials in `login.js`:
- **Email:** `admin@demo.com`
- **Password:** `admin123`

If you don't have an admin account, create one first or update `login.js` with your credentials.

---

## 🚀 Quick Start

### Run All Scripts at Once
```bash
cd erp-seed-scripts
node seedAll.js
```

This will run all scripts in the correct dependency order and populate your entire database.

### Run Individual Scripts
```bash
node seedCompanyFixed.js
node seedPeople.js
node seedProductCategories.js
# ... etc
```

---

## 📊 Script Execution Order

The scripts must be run in this order due to dependencies:

### Phase 1: Core Entities (No Dependencies)
```bash
node seedPeople.js              # Create people records
node seedCompanyFixed.js        # Create companies
node seedProductCategories.js   # Create product categories
node seedPaymentModes.js        # Create payment methods
node seedExpenseCategories.js   # Create expense categories
```

### Phase 2: Dependent Entities
```bash
node seedClientsFixed.js        # Create clients (requires companies & people)
node seedLeads.js               # Create leads (requires companies & people)
node seedEmployees.js           # Create employees
```

### Phase 3: Products
```bash
node seedProductsFixed.js       # Create products (requires categories)
```

### Phase 4: Documents
```bash
node seedQuotes.js              # Create quotes (requires clients & products)
node seedInvoicesFixed.js       # Create invoices (requires clients & products)
node seedOrders.js              # Create orders (requires clients & products)
```

### Phase 5: Financial Records
```bash
node seedPayments.js            # Create payments (requires invoices)
node seedExpenses.js            # Create expenses (requires expense categories)
```

---

## 📁 Individual Scripts

### `login.js`
**Purpose:** Handles authentication and returns an axios client with cookies
**Usage:** Imported by all other scripts
**Status:** ✅ WORKING

### `seedPeople.js`
**Creates:** 3 people records
**Output:** Person IDs
**Dependencies:** None

### `seedCompanyFixed.js`
**Creates:** 3 companies (Acme Corp, TechStart, Global Innovations)
**Output:** Company IDs
**Dependencies:** None
**Fixed Issues:**
- Proper field validation
- Required fields only

### `seedClientsFixed.js`
**Creates:** 2 company-based clients + 2 people-based clients
**Output:** Client IDs
**Dependencies:** Companies, People
**Fixed Issues:**
- ✅ Proper `type` field ("company" or "people")
- ✅ Correct company/people ID passing
- ✅ No more "Please select a company" error

**How it works:**
```javascript
// Company-based client
{
  "type": "company",
  "company": "<company_id>"
}

// People-based client
{
  "type": "people",
  "people": "<people_id>"
}
```

### `seedLeads.js`
**Creates:** 2 leads (1 company-based, 1 people-based)
**Output:** Lead IDs
**Dependencies:** Companies, People
**Fixed Issues:**
- Same as clients - proper type handling

### `seedProductCategories.js`
**Creates:** 4 product categories (Electronics, Office Supplies, Software, Furniture)
**Output:** Category IDs
**Dependencies:** None

### `seedProductsFixed.js`
**Creates:** 7 products across different categories
**Output:** Product IDs with prices
**Dependencies:** Product Categories
**Fixed Issues:**
- ✅ Required `productCategory` field
- ✅ Proper price and currency fields

### `seedEmployees.js`
**Creates:** 3 employees (Sales, Engineering, Marketing)
**Output:** Employee IDs
**Dependencies:** None

### `seedPaymentModes.js`
**Creates:** 5 payment modes (Cash, Credit Card, Bank Transfer, PayPal, Check)
**Output:** Payment Mode IDs
**Dependencies:** None

### `seedExpenseCategories.js`
**Creates:** 5 expense categories
**Output:** Expense Category IDs
**Dependencies:** None

### `seedQuotes.js`
**Creates:** 2 quotes with line items
**Output:** Quote IDs and totals
**Dependencies:** Clients, Products
**Fixed Issues:**
- ✅ Proper items array structure
- ✅ Required fields: client, number, year, date, expiredDate, status, taxRate
- ✅ Auto-calculated totals

### `seedInvoicesFixed.js`
**Creates:** 2 invoices with line items
**Output:** Invoice IDs and totals
**Dependencies:** Clients, Products
**Fixed Issues:**
- ✅ All required fields properly populated
- ✅ Items array with itemName, quantity, price, total
- ✅ createdBy auto-filled from logged-in admin

**Validation Schema:**
```javascript
{
  client: ObjectId (required),
  number: Number (required),
  year: Number (required),
  date: Date (required),
  expiredDate: Date (required),
  status: String (required),
  taxRate: Number (required),
  items: Array (required) [
    {
      itemName: String (required),
      quantity: Number (required),
      price: Number (required),
      total: Number (required)
    }
  ]
}
```

### `seedOrders.js`
**Creates:** 2 orders with products
**Output:** Order IDs
**Dependencies:** Clients, Products
**Fixed Issues:**
- ✅ Product references in items array
- ✅ Proper fulfillment and status fields

### `seedPayments.js`
**Creates:** Payments for invoices (50% partial payments)
**Output:** Payment IDs and amounts
**Dependencies:** Invoices, Payment Modes
**Fixed Issues:**
- ✅ Proper invoice and client references
- ✅ Required number field

### `seedExpenses.js`
**Creates:** 4 expenses (rent, utilities, travel, marketing)
**Output:** Expense IDs and amounts
**Dependencies:** Expense Categories, Payment Modes

### `seedAll.js`
**Purpose:** Runs all scripts in correct order
**Output:** Complete database population
**Status:** ✅ WORKING

---

## 🏢 Understanding Company Selection

### The "Please select a company" Error

This error occurs when creating **Clients** or **Leads** without proper company/people selection.

### How It Works

The backend has special validation for Clients and Leads in their create controllers:

**For Clients (`/backend/src/controllers/appControllers/clientController/create.js`):**
```javascript
if (req.body.type === 'people') {
  if (!req.body.people) {
    return 403: "Please select a people"
  }
} else {
  if (!req.body.company) {
    return 403: "Please select a company"
  }
}
```

**For Leads (`/backend/src/controllers/appControllers/leadController/create.js`):**
Same logic applies.

### Solution in Seed Scripts

**Wrong (Old approach):**
```javascript
// ❌ This will fail
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Correct (Fixed approach):**
```javascript
// ✅ Company-based client
{
  "type": "company",
  "company": "507f1f77bcf86cd799439011"
}

// ✅ People-based client
{
  "type": "people",
  "people": "507f1f77bcf86cd799439012"
}
```

The controller automatically populates the `name` field from the company or people record.

---

## 🔍 Troubleshooting

### Problem: "No authentication token"
**Solution:**
```javascript
// Make sure login.js is working
const client = await login(); // Returns axios client with cookies
```

### Problem: "Please select a company"
**Solution:**
- Ensure you're using `type: "company"` with `company: <id>` OR
- `type: "people"` with `people: <id>`
- Run `seedCompanyFixed.js` or `seedPeople.js` first

### Problem: "Product validation failed: productCategory: Path `productCategory` is required"
**Solution:**
- Run `seedProductCategories.js` before `seedProductsFixed.js`
- Make sure product has `productCategory` field

### Problem: "Invoice validation failed"
**Solution:**
Check that invoice has ALL required fields:
- ✅ client (ObjectId)
- ✅ number (Number)
- ✅ year (Number)
- ✅ date (Date)
- ✅ expiredDate (Date)
- ✅ status (String)
- ✅ taxRate (Number)
- ✅ items (Array with itemName, quantity, price, total)

### Problem: Script hangs or times out
**Solution:**
- Check backend server is running: `http://localhost:8888`
- Check MongoDB connection in backend
- Look at backend console for errors

### Problem: "Client Already Exist"
**Solution:**
- The system prevents duplicate clients for the same company/people
- This is by design - each company/person can only be a client once

---

## 🎯 Verification

After running the scripts, verify data in your database:

### Using MongoDB Compass
Connect to your MongoDB and check collections:
- `companies` - Should have 3 records
- `peoples` - Should have 3 records
- `clients` - Should have 4 records
- `products` - Should have 7 records
- `invoices` - Should have 2 records
- `quotes` - Should have 2 records
- `orders` - Should have 2 records
- `payments` - Should have 2 records
- `expenses` - Should have 4 records

### Using the UI
1. Login to the web application
2. Navigate to:
   - **Clients** → Should see 4 clients
   - **Products** → Should see 7 products
   - **Invoices** → Should see 2 invoices
   - **Quotes** → Should see 2 quotes
   - **Orders** → Should see 2 orders
   - **Payments** → Should see payments linked to invoices
   - **Expenses** → Should see 4 expenses

---

## 📚 API Endpoints Reference

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation including:
- All available endpoints
- Required/optional fields
- Request/response examples
- Authentication requirements
- Error responses

---

## 🔄 Re-seeding the Database

To clear and re-seed:

### Option 1: Drop Collections in MongoDB
```javascript
// In MongoDB shell or Compass
db.companies.deleteMany({});
db.clients.deleteMany({});
db.products.deleteMany({});
// ... etc
```

### Option 2: Re-run Scripts
Since the system uses unique constraints, you may need to:
1. Update the data in seed files (change names, emails, etc.)
2. Or drop the collections first
3. Then run `node seedAll.js` again

---

## 📝 Customization

### Modify Default Data
Edit the arrays in each script:

**Example - `seedCompanyFixed.js`:**
```javascript
const companies = [
  {
    name: "Your Company Name",
    email: "your@email.com",
    // ... customize fields
  }
];
```

### Change Login Credentials
Edit `login.js`:
```javascript
const res = await client.post("/api/login", {
  email: "your-admin@email.com",
  password: "your-password",
});
```

### Change Base URL
If your backend runs on a different port:

**Edit `login.js`:**
```javascript
const client = wrapper(
  axios.create({
    baseURL: "http://localhost:YOUR_PORT",
    jar
  })
);
```

---

## 🎉 Success Indicators

When everything works correctly, you'll see output like:

```
✓ Created Company: Acme Corporation (ID: 507f1f77bcf86cd799439011)
✓ Created Company: TechStart Solutions (ID: 507f1f77bcf86cd799439012)
✓ Created Company: Global Innovations Ltd (ID: 507f1f77bcf86cd799439013)

✓ Successfully created 3 companies
```

All scripts use:
- ✅ Success checkmarks
- 🎯 Clear entity identification
- 📊 Summary counts
- ❌ Error messages with helpful context

---

## 🐛 Common Errors Fixed

### ✅ FIXED: "Please select a company" (403)
**Old Issue:** Clients and leads didn't include company/people reference
**Fix:** Added `type` field and proper company/people ID

### ✅ FIXED: "productCategory is required"
**Old Issue:** Products created without category
**Fix:** Fetch categories first, then reference in products

### ✅ FIXED: Invoice validation errors
**Old Issue:** Missing required fields in invoice schema
**Fix:** All required fields properly included with correct structure

### ✅ FIXED: Payment number field missing
**Old Issue:** Payments failed validation
**Fix:** Added sequential number field

### ✅ FIXED: Expense category reference
**Old Issue:** Expenses without proper category link
**Fix:** Fetch and reference expense categories correctly

---

## 📞 Support

If you encounter issues:

1. Check backend logs for detailed error messages
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Review the API_ENDPOINTS.md for field requirements
5. Check that entities are created in the correct order

---

## 🚀 Next Steps

After seeding:

1. **Explore the UI** - Login and navigate through all modules
2. **Test CRUD Operations** - Try creating/editing/deleting records
3. **Test Business Logic** - Convert quotes to invoices, process payments
4. **Generate Reports** - Test summary and filter endpoints
5. **Customize Further** - Modify seed data to match your business needs

---

**Happy Seeding! 🌱**
