import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  phn: String,
  street: String,
  paid: Boolean,
  lastPaidDate: Date,
  subscriptionFee: String,
  payments: [
    {
      datePaid: Date, // Date of payment
      amountPaid: Number, // Amount paid
    },
  ],
});

export default mongoose.model("Subscriber", subscriberSchema);
