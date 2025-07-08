// controllers/invoiceController.js
import Invoice from "../model/invoiceModel.js";

const invoiceController = {
  createInvoice: async (req, res) => {
    try {
      const { amount, status, description } = req.body;

      // Basic validation
      if (!amount || !status || !description) {
        return res
          .status(400)
          .json({ message: "Amount, status, and description are required." });
      }

      // Create new invoice
      const invoice = new Invoice({
        amount,
        status,
        description,
      });

      await invoice.save();

      return res.status(201).json({
        message: "Invoice created successfully",
        invoice,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return res
        .status(500)
        .json({ message: "Server error while creating invoice." });
    }
  },

  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching invoices." });
    }
  },
};

export default invoiceController;
