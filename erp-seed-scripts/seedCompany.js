import { login } from "./login.js";

const company = {
  name: "My Demo Company",
  email: "company@example.com",
  phone: "1234567890",
  address: "123 Business St",
  city: "Hyderabad",
  country: "India"
};

const run = async () => {
  const client = await login();

  const res = await client.post("/api/company/create", company);
  console.log("Created Company:", res.data.result.name);
};

run();
