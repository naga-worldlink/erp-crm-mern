import { login } from "./login.js";

const companies = [
  {
    name: "Acme Corporation",
    legalName: "Acme Corporation Ltd",
    email: "contact@acme.com",
    phone: "1-800-ACME-123",
    address: "100 Innovation Drive",
    city: "San Francisco",
    State: "California",
    postalCode: 94105,
    country: "USA",
    website: "www.acme.com",
    companyTaxNumber: "TAX-ACME-001"
  },
  {
    name: "TechStart Solutions",
    legalName: "TechStart Solutions Inc",
    email: "info@techstart.com",
    phone: "1-888-TECH-456",
    address: "200 Tech Park",
    city: "Austin",
    State: "Texas",
    postalCode: 78701,
    country: "USA",
    website: "www.techstart.com",
    companyTaxNumber: "TAX-TECH-002"
  },
  {
    name: "Global Innovations Ltd",
    legalName: "Global Innovations Limited",
    email: "contact@globalinnovations.com",
    phone: "1-877-GLOBAL",
    address: "300 Business Boulevard",
    city: "Seattle",
    State: "Washington",
    postalCode: 98101,
    country: "USA",
    website: "www.globalinnovations.com",
    companyTaxNumber: "TAX-GLOBAL-003"
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdCompanies = [];

    for (const company of companies) {
      const res = await client.post("/api/company/create", company);
      console.log(`✓ Created Company: ${res.data.result.name} (ID: ${res.data.result._id})`);
      createdCompanies.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdCompanies.length} companies`);
    return createdCompanies;
  } catch (error) {
    console.error("❌ Error creating companies:", error.response?.data || error.message);
    throw error;
  }
};

run();
