# Complete API Endpoints Documentation

## Authentication Required
All endpoints except `/api/login`, `/api/forgetpassword`, and `/api/resetpassword` require authentication.
Authentication is handled via JWT token stored in cookies.

## Base URL
`http://localhost:8888/api`

---

## 🔐 Authentication Endpoints

### POST /api/login
**Description:** Authenticate admin user
**Authentication:** Not required
**Body:**
```json
{
  "email": "admin@demo.com",
  "password": "admin123"
}
```
**Response:** Sets JWT token in cookie

### POST /api/logout
**Description:** Logout current user
**Authentication:** Required
**Response:** Clears authentication cookie

### POST /api/forgetpassword
**Description:** Request password reset
**Authentication:** Not required

### POST /api/resetpassword
**Description:** Reset password with token
**Authentication:** Not required

---

## 👤 Admin Management

### GET /api/admin/read/:id
**Description:** Read admin details
**Authentication:** Required

### PATCH /api/admin/password-update/:id
**Description:** Update admin password
**Authentication:** Required

### PATCH /api/admin/profile/password
**Description:** Update current admin password
**Authentication:** Required

### PATCH /api/admin/profile/update
**Description:** Update current admin profile
**Authentication:** Required

---

## 🏢 Company Endpoints

### POST /api/company/create
**Description:** Create a new company
**Authentication:** Required
**Required Fields:**
- `name` (String) - Company name

**Optional Fields:**
- `legalName`, `email`, `phone`, `address`, `city`, `State`, `postalCode`, `country`
- `website`, `companyTaxNumber`, `bankName`, `bankIban`, etc.

**Example:**
```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "1-800-123-4567",
  "address": "100 Business St",
  "city": "San Francisco",
  "country": "USA"
}
```

### GET /api/company/read/:id
Get company by ID

### PATCH /api/company/update/:id
Update company

### DELETE /api/company/delete/:id
Delete company (soft delete)

### GET /api/company/list
Get paginated list of companies

### GET /api/company/listAll
Get all companies

### GET /api/company/search
Search companies

### GET /api/company/filter
Filter companies

### GET /api/company/summary
Get companies summary

---

## 👥 People Endpoints

### POST /api/people/create
**Description:** Create a new person
**Authentication:** Required
**Required Fields:**
- `firstname` (String)
- `lastname` (String)

**Optional Fields:**
- `email`, `phone`, `address`, `city`, `country`
- `gender` (Enum: "male", "female")
- `birthday`, `birthplace`, `company` (ObjectId reference)

**Example:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "gender": "male"
}
```

### GET /api/people/read/:id
### PATCH /api/people/update/:id
### DELETE /api/people/delete/:id
### GET /api/people/list
### GET /api/people/listAll
### GET /api/people/search
### GET /api/people/filter
### GET /api/people/summary

---

## 💼 Client Endpoints

### POST /api/client/create
**Description:** Create a new client (from company or person)
**Authentication:** Required
**Required Fields:**
- `type` (String, Enum: "company" or "people")
- Either `company` (ObjectId) if type is "company"
- Or `people` (ObjectId) if type is "people"

**Important:** The `name` field is automatically populated from the company/people record.

**Example (Company-based Client):**
```json
{
  "type": "company",
  "company": "507f1f77bcf86cd799439011"
}
```

**Example (People-based Client):**
```json
{
  "type": "people",
  "people": "507f1f77bcf86cd799439012"
}
```

**Common Error:**
- 403: "Please select a company" - You must provide either `company` or `people` ID

### GET /api/client/read/:id
### PATCH /api/client/update/:id
### DELETE /api/client/delete/:id
### GET /api/client/list
### GET /api/client/listAll
### GET /api/client/search
### GET /api/client/filter
### GET /api/client/summary

---

## 🎯 Lead Endpoints

### POST /api/lead/create
**Description:** Create a new lead
**Authentication:** Required
**Required Fields:**
- `type` (String, Enum: "company" or "people")
- Either `company` (ObjectId) if type is "company"
- Or `people` (ObjectId) if type is "people"

**Optional Fields:**
- `source`, `status`, `notes`, `category`

**Example:**
```json
{
  "type": "company",
  "company": "507f1f77bcf86cd799439011",
  "source": "Website",
  "status": "new",
  "notes": "Interested in premium package"
}
```

### GET /api/lead/read/:id
### PATCH /api/lead/update/:id
### DELETE /api/lead/delete/:id
### GET /api/lead/list
### GET /api/lead/listAll
### GET /api/lead/search
### GET /api/lead/filter
### GET /api/lead/summary

---

## 📦 Product Category Endpoints

### POST /api/productcategory/create
**Description:** Create product category
**Authentication:** Required
**Required Fields:**
- `name` (String)
- `color` (String, lowercase hex color)

**Example:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "color": "#3b82f6"
}
```

### GET /api/productcategory/read/:id
### PATCH /api/productcategory/update/:id
### DELETE /api/productcategory/delete/:id
### GET /api/productcategory/list
### GET /api/productcategory/listAll
### GET /api/productcategory/search
### GET /api/productcategory/filter
### GET /api/productcategory/summary

---

## 🛍️ Product Endpoints

### POST /api/product/create
**Description:** Create a new product
**Authentication:** Required
**Required Fields:**
- `name` (String)
- `productCategory` (ObjectId reference)
- `price` (Number)
- `currency` (String, uppercase, default: "NA")

**Optional Fields:**
- `description`, `number`, `title`, `tags`, `suppliers`

**Example:**
```json
{
  "productCategory": "507f1f77bcf86cd799439011",
  "name": "Laptop Dell XPS 15",
  "description": "High-performance laptop",
  "price": 1499,
  "currency": "USD"
}
```

### GET /api/product/read/:id
### PATCH /api/product/update/:id
### DELETE /api/product/delete/:id
### GET /api/product/list
### GET /api/product/listAll
### GET /api/product/search
### GET /api/product/filter
### GET /api/product/summary

---

## 👷 Employee Endpoints

### POST /api/employee/create
**Description:** Create employee
**Authentication:** Required
**Required Fields:**
- `firstname` (String)
- `lastname` (String)

**Optional Fields:**
- `email`, `phone`, `address`, `city`, `country`
- `gender`, `birthday`, `category`

**Example:**
```json
{
  "firstname": "Alice",
  "lastname": "Williams",
  "email": "alice@company.com",
  "phone": "555-9001",
  "category": "Sales"
}
```

### GET /api/employee/read/:id
### PATCH /api/employee/update/:id
### DELETE /api/employee/delete/:id
### GET /api/employee/list
### GET /api/employee/listAll
### GET /api/employee/search
### GET /api/employee/filter
### GET /api/employee/summary

---

## 📄 Invoice Endpoints

### POST /api/invoice/create
**Description:** Create a new invoice
**Authentication:** Required
**Required Fields:**
- `client` (ObjectId reference to Client)
- `number` (Number) - Invoice number
- `year` (Number) - Invoice year
- `date` (Date ISO string)
- `expiredDate` (Date ISO string)
- `status` (String, Enum: "draft", "pending", "sent", "refunded", "cancelled", "on hold")
- `taxRate` (Number or String) - Tax rate percentage
- `items` (Array of objects):
  - `itemName` (String, required)
  - `description` (String, optional)
  - `quantity` (Number, required)
  - `price` (Number, required)
  - `total` (Number, required) - quantity * price

**Auto-calculated Fields:**
- `subTotal`, `taxTotal`, `total`, `paymentStatus`
- `createdBy` (auto-filled from authenticated admin)

**Example:**
```json
{
  "client": "507f1f77bcf86cd799439011",
  "number": 1,
  "year": 2025,
  "date": "2025-01-15T00:00:00.000Z",
  "expiredDate": "2025-02-15T00:00:00.000Z",
  "status": "draft",
  "currency": "USD",
  "taxRate": 10,
  "notes": "First invoice",
  "items": [
    {
      "itemName": "Dell XPS 15",
      "description": "High-performance laptop",
      "quantity": 2,
      "price": 1499,
      "total": 2998
    }
  ]
}
```

### GET /api/invoice/read/:id
### PATCH /api/invoice/update/:id
### DELETE /api/invoice/delete/:id
### GET /api/invoice/list
### GET /api/invoice/listAll
### GET /api/invoice/search
### GET /api/invoice/filter
### GET /api/invoice/summary
### POST /api/invoice/mail
Send invoice via email

---

## 📋 Quote Endpoints

### POST /api/quote/create
**Description:** Create a new quote
**Authentication:** Required
**Required Fields:** (Similar to Invoice)
- `client`, `number`, `year`, `date`, `expiredDate`
- `status`, `currency`, `items`

**Example:**
```json
{
  "client": "507f1f77bcf86cd799439011",
  "number": 1,
  "year": 2025,
  "date": "2025-01-15T00:00:00.000Z",
  "expiredDate": "2025-02-15T00:00:00.000Z",
  "status": "draft",
  "currency": "USD",
  "taxRate": 10,
  "items": [
    {
      "itemName": "Product Name",
      "quantity": 2,
      "price": 100,
      "total": 200
    }
  ]
}
```

### GET /api/quote/read/:id
### PATCH /api/quote/update/:id
### DELETE /api/quote/delete/:id
### GET /api/quote/list
### GET /api/quote/listAll
### GET /api/quote/search
### GET /api/quote/filter
### GET /api/quote/summary
### POST /api/quote/mail
### GET /api/quote/convert/:id
Convert quote to invoice

---

## 📦 Order Endpoints

### POST /api/order/create
**Description:** Create a new order
**Authentication:** Required
**Required Fields:**
- `client` (ObjectId)
- `number` (Number)
- `date` (Date ISO string)
- `items` (Array):
  - `product` (ObjectId reference)
  - `itemName` (String)
  - `quantity` (Number)
  - `price` (Number)

**Example:**
```json
{
  "client": "507f1f77bcf86cd799439011",
  "number": 1,
  "date": "2025-01-15T00:00:00.000Z",
  "status": "in progress",
  "fulfillment": "processing",
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "itemName": "Laptop",
      "quantity": 5,
      "price": 1499,
      "total": 7495
    }
  ]
}
```

### GET /api/order/read/:id
### PATCH /api/order/update/:id
### DELETE /api/order/delete/:id
### GET /api/order/list
### GET /api/order/listAll
### GET /api/order/search
### GET /api/order/filter
### GET /api/order/summary

---

## 💳 Payment Mode Endpoints

### POST /api/paymentmode/create
**Description:** Create payment mode
**Authentication:** Required
**Required Fields:**
- `name` (String)
- `description` (String)

**Example:**
```json
{
  "name": "Credit Card",
  "description": "Credit card payment",
  "isDefault": false
}
```

### GET /api/paymentmode/read/:id
### PATCH /api/paymentmode/update/:id
### DELETE /api/paymentmode/delete/:id
### GET /api/paymentmode/list
### GET /api/paymentmode/listAll
### GET /api/paymentmode/search
### GET /api/paymentmode/filter
### GET /api/paymentmode/summary

---

## 💰 Payment Endpoints

### POST /api/payment/create
**Description:** Create a payment for an invoice
**Authentication:** Required
**Required Fields:**
- `client` (ObjectId)
- `invoice` (ObjectId)
- `number` (Number)
- `date` (Date ISO string)
- `amount` (Number)
- `currency` (String, uppercase)

**Optional Fields:**
- `paymentMode` (ObjectId), `ref`, `description`

**Example:**
```json
{
  "client": "507f1f77bcf86cd799439011",
  "invoice": "507f1f77bcf86cd799439012",
  "number": 1,
  "date": "2025-01-15T00:00:00.000Z",
  "amount": 500,
  "currency": "USD",
  "paymentMode": "507f1f77bcf86cd799439013",
  "description": "Partial payment"
}
```

### GET /api/payment/read/:id
### PATCH /api/payment/update/:id
### DELETE /api/payment/delete/:id
### GET /api/payment/list
### GET /api/payment/listAll
### GET /api/payment/search
### GET /api/payment/filter
### GET /api/payment/summary
### POST /api/payment/mail

---

## 📊 Expense Category Endpoints

### POST /api/expensecategory/create
**Description:** Create expense category
**Authentication:** Required
**Required Fields:**
- `name` (String)
- `description` (String)
- `color` (String, lowercase hex)

**Example:**
```json
{
  "name": "Office Rent",
  "description": "Monthly office rental expenses",
  "color": "#ef4444"
}
```

### GET /api/expensecategory/read/:id
### PATCH /api/expensecategory/update/:id
### DELETE /api/expensecategory/delete/:id
### GET /api/expensecategory/list
### GET /api/expensecategory/listAll
### GET /api/expensecategory/search
### GET /api/expensecategory/filter
### GET /api/expensecategory/summary

---

## 💸 Expense Endpoints

### POST /api/expense/create
**Description:** Create an expense
**Authentication:** Required
**Required Fields:**
- `name` (String)
- `expenseCategory` (ObjectId)
- `total` (Number)
- `currency` (String, uppercase)

**Optional Fields:**
- `description`, `date`, `paymentMode`, `supplier`

**Example:**
```json
{
  "name": "Office Rent - January",
  "description": "Monthly rent payment",
  "date": "2025-01-15T00:00:00.000Z",
  "expenseCategory": "507f1f77bcf86cd799439011",
  "total": 2500,
  "currency": "USD",
  "paymentMode": "507f1f77bcf86cd799439012"
}
```

### GET /api/expense/read/:id
### PATCH /api/expense/update/:id
### DELETE /api/expense/delete/:id
### GET /api/expense/list
### GET /api/expense/listAll
### GET /api/expense/search
### GET /api/expense/filter
### GET /api/expense/summary

---

## 🎁 Offer Endpoints

Similar to Invoice and Quote endpoints:
- POST /api/offer/create
- GET /api/offer/read/:id
- PATCH /api/offer/update/:id
- DELETE /api/offer/delete/:id
- GET /api/offer/list
- GET /api/offer/listAll
- GET /api/offer/search
- GET /api/offer/filter
- GET /api/offer/summary
- POST /api/offer/mail

---

## 📦 Shipment Endpoints

Standard CRUD operations:
- POST /api/shipment/create
- GET /api/shipment/read/:id
- PATCH /api/shipment/update/:id
- DELETE /api/shipment/delete/:id
- GET /api/shipment/list
- GET /api/shipment/listAll
- GET /api/shipment/search
- GET /api/shipment/filter
- GET /api/shipment/summary

---

## 💼 Purchase Endpoints

Standard CRUD operations:
- POST /api/purchase/create
- GET /api/purchase/read/:id
- PATCH /api/purchase/update/:id
- DELETE /api/purchase/delete/:id
- GET /api/purchase/list
- GET /api/purchase/listAll
- GET /api/purchase/search
- GET /api/purchase/filter
- GET /api/purchase/summary

---

## 🏷️ Taxes Endpoints

Standard CRUD operations:
- POST /api/taxes/create
- GET /api/taxes/read/:id
- PATCH /api/taxes/update/:id
- DELETE /api/taxes/delete/:id
- GET /api/taxes/list
- GET /api/taxes/listAll
- GET /api/taxes/search
- GET /api/taxes/filter
- GET /api/taxes/summary

---

## ⚙️ Settings Endpoints

### POST /api/setting/create
### GET /api/setting/read/:id
### PATCH /api/setting/update/:id
### GET /api/setting/search
### GET /api/setting/list
### GET /api/setting/listAll
### GET /api/setting/filter
### GET /api/setting/readBySettingKey/:settingKey
### GET /api/setting/listBySettingKey
### PATCH /api/setting/updateBySettingKey/:settingKey
### PATCH /api/setting/upload/:settingKey
### PATCH /api/setting/updateManySetting

---

## 📧 Email Template Endpoints

### POST /api/email/create
### GET /api/email/read/:id
### PATCH /api/email/update/:id
### GET /api/email/search
### GET /api/email/list
### GET /api/email/listAll
### GET /api/email/filter

---

## Common Patterns

### Pagination
Most `list` endpoints support pagination parameters:
- `page` (Number, default: 1)
- `items` (Number, default: 10)

### Search
Search endpoints typically accept:
- `q` (String) - Search query

### Filter
Filter endpoints support various filter parameters based on the model fields.

### Soft Delete
Delete operations are soft deletes - records are marked as `removed: true` rather than being physically deleted.

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "result": null,
  "message": "No authentication token, authorization denied.",
  "jwtExpired": true
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Please select a company"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "result": null,
  "message": "Validation error message"
}
```

### 200 Success
```json
{
  "success": true,
  "result": { /* entity data */ },
  "message": "Successfully created/updated..."
}
```
