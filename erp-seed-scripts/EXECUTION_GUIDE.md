# Seed Scripts Execution Guide

## 📋 Step-by-Step Execution Instructions

### Prerequisites Check

Before running any seed scripts, verify:

```bash
# 1. Check Node.js version (should be 20+)
node --version

# 2. Install dependencies
cd erp-seed-scripts
npm install axios tough-cookie axios-cookiejar-support

# 3. Verify backend is running
curl http://localhost:8888/api/
# Should return a 404 with error handler response (means server is up)
```

---

## 🎯 Option 1: Run Everything (Recommended)

This is the easiest and safest method:

```bash
cd erp-seed-scripts
node seedAll.js
```

**Expected Output:**
```
============================================================
Running: seedPeople.js
============================================================
Logged in as: admin@demo.com
✓ Created Person: John Doe (ID: ...)
✓ Created Person: Sarah Smith (ID: ...)
✓ Created Person: Michael Johnson (ID: ...)

✓ Successfully created 3 people

============================================================
Running: seedCompanyFixed.js
============================================================
...
[continues for all scripts]
...

============================================================
✅ ALL SEED SCRIPTS COMPLETED SUCCESSFULLY!
============================================================

Your database has been populated with:
  ✓ People & Companies
  ✓ Clients & Leads
  ✓ Employees
  ✓ Product Categories & Products
  ✓ Quotes & Invoices
  ✓ Orders
  ✓ Payments & Expenses

🎉 You can now log in and explore the system!
```

---

## 🔧 Option 2: Run Scripts Individually

For debugging or partial seeding, run scripts in this exact order:

### Phase 1: Core Data
```bash
# Create people records
node seedPeople.js
# Output: ✓ Successfully created 3 people

# Create companies
node seedCompanyFixed.js
# Output: ✓ Successfully created 3 companies

# Create product categories
node seedProductCategories.js
# Output: ✓ Successfully created 4 product categories

# Create payment modes
node seedPaymentModes.js
# Output: ✓ Successfully created 5 payment modes

# Create expense categories
node seedExpenseCategories.js
# Output: ✓ Successfully created 5 expense categories
```

### Phase 2: Entities with Dependencies
```bash
# Create clients (needs companies & people from Phase 1)
node seedClientsFixed.js
# Output: ✓ Successfully created 4 clients

# Create leads (needs companies & people from Phase 1)
node seedLeads.js
# Output: ✓ Successfully created 2 leads

# Create employees
node seedEmployees.js
# Output: ✓ Successfully created 3 employees
```

### Phase 3: Products
```bash
# Create products (needs product categories from Phase 1)
node seedProductsFixed.js
# Output: ✓ Successfully created 7 products
```

### Phase 4: Sales Documents
```bash
# Create quotes (needs clients and products)
node seedQuotes.js
# Output: ✓ Successfully created 2 quotes

# Create invoices (needs clients and products)
node seedInvoicesFixed.js
# Output: ✓ Successfully created 2 invoices

# Create orders (needs clients and products)
node seedOrders.js
# Output: ✓ Successfully created 2 orders
```

### Phase 5: Financial Records
```bash
# Create payments (needs invoices)
node seedPayments.js
# Output: ✓ Successfully created 2 payments

# Create expenses (needs expense categories and payment modes)
node seedExpenses.js
# Output: ✓ Successfully created 4 expenses
```

---

## ✅ Verification Steps

After running the scripts, verify the data:

### 1. Check Script Output
Each script should show:
- ✓ Green checkmarks for successful creations
- Entity names and IDs
- Summary count

### 2. Verify in MongoDB

**Using MongoDB Compass:**
1. Connect to your database
2. Check these collections:

| Collection | Expected Count | Notes |
|------------|---------------|-------|
| peoples | 3 | John, Sarah, Michael |
| companies | 3 | Acme, TechStart, Global |
| clients | 4 | 2 company-based, 2 people-based |
| leads | 2 | 1 company, 1 people |
| employees | 3 | Alice, Bob, Carol |
| productcategories | 4 | Electronics, Office, Software, Furniture |
| products | 7 | Various products |
| quotes | 2 | With line items |
| invoices | 2 | With line items |
| orders | 2 | With product references |
| paymentmodes | 5 | Cash, Credit Card, etc. |
| payments | 2 | Linked to invoices |
| expensecategories | 5 | Rent, Utilities, etc. |
| expenses | 4 | Various expenses |

**Using MongoDB Shell:**
```javascript
// Connect to your database
use your_database_name

// Check counts
db.companies.countDocuments({removed: false})  // Should be 3
db.clients.countDocuments({removed: false})    // Should be 4
db.products.countDocuments({removed: false})   // Should be 7
db.invoices.countDocuments({removed: false})   // Should be 2
```

### 3. Verify in Web UI
1. Start your frontend application
2. Login with: `admin@demo.com` / `admin123`
3. Navigate through modules:

**Dashboard:**
- Check summary widgets show correct counts

**Clients:**
- Should see 4 clients
- 2 with company icon/type
- 2 with person icon/type

**Products:**
- Should see 7 products
- Each with category tag
- Prices displayed correctly

**Invoices:**
- Should see 2 invoices
- Click to view details - should show line items
- Totals should be calculated (including tax)

**Quotes:**
- Should see 2 quotes
- Status and expiry dates visible

**Orders:**
- Should see 2 orders
- Fulfillment status displayed

**Payments:**
- Should see 2 payments
- Linked to respective invoices
- Payment amounts visible

**Expenses:**
- Should see 4 expenses
- Categories correctly assigned

---

## 🔄 Re-seeding Instructions

If you need to re-run the scripts:

### Method 1: Clean Database First
```javascript
// In MongoDB Compass or shell, delete all documents:
db.peoples.deleteMany({});
db.companies.deleteMany({});
db.clients.deleteMany({});
db.leads.deleteMany({});
db.employees.deleteMany({});
db.productcategories.deleteMany({});
db.products.deleteMany({});
db.quotes.deleteMany({});
db.invoices.deleteMany({});
db.orders.deleteMany({});
db.paymentmodes.deleteMany({});
db.payments.deleteMany({});
db.expensecategories.deleteMany({});
db.expenses.deleteMany({});
```

Then run:
```bash
node seedAll.js
```

### Method 2: Modify Seed Data
If you want to keep existing data and add more:
1. Edit the seed files to change names/values
2. Run individual scripts as needed

---

## 🐛 Troubleshooting Guide

### Error: "ECONNREFUSED" or "Network Error"
**Cause:** Backend server not running
**Solution:**
```bash
# In a separate terminal
cd backend
npm start
# Wait for: "Express running → On PORT : 8888"
```

### Error: "No authentication token"
**Cause:** Login failed or token expired
**Solution:**
1. Check admin account exists in database
2. Verify credentials in `login.js`
3. Try manual login:
```bash
curl -X POST http://localhost:8888/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'
```

### Error: "Please select a company" (403)
**Cause:** Trying to create client/lead without proper company/people reference
**Solution:**
1. Run `seedCompanyFixed.js` or `seedPeople.js` first
2. Verify the script is using correct format:
```javascript
// Correct format
{
  type: "company",
  company: "<valid_company_id>"
}
```

### Error: "productCategory: Path `productCategory` is required"
**Cause:** Trying to create product before categories exist
**Solution:**
```bash
# Run this first
node seedProductCategories.js
# Then run
node seedProductsFixed.js
```

### Error: Invoice validation failed
**Cause:** Missing required fields in invoice
**Solution:**
Check invoice object has all required fields:
- client, number, year, date, expiredDate
- status, taxRate, items array

### Error: "Cannot read property '_id' of undefined"
**Cause:** Previous script failed, dependencies not created
**Solution:**
1. Check output of previous scripts for errors
2. Run scripts in correct order (see Phase 1-5 above)

### Error: "Client Already Exist"
**Cause:** Trying to create duplicate client for same company/people
**Solution:**
- This is expected behavior (one client per company/person)
- Either clean database or modify seed data

---

## 📊 Expected Data Summary

After successful seeding, your database will have:

### People & Organizations
- **3 People:** Individual contacts
- **3 Companies:** Business entities
- **4 Clients:** 2 company-based + 2 people-based
- **2 Leads:** Potential clients
- **3 Employees:** Staff members

### Products & Categories
- **4 Product Categories:** Electronics, Office, Software, Furniture
- **7 Products:** Various items with prices ($54.99 - $1,499)

### Sales Documents
- **2 Quotes:** Pending quotations
- **2 Invoices:** Generated invoices with totals
- **2 Orders:** Product orders with fulfillment status

### Financial
- **5 Payment Modes:** Cash, Credit Card, Bank Transfer, PayPal, Check
- **2 Payments:** Partial payments (50% of invoices)
- **5 Expense Categories:** Rent, Utilities, Travel, Marketing, Supplies
- **4 Expenses:** Monthly expenses (~$4,850 total)

---

## 🎯 Quick Verification Checklist

After running `seedAll.js`, verify:

- [ ] No error messages in console
- [ ] All scripts show ✓ success messages
- [ ] Final summary shows all categories
- [ ] MongoDB shows expected document counts
- [ ] Web UI login works
- [ ] Clients page shows 4 clients
- [ ] Products page shows 7 products
- [ ] Invoices page shows 2 invoices with calculated totals
- [ ] Orders page shows 2 orders
- [ ] Payments page shows 2 payments linked to invoices
- [ ] Expenses page shows 4 expenses

---

## 📞 Getting Help

If issues persist:

1. **Check Backend Logs:**
```bash
cd backend
npm start
# Watch console for errors
```

2. **Check MongoDB Connection:**
```bash
# In backend/.env
DATABASE=mongodb://... # Verify this is correct
```

3. **Test API Manually:**
```bash
# Test login
curl -X POST http://localhost:8888/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}' \
  -c cookies.txt

# Test authenticated endpoint
curl -X GET http://localhost:8888/api/company/list \
  -b cookies.txt
```

4. **Review Documentation:**
- See `API_ENDPOINTS.md` for endpoint details
- See `README.md` for script explanations

---

## 🎉 Success!

When everything works, you should see:

```
✅ ALL SEED SCRIPTS COMPLETED SUCCESSFULLY!
============================================================

Your database has been populated with:
  ✓ People & Companies
  ✓ Clients & Leads
  ✓ Employees
  ✓ Product Categories & Products
  ✓ Quotes & Invoices
  ✓ Orders
  ✓ Payments & Expenses

🎉 You can now log in and explore the system!
```

**You're ready to use the ERP/CRM system!** 🚀
