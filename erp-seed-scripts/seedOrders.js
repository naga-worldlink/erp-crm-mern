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

    const currentDate = new Date();

    const orders = [
      {
        client: clients[0]._id,
        number: 1,
        date: currentDate.toISOString(),
        status: "in progress",
        fulfillment: "processing",
        notes: "Urgent order - customer needs by end of week",
        items: [
          {
            product: products[0]._id,
            itemName: products[0].name,
            description: products[0].description,
            quantity: 5,
            price: products[0].price,
            total: products[0].price * 5,
            discount: 0
          },
          {
            product: products[1]._id,
            itemName: products[1].name,
            description: products[1].description,
            quantity: 3,
            price: products[1].price,
            total: products[1].price * 3,
            discount: 0
          }
        ]
      },
      {
        client: clients[Math.min(1, clients.length - 1)]._id,
        number: 2,
        date: currentDate.toISOString(),
        status: "not started",
        fulfillment: "pending",
        notes: "Regular monthly order",
        items: [
          {
            product: products[2]._id,
            itemName: products[2].name,
            description: products[2].description,
            quantity: 10,
            price: products[2].price,
            total: products[2].price * 10,
            discount: 0
          }
        ]
      }
    ];

    const createdOrders = [];

    for (const order of orders) {
      const res = await client.post("/api/order/create", order);
      console.log(`✓ Created Order #${res.data.result.number} for ${res.data.result.client?.name || 'Client'} (ID: ${res.data.result._id})`);
      createdOrders.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdOrders.length} orders`);
    return createdOrders;
  } catch (error) {
    console.error("❌ Error creating orders:", error.response?.data || error.message);
    throw error;
  }
};

run();
