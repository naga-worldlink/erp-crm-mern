import { login } from "./login.js";
import { execSync } from "child_process";

const runScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Running: ${scriptName}`);
    console.log("=".repeat(60));

    try {
      execSync(`node ${scriptName}`, { stdio: "inherit" });
      resolve();
    } catch (error) {
      console.error(`❌ Error running ${scriptName}:`, error.message);
      reject(error);
    }
  });
};

const run = async () => {
  console.log("\n🚀 Starting complete database seeding process...\n");

  const scripts = [
    // 1. Core entities (no dependencies)
    "seedPeople.js",
    "seedCompanyFixed.js",
    "seedProductCategories.js",
    "seedPaymentModes.js",
    "seedExpenseCategories.js",

    // 2. Dependent entities (need companies/people)
    "seedClientsFixed.js",
    "seedLeads.js",
    "seedEmployees.js",

    // 3. Products (need categories)
    "seedProductsFixed.js",

    // 4. Documents (need clients and products)
    "seedQuotes.js",
    "seedInvoicesFixed.js",
    "seedOrders.js",

    // 5. Financial (need invoices)
    "seedPayments.js",
    "seedExpenses.js"
  ];

  try {
    for (const script of scripts) {
      await runScript(script);
      // Add small delay between scripts
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL SEED SCRIPTS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\nYour database has been populated with:");
    console.log("  ✓ People & Companies");
    console.log("  ✓ Clients & Leads");
    console.log("  ✓ Employees");
    console.log("  ✓ Product Categories & Products");
    console.log("  ✓ Quotes & Invoices");
    console.log("  ✓ Orders");
    console.log("  ✓ Payments & Expenses");
    console.log("\n🎉 You can now log in and explore the system!\n");
  } catch (error) {
    console.error("\n❌ Seeding process failed. Please check the errors above.");
    process.exit(1);
  }
};

run();
