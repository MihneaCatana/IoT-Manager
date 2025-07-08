import express from "express";
import invoiceController from "../controller/invoiceController.js";
const router = express.Router();

router.post("/", invoiceController.createInvoice);

router.get("/", invoiceController.getAllInvoices);

export { router as InvoiceRouter };
