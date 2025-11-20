import { login } from "./login.js";

const expenseCategories = [
  {
    name: "Office Rent",
    description: "Monthly office rental expenses",
    color: "#ef4444"
  },
  {
    name: "Utilities",
    description: "Electricity, water, internet bills",
    color: "#f59e0b"
  },
  {
    name: "Travel",
    description: "Business travel and transportation",
    color: "#3b82f6"
  },
  {
    name: "Marketing",
    description: "Advertising and marketing expenses",
    color: "#8b5cf6"
  },
  {
    name: "Supplies",
    description: "Office supplies and equipment",
    color: "#10b981"
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdCategories = [];

    for (const category of expenseCategories) {
      const res = await client.post("/api/expensecategory/create", category);
      console.log(`✓ Created Expense Category: ${res.data.result.name} (ID: ${res.data.result._id})`);
      createdCategories.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdCategories.length} expense categories`);
    return createdCategories;
  } catch (error) {
    console.error("❌ Error creating expense categories:", error.response?.data || error.message);
    throw error;
  }
};

run();
