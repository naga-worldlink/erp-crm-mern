import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get companies to create company-based clients
    const companiesRes = await client.get("/api/company/list");
    const companies = companiesRes.data.result;

    if (!companies || companies.length === 0) {
      console.error("❌ No companies found. Please run seedCompanyFixed.js first!");
      return;
    }

    // Get people to create people-based clients
    const peopleRes = await client.get("/api/people/list");
    const peoples = peopleRes.data.result;

    const createdClients = [];

    // Create clients from companies (type: "company")
    if (companies.length > 0) {
      for (let i = 0; i < Math.min(2, companies.length); i++) {
        const companyData = companies[i];
        const clientData = {
          type: "company",
          company: companyData._id,
          name: companyData.name // Will be overwritten by controller but good to include
        };

        const res = await client.post("/api/client/create", clientData);
        console.log(`✓ Created Client (Company): ${res.data.result.name} (ID: ${res.data.result._id})`);
        createdClients.push(res.data.result);
      }
    }

    // Create clients from people (type: "people")
    if (peoples && peoples.length > 0) {
      for (let i = 0; i < Math.min(2, peoples.length); i++) {
        const personData = peoples[i];
        const clientData = {
          type: "people",
          people: personData._id,
          name: `${personData.firstname} ${personData.lastname}` // Will be overwritten by controller
        };

        const res = await client.post("/api/client/create", clientData);
        console.log(`✓ Created Client (Person): ${res.data.result.name} (ID: ${res.data.result._id})`);
        createdClients.push(res.data.result);
      }
    }

    console.log(`\n✓ Successfully created ${createdClients.length} clients`);
    return createdClients;
  } catch (error) {
    console.error("❌ Error creating clients:", error.response?.data || error.message);
    throw error;
  }
};

run();
