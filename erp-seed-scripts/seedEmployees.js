import { login } from "./login.js";

const employees = [
  {
    firstname: "Alice",
    lastname: "Williams",
    email: "alice.w@company.com",
    phone: "555-9001",
    address: "111 Employee St",
    city: "Boston",
    country: "USA",
    gender: "female",
    category: "Sales"
  },
  {
    firstname: "Bob",
    lastname: "Martinez",
    email: "bob.m@company.com",
    phone: "555-9002",
    address: "222 Staff Ave",
    city: "Denver",
    country: "USA",
    gender: "male",
    category: "Engineering"
  },
  {
    firstname: "Carol",
    lastname: "Davis",
    email: "carol.d@company.com",
    phone: "555-9003",
    address: "333 Worker Rd",
    city: "Miami",
    country: "USA",
    gender: "female",
    category: "Marketing"
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdEmployees = [];

    for (const employee of employees) {
      const res = await client.post("/api/employee/create", employee);
      console.log(`✓ Created Employee: ${res.data.result.firstname} ${res.data.result.lastname} (ID: ${res.data.result._id})`);
      createdEmployees.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdEmployees.length} employees`);
    return createdEmployees;
  } catch (error) {
    console.error("❌ Error creating employees:", error.response?.data || error.message);
    throw error;
  }
};

run();
