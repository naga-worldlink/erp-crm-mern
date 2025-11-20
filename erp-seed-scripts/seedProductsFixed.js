import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get product categories first
    const categoriesRes = await client.get("/api/productcategory/list");
    const categories = categoriesRes.data.result;

    if (!categories || categories.length === 0) {
      console.error("❌ No product categories found. Please run seedProductCategories.js first!");
      return;
    }

    const electronicsCategory = categories.find(c => c.name === "Electronics") || categories[0];
    const officeCategory = categories.find(c => c.name === "Office Supplies") || categories[0];
    const softwareCategory = categories.find(c => c.name === "Software") || categories[0];

    const products = [
      {
        productCategory: electronicsCategory._id,
        name: "Dell XPS 15 Laptop",
        description: "High-performance laptop with Intel i7 processor",
        price: 1499,
        currency: "USD"
      },
      {
        productCategory: electronicsCategory._id,
        name: "Logitech MX Master 3",
        description: "Advanced wireless mouse",
        price: 99,
        currency: "USD"
      },
      {
        productCategory: electronicsCategory._id,
        name: "Samsung 27\" Monitor",
        description: "4K UHD professional monitor",
        price: 399,
        currency: "USD"
      },
      {
        productCategory: officeCategory._id,
        name: "Office Desk Chair",
        description: "Ergonomic office chair with lumbar support",
        price: 299,
        currency: "USD"
      },
      {
        productCategory: officeCategory._id,
        name: "Whiteboard 6x4 ft",
        description: "Magnetic dry-erase whiteboard",
        price: 149,
        currency: "USD"
      },
      {
        productCategory: softwareCategory._id,
        name: "Microsoft Office 365",
        description: "Annual subscription for Office suite",
        price: 99,
        currency: "USD"
      },
      {
        productCategory: softwareCategory._id,
        name: "Adobe Creative Cloud",
        description: "Monthly subscription for creative apps",
        price: 54.99,
        currency: "USD"
      }
    ];

    const createdProducts = [];

    for (const product of products) {
      const res = await client.post("/api/product/create", product);
      console.log(`✓ Created Product: ${res.data.result.name} - $${res.data.result.price} (ID: ${res.data.result._id})`);
      createdProducts.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error("❌ Error creating products:", error.response?.data || error.message);
    throw error;
  }
};

run();
