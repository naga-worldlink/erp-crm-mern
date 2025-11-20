import { login } from "./login.js";

const paymentModes = [
  {
    name: "Cash",
    description: "Cash payment",
    isDefault: true
  },
  {
    name: "Credit Card",
    description: "Credit card payment",
    isDefault: false
  },
  {
    name: "Bank Transfer",
    description: "Direct bank transfer",
    isDefault: false
  },
  {
    name: "PayPal",
    description: "PayPal payment",
    isDefault: false
  },
  {
    name: "Check",
    description: "Check payment",
    isDefault: false
  }
];

const run = async () => {
  try {
    const client = await login();
    const createdModes = [];

    for (const mode of paymentModes) {
      const res = await client.post("/api/paymentmode/create", mode);
      console.log(`✓ Created Payment Mode: ${res.data.result.name} (ID: ${res.data.result._id})`);
      createdModes.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdModes.length} payment modes`);
    return createdModes;
  } catch (error) {
    console.error("❌ Error creating payment modes:", error.response?.data || error.message);
    throw error;
  }
};

run();
