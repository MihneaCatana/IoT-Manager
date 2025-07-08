import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Pending", "Overdue"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
