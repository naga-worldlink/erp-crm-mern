import { login } from "./login.js";

const products = [
  { name: "Laptop", description: "Dell XPS", salePrice: 1500 },
  { name: "Mouse", description: "Logitech MX Master", salePrice: 120 },
  { name: "Keyboard", description: "Mechanical Keyboard", salePrice: 180 }
];

const run = async () => {
  const client = await login();

  for (const p of products) {
    const res = await client.post("/api/product/create", p);
    console.log("Created Product:", res.data.result.name);
  }
};

run();
