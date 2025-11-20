import { login } from "./login.js";

const run = async () => {
  try {
    const client = await login();

    // Get invoices, clients, and payment modes
    const invoicesRes = await client.get("/api/invoice/list");
    const invoices = invoicesRes.data.result;

    const modesRes = await client.get("/api/paymentmode/list");
    const modes = modesRes.data.result;

    if (!invoices || invoices.length === 0) {
      console.error("❌ No invoices found. Please run seedInvoicesFixed.js first!");
      return;
    }

    const createdPayments = [];
    const currentDate = new Date();

    // Create payments for invoices
    for (let i = 0; i < Math.min(2, invoices.length); i++) {
      const invoice = invoices[i];
      const paymentMode = modes && modes.length > 0 ? modes[0] : null;

      const payment = {
        client: invoice.client._id || invoice.client,
        invoice: invoice._id,
        number: i + 1,
        date: currentDate.toISOString(),
        amount: invoice.total * 0.5, // Pay 50% of invoice
        currency: invoice.currency || "USD",
        paymentMode: paymentMode?._id,
        description: `Partial payment for Invoice #${invoice.number}`
      };

      const res = await client.post("/api/payment/create", payment);
      console.log(`✓ Created Payment #${res.data.result.number} - $${res.data.result.amount} for Invoice #${invoice.number} (ID: ${res.data.result._id})`);
      createdPayments.push(res.data.result);
    }

    console.log(`\n✓ Successfully created ${createdPayments.length} payments`);
    return createdPayments;
  } catch (error) {
    console.error("❌ Error creating payments:", error.response?.data || error.message);
    throw error;
  }
};

run();
