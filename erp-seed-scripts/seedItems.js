import { login } from "./login.js";

const items = [
  { name: "Laptop", description: "Dell XPS 15", price: 1500, unit: "pcs" },
  { name: "Mouse", description: "Logitech MX Master 3", price: 120, unit: "pcs" },
  { name: "Headphones", description: "Sony WH-1000XM5", price: 400, unit: "pcs" }
];

const run = async () => {
  const client = await login();

  for (const item of items) {
    const res = await client.post("/api/item/create", item);
    console.log("Created item:", res.data.result.name);
  }
};

run();
