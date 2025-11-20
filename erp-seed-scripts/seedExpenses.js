import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get expense categories and payment modes
    const categoriesRes = await client.get("/api/expensecategory/list");
    const categories = categoriesRes.data.result;

    const modesRes = await client.get("/api/paymentmode/list");
    const modes = modesRes.data.result;

    if (!categories || categories.length === 0) {
      console.error("❌ No expense categories found. Please run seedExpenseCategories.js first!");
      return;
    }

    const currentDate = new Date();

    const expenses = [
      {
        name: "Office Rent - January",
        description: "Monthly office rental payment",
        date: currentDate.toISOString(),
        expenseCategory: categories.find(c => c.name === "Office Rent")?._id || categories[0]._id,
        total: 2500,
        currency: "USD",
        paymentMode: modes && modes.length > 0 ? modes.find(m => m.name === "Bank Transfer")?._id : undefined
      },
      {
        name: "Internet & Phone Bills",
        description: "Monthly utilities payment",
        date: currentDate.toISOString(),
        expenseCategory: categories.find(c => c.name === "Utilities")?._id || categories[0]._id,
        total: 350,
        currency: "USD",
        paymentMode: modes && modes.length > 0 ? modes.find(m => m.name === "Credit Card")?._id : undefined
      },
      {
        name: "Business Trip to NYC",
        description: "Flight and hotel for client meeting",
        date: currentDate.toISOString(),
        expenseCategory: categories.find(c => c.name === "Travel")?._id || categories[0]._id,
        total: 1200,
        currency: "USD",
        paymentMode: modes && modes.length > 0 ? modes.find(m => m.name === "Credit Card")?._id : undefined
      },
      {
        name: "Google Ads Campaign",
        description: "Monthly digital marketing spend",
        date: currentDate.toISOString(),
        expenseCategory: categories.find(c => c.name === "Marketing")?._id || categories[0]._id,
        total: 800,
        currency: "USD",
        paymentMode: modes && modes.length > 0 ? modes[0]._id : undefined
      }
    ];

    const createdExpenses = [];

    for (const expense of expenses) {
      const res = await client.post("/api/expense/create", expense);
      console.log(`✓ Created Expense: ${res.data.result.name} - $${res.data.result.total} (ID: ${res.data.result._id})`);
      createdExpenses.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdExpenses.length} expenses`);
    return createdExpenses;
  } catch (error) {
    console.error("❌ Error creating expenses:", error.response?.data || error.message);
    throw error;
  }
};

run();
