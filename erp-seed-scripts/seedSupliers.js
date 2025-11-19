import { login } from "./login.js";

const suppliers = [
  { name: "TechSupply LLC", email: "supply@tech.com", phone: "555-4000" },
  { name: "Wholesale Hub", email: "wh@sales.com", phone: "555-5000" }
];

const run = async () => {
  const client = await login();

  for (const s of suppliers) {
    const res = await client.post("/api/people/create", s);
    console.log("Created Supplier:", res.data.result.name);
  }
};

run();
