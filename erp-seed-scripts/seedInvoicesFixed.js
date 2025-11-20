import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get clients and products
    const clientsRes = await client.get("/api/client/list");
    const clients = clientsRes.data.result;

    const productsRes = await client.get("/api/product/list");
    const products = productsRes.data.result;

    if (!clients || clients.length === 0) {
      console.error("❌ No clients found. Please run seedClientsFixed.js first!");
      return;
    }

    if (!products || products.length === 0) {
      console.error("❌ No products found. Please run seedProductsFixed.js first!");
      return;
    }

    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);

    const invoices = [
      {
        client: clients[0]._id,
        number: 1,
        year: currentYear,
        date: currentDate.toISOString(),
        expiredDate: expiredDate.toISOString(),
        status: "draft",
        notes: "First invoice for demo",
        currency: "USD",
        taxRate: 10,
        items: [
          {
            itemName: products[0]?.name || "Sample Product 1",
            description: products[0]?.description || "Product description",
            quantity: 2,
            price: products[0]?.price || 100,
            total: (products[0]?.price || 100) * 2
          },
          {
            itemName: products[1]?.name || "Sample Product 2",
            description: products[1]?.description || "Product description",
            quantity: 1,
            price: products[1]?.price || 50,
            total: products[1]?.price || 50
          }
        ]
      },
      {
        client: clients[Math.min(1, clients.length - 1)]._id,
        number: 2,
        year: currentYear,
        date: currentDate.toISOString(),
        expiredDate: expiredDate.toISOString(),
        status: "sent",
        notes: "Second invoice for demo",
        currency: "USD",
        taxRate: 8,
        items: [
          {
            itemName: products[2]?.name || "Sample Product 3",
            description: products[2]?.description || "Product description",
            quantity: 3,
            price: products[2]?.price || 200,
            total: (products[2]?.price || 200) * 3
          }
        ]
      }
    ];

    const createdInvoices = [];

    for (const invoice of invoices) {
      const res = await client.post("/api/invoice/create", invoice);
      console.log(`✓ Created Invoice #${res.data.result.number} for ${res.data.result.client?.name || 'Client'} - Total: $${res.data.result.total} (ID: ${res.data.result._id})`);
      createdInvoices.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdInvoices.length} invoices`);
    return createdInvoices;
  } catch (error) {
    console.error("❌ Error creating invoices:", error.response?.data || error.message);
    throw error;
  }
};

run();
