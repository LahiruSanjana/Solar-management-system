import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { Invoice } from "../infrastructure/entities/Invoice";
import { User } from "../infrastructure/entities/User"; 

export const getMyInvoices = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
        return res.status(404).json({ error: "User not found in database" });
    }

    const invoices = await Invoice.find({ userId: user._id })
      .sort({ createdAt: -1 }) 
      .populate("solarUnitId", "serialNumber capacity"); 

    res.status(200).json(invoices);

  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("solarUnitId");

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = {};
    
    if (status) {
        query.paymentStatus = status;
    }

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .populate("solarUnitId", "serialNumber capacity")
      .populate("userId", "firstname lastname email"); 
      
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};