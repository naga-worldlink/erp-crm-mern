import { login } from "./login.js";

const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and accessories",
    color: "#3b82f6"
  },
  {
    name: "Office Supplies",
    description: "Office equipment and stationery",
    color: "#10b981"
  },
  {
    name: "Software",
    description: "Software licenses and subscriptions",
    color: "#8b5cf6"
  },
  {
    name: "Furniture",
    description: "Office furniture and fixtures",
    color: "#f59e0b"
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdCategories = [];

    for (const category of categories) {
      const res = await client.post("/api/productcategory/create", category);
      console.log(`✓ Created Product Category: ${res.data.result.name} (ID: ${res.data.result._id})`);
      createdCategories.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdCategories.length} product categories`);
    return createdCategories;
  } catch (error) {
    console.error("❌ Error creating product categories:", error.response?.data || error.message);
    throw error;
  }
};

run();
