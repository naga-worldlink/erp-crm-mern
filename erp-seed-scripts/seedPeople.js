import { login } from "./login.js";

const peoples = [
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "555-1001",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    gender: "male"
  },
  {
    firstname: "Sarah",
    lastname: "Smith",
    email: "sarah.smith@example.com",
    phone: "555-2002",
    address: "456 Oak Ave",
    city: "Los Angeles",
    country: "USA",
    gender: "female"
  },
  {
    firstname: "Michael",
    lastname: "Johnson",
    email: "michael.j@example.com",
    phone: "555-3003",
    address: "789 Pine Rd",
    city: "Chicago",
    country: "USA",
    gender: "male"
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdPeople = [];

    for (const person of peoples) {
      const res = await client.post("/api/people/create", person);
      console.log(`✓ Created Person: ${res.data.result.firstname} ${res.data.result.lastname} (ID: ${res.data.result._id})`);
      createdPeople.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdPeople.length} people`);
    return createdPeople;
  } catch (error) {
    console.error("❌ Error creating people:", error.response?.data || error.message);
    throw error;
  }
};

run();
