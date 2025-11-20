import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get companies and people
    const companiesRes = await client.get("/api/company/list");
    const companies = companiesRes.data.result;

    const peopleRes = await client.get("/api/people/list");
    const peoples = peopleRes.data.result;

    if ((!companies || companies.length === 0) && (!peoples || peoples.length === 0)) {
      console.error("❌ No companies or people found. Please run seedCompanyFixed.js and seedPeople.js first!");
      return;
    }

    const createdLeads = [];

    // Create leads from companies
    if (companies && companies.length > 0) {
      const lead1 = {
        type: "company",
        company: companies[0]._id,
        name: companies[0].name,
        source: "Website",
        status: "new",
        notes: "Interested in our premium package"
      };

      const res1 = await client.post("/api/lead/create", lead1);
      console.log(`✓ Created Lead (Company): ${res1.data.result.name} (ID: ${res1.data.result._id})`);
      createdLeads.push(res1.data.result);
    }

    // Create leads from people
    if (peoples && peoples.length > 0) {
      const lead2 = {
        type: "people",
        people: peoples[0]._id,
        name: `${peoples[0].firstname} ${peoples[0].lastname}`,
        source: "Referral",
        status: "contacted",
        notes: "Referred by existing client"
      };

      const res2 = await client.post("/api/lead/create", lead2);
      console.log(`✓ Created Lead (Person): ${res2.data.result.name} (ID: ${res2.data.result._id})`);
      createdLeads.push(res2.data.result);
    }

    console.log(`\n✓ Successfully created ${createdLeads.length} leads`);
    return createdLeads;
  } catch (error) {
    console.error("❌ Error creating leads:", error.response?.data || error.message);
    throw error;
  }
};

run();
