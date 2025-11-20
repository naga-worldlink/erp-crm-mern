# API Endpoints Quick Reference

## 🔑 Authentication: Cookie-based JWT
All endpoints require authentication token in cookie (except login/register).

---

## 📋 Complete Endpoint List by Entity

### 🔐 Authentication (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login admin user |
| POST | `/api/logout` | Logout current user |
| POST | `/api/forgetpassword` | Request password reset |
| POST | `/api/resetpassword` | Reset password |

---

### 👤 Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/read/:id` | Get admin details |
| PATCH | `/api/admin/password-update/:id` | Update admin password |
| PATCH | `/api/admin/profile/password` | Update own password |
| PATCH | `/api/admin/profile/update` | Update own profile |

---

### 🏢 Company
| Method | Endpoint | Required Fields | Company Selection |
|--------|----------|----------------|-------------------|
| POST | `/api/company/create` | `name` | None |
| GET | `/api/company/read/:id` | - | None |
| PATCH | `/api/company/update/:id` | - | None |
| DELETE | `/api/company/delete/:id` | - | None |
| GET | `/api/company/list` | - | None |
| GET | `/api/company/listAll` | - | None |
| GET | `/api/company/search` | `q` | None |
| GET | `/api/company/filter` | - | None |
| GET | `/api/company/summary` | - | None |

---

### 👥 People
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/people/create` | `firstname`, `lastname` |
| GET | `/api/people/read/:id` | - |
| PATCH | `/api/people/update/:id` | - |
| DELETE | `/api/people/delete/:id` | - |
| GET | `/api/people/list` | - |
| GET | `/api/people/listAll` | - |
| GET | `/api/people/search` | `q` |
| GET | `/api/people/filter` | - |
| GET | `/api/people/summary` | - |

---

### 💼 Client
| Method | Endpoint | Required Fields | Company Selection |
|--------|----------|----------------|-------------------|
| POST | `/api/client/create` | `type`, `company` OR `people` | **REQUIRED** |
| GET | `/api/client/read/:id` | - | None |
| PATCH | `/api/client/update/:id` | - | None |
| DELETE | `/api/client/delete/:id` | - | None |
| GET | `/api/client/list` | - | None |
| GET | `/api/client/listAll` | - | None |
| GET | `/api/client/search` | `q` | None |
| GET | `/api/client/filter` | - | None |
| GET | `/api/client/summary` | - | None |

**Company Selection Details:**
```json
{
  "type": "company",
  "company": "<company_id>"
}
// OR
{
  "type": "people",
  "people": "<people_id>"
}
```

---

### 🎯 Lead
| Method | Endpoint | Required Fields | Company Selection |
|--------|----------|----------------|-------------------|
| POST | `/api/lead/create` | `type`, `company` OR `people` | **REQUIRED** |
| GET | `/api/lead/read/:id` | - | None |
| PATCH | `/api/lead/update/:id` | - | None |
| DELETE | `/api/lead/delete/:id` | - | None |
| GET | `/api/lead/list` | - | None |
| GET | `/api/lead/listAll` | - | None |
| GET | `/api/lead/search` | `q` | None |
| GET | `/api/lead/filter` | - | None |
| GET | `/api/lead/summary` | - | None |

**Company Selection:** Same as Client

---

### 👷 Employee
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/employee/create` | `firstname`, `lastname` |
| GET | `/api/employee/read/:id` | - |
| PATCH | `/api/employee/update/:id` | - |
| DELETE | `/api/employee/delete/:id` | - |
| GET | `/api/employee/list` | - |
| GET | `/api/employee/listAll` | - |
| GET | `/api/employee/search` | `q` |
| GET | `/api/employee/filter` | - |
| GET | `/api/employee/summary` | - |

---

### 📦 Product Category
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/productcategory/create` | `name`, `color` |
| GET | `/api/productcategory/read/:id` | - |
| PATCH | `/api/productcategory/update/:id` | - |
| DELETE | `/api/productcategory/delete/:id` | - |
| GET | `/api/productcategory/list` | - |
| GET | `/api/productcategory/listAll` | - |
| GET | `/api/productcategory/search` | `q` |
| GET | `/api/productcategory/filter` | - |
| GET | `/api/productcategory/summary` | - |

---

### 🛍️ Product
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/product/create` | `name`, `productCategory`, `price`, `currency` |
| GET | `/api/product/read/:id` | - |
| PATCH | `/api/product/update/:id` | - |
| DELETE | `/api/product/delete/:id` | - |
| GET | `/api/product/list` | - |
| GET | `/api/product/listAll` | - |
| GET | `/api/product/search` | `q` |
| GET | `/api/product/filter` | - |
| GET | `/api/product/summary` | - |

---

### 📄 Invoice
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/invoice/create` | `client`, `number`, `year`, `date`, `expiredDate`, `status`, `taxRate`, `items[]` |
| GET | `/api/invoice/read/:id` | - |
| PATCH | `/api/invoice/update/:id` | - |
| DELETE | `/api/invoice/delete/:id` | - |
| GET | `/api/invoice/list` | - |
| GET | `/api/invoice/listAll` | - |
| GET | `/api/invoice/search` | `q` |
| GET | `/api/invoice/filter` | - |
| GET | `/api/invoice/summary` | - |
| POST | `/api/invoice/mail` | Email invoice |

**Items Structure:**
```json
{
  "items": [
    {
      "itemName": "Product Name",
      "description": "Optional description",
      "quantity": 2,
      "price": 100,
      "total": 200
    }
  ]
}
```

---

### 📋 Quote
| Method | Endpoint | Required Fields | Special |
|--------|----------|----------------|---------|
| POST | `/api/quote/create` | Same as Invoice | - |
| GET | `/api/quote/read/:id` | - | - |
| PATCH | `/api/quote/update/:id` | - | - |
| DELETE | `/api/quote/delete/:id` | - | - |
| GET | `/api/quote/list` | - | - |
| GET | `/api/quote/listAll` | - | - |
| GET | `/api/quote/search` | `q` | - |
| GET | `/api/quote/filter` | - | - |
| GET | `/api/quote/summary` | - | - |
| POST | `/api/quote/mail` | Email quote | - |
| GET | `/api/quote/convert/:id` | - | Convert to Invoice |

---

### 🎁 Offer
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/offer/create` | Same as Invoice |
| GET | `/api/offer/read/:id` | - |
| PATCH | `/api/offer/update/:id` | - |
| DELETE | `/api/offer/delete/:id` | - |
| GET | `/api/offer/list` | - |
| GET | `/api/offer/listAll` | - |
| GET | `/api/offer/search` | `q` |
| GET | `/api/offer/filter` | - |
| GET | `/api/offer/summary` | - |
| POST | `/api/offer/mail` | Email offer |

---

### 📦 Order
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/order/create` | `client`, `number`, `date`, `items[]` |
| GET | `/api/order/read/:id` | - |
| PATCH | `/api/order/update/:id` | - |
| DELETE | `/api/order/delete/:id` | - |
| GET | `/api/order/list` | - |
| GET | `/api/order/listAll` | - |
| GET | `/api/order/search` | `q` |
| GET | `/api/order/filter` | - |
| GET | `/api/order/summary` | - |

**Items Structure:**
```json
{
  "items": [
    {
      "product": "product_id",
      "itemName": "Product Name",
      "quantity": 5,
      "price": 100,
      "total": 500
    }
  ]
}
```

---

### 💳 Payment Mode
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/paymentmode/create` | `name`, `description` |
| GET | `/api/paymentmode/read/:id` | - |
| PATCH | `/api/paymentmode/update/:id` | - |
| DELETE | `/api/paymentmode/delete/:id` | - |
| GET | `/api/paymentmode/list` | - |
| GET | `/api/paymentmode/listAll` | - |
| GET | `/api/paymentmode/search` | `q` |
| GET | `/api/paymentmode/filter` | - |
| GET | `/api/paymentmode/summary` | - |

---

### 💰 Payment
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/payment/create` | `client`, `invoice`, `number`, `date`, `amount`, `currency` |
| GET | `/api/payment/read/:id` | - |
| PATCH | `/api/payment/update/:id` | - |
| DELETE | `/api/payment/delete/:id` | - |
| GET | `/api/payment/list` | - |
| GET | `/api/payment/listAll` | - |
| GET | `/api/payment/search` | `q` |
| GET | `/api/payment/filter` | - |
| GET | `/api/payment/summary` | - |
| POST | `/api/payment/mail` | Email payment receipt |

---

### 📊 Expense Category
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/expensecategory/create` | `name`, `description`, `color` |
| GET | `/api/expensecategory/read/:id` | - |
| PATCH | `/api/expensecategory/update/:id` | - |
| DELETE | `/api/expensecategory/delete/:id` | - |
| GET | `/api/expensecategory/list` | - |
| GET | `/api/expensecategory/listAll` | - |
| GET | `/api/expensecategory/search` | `q` |
| GET | `/api/expensecategory/filter` | - |
| GET | `/api/expensecategory/summary` | - |

---

### 💸 Expense
| Method | Endpoint | Required Fields |
|--------|----------|----------------|
| POST | `/api/expense/create` | `name`, `expenseCategory`, `total`, `currency` |
| GET | `/api/expense/read/:id` | - |
| PATCH | `/api/expense/update/:id` | - |
| DELETE | `/api/expense/delete/:id` | - |
| GET | `/api/expense/list` | - |
| GET | `/api/expense/listAll` | - |
| GET | `/api/expense/search` | `q` |
| GET | `/api/expense/filter` | - |
| GET | `/api/expense/summary` | - |

---

### 📦 Shipment
| Method | Endpoint |
|--------|----------|
| POST | `/api/shipment/create` |
| GET | `/api/shipment/read/:id` |
| PATCH | `/api/shipment/update/:id` |
| DELETE | `/api/shipment/delete/:id` |
| GET | `/api/shipment/list` |
| GET | `/api/shipment/listAll` |
| GET | `/api/shipment/search` |
| GET | `/api/shipment/filter` |
| GET | `/api/shipment/summary` |

---

### 🛒 Purchase
| Method | Endpoint |
|--------|----------|
| POST | `/api/purchase/create` |
| GET | `/api/purchase/read/:id` |
| PATCH | `/api/purchase/update/:id` |
| DELETE | `/api/purchase/delete/:id` |
| GET | `/api/purchase/list` |
| GET | `/api/purchase/listAll` |
| GET | `/api/purchase/search` |
| GET | `/api/purchase/filter` |
| GET | `/api/purchase/summary` |

---

### 🏷️ Taxes
| Method | Endpoint |
|--------|----------|
| POST | `/api/taxes/create` |
| GET | `/api/taxes/read/:id` |
| PATCH | `/api/taxes/update/:id` |
| DELETE | `/api/taxes/delete/:id` |
| GET | `/api/taxes/list` |
| GET | `/api/taxes/listAll` |
| GET | `/api/taxes/search` |
| GET | `/api/taxes/filter` |
| GET | `/api/taxes/summary` |

---

### ⚙️ Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/setting/create` | Create setting |
| GET | `/api/setting/read/:id` | Get setting by ID |
| PATCH | `/api/setting/update/:id` | Update setting |
| GET | `/api/setting/search` | Search settings |
| GET | `/api/setting/list` | List settings (paginated) |
| GET | `/api/setting/listAll` | List all settings |
| GET | `/api/setting/filter` | Filter settings |
| GET | `/api/setting/readBySettingKey/:settingKey` | Get by key |
| GET | `/api/setting/listBySettingKey` | List by key |
| PATCH | `/api/setting/updateBySettingKey/:settingKey` | Update by key |
| PATCH | `/api/setting/upload/:settingKey` | Upload file setting |
| PATCH | `/api/setting/updateManySetting` | Bulk update |

---

### 📧 Email Templates
| Method | Endpoint |
|--------|----------|
| POST | `/api/email/create` |
| GET | `/api/email/read/:id` |
| PATCH | `/api/email/update/:id` |
| GET | `/api/email/search` |
| GET | `/api/email/list` |
| GET | `/api/email/listAll` |
| GET | `/api/email/filter` |

---

## 🔍 Quick Reference

### Entities Requiring Company/People Selection:
- ✅ **Client** - Requires `type` + `company` OR `people`
- ✅ **Lead** - Requires `type` + `company` OR `people`

### Entities with Dependencies:
- **Product** → Requires `productCategory`
- **Invoice** → Requires `client`
- **Quote** → Requires `client`
- **Order** → Requires `client`, `product` (in items)
- **Payment** → Requires `client`, `invoice`
- **Expense** → Requires `expenseCategory`

### Standard CRUD Pattern:
All entities follow this pattern:
- POST `/{entity}/create` - Create new
- GET `/{entity}/read/:id` - Get by ID
- PATCH `/{entity}/update/:id` - Update
- DELETE `/{entity}/delete/:id` - Soft delete
- GET `/{entity}/list` - Paginated list
- GET `/{entity}/listAll` - All records
- GET `/{entity}/search` - Search
- GET `/{entity}/filter` - Filter
- GET `/{entity}/summary` - Summary stats

### Special Endpoints:
- **Quote:** `GET /quote/convert/:id` - Convert to invoice
- **Invoice/Quote/Offer/Payment:** `POST /{entity}/mail` - Send via email

---

## 📊 Total Endpoint Count

| Category | Count |
|----------|-------|
| Authentication | 4 |
| Admin | 4 |
| Company | 9 |
| People | 9 |
| Client | 9 |
| Lead | 9 |
| Employee | 9 |
| Product Category | 9 |
| Product | 9 |
| Invoice | 10 |
| Quote | 11 |
| Offer | 10 |
| Order | 9 |
| Payment Mode | 9 |
| Payment | 10 |
| Expense Category | 9 |
| Expense | 9 |
| Shipment | 9 |
| Purchase | 9 |
| Taxes | 9 |
| Settings | 12 |
| Email Templates | 7 |
| **TOTAL** | **193 endpoints** |
