import { login } from "./login.js";

const clients = [
  { name: "John Doe", email: "john@example.com", phone: "555-1000" },
  { name: "Sarah Smith", email: "sarah@example.com", phone: "555-2000" },
  { name: "Michael Lee", email: "michael@example.com", phone: "555-3000" },
];

const run = async () => {
  const client = await login();

  for (const c of clients) {
    const res = await client.post("/api/client/create", c);
    console.log("Created Client:", res.data.result.name);
  }
};

run();
