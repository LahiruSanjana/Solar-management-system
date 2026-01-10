import Stripe from "stripe"; 
import { Request,Response } from "express";
import { Invoice } from "../infrastructure/entities/Invoice";
import { NotFoundError, ValidationError } from "../domen/error/Error";

 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
    const invoice=await Invoice.findById(req.body.invoiceId);
    if (!invoice) {
       throw new NotFoundError("Invoice not found");
    }

    if (invoice.paymentStatus==="PAID") {
        throw new ValidationError("Invoice is already paid");
    }
    
    const session = await stripe.checkout.sessions.create({
        ui_mode:"embedded",
        line_items: [
            {
                price:process.env.STRIPE_PRICE_ID!,
                quantity: Math.round(invoice.totalEnergyGenerated),
            },
        ],
        mode: "payment",
        return_url: `${process.env.FRONTEND_URL}/dashboard/invoices/complete?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            invoiceId: invoice._id.toString(),
        },
    });
    res.json({clientSecret:session.client_secret});
};

export const getSessionStatus = async (req: Request, res: Response) => {
    const session_id  = (req.query.session_id || req.query.sessionId) as string;

    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    res.json({ 
        status: session.status,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
     });
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    // 1. Signature Verifycation
    try {
        event = stripe.webhooks.constructEvent(
            req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2. Event Type 
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const invoiceId = session.metadata?.invoiceId;

        if (invoiceId && session.payment_status === "paid") {
            try {
                // step 1: Find invoice
                const invoice = await Invoice.findById(invoiceId);

                // step 2: Idempotency Check 
                if (!invoice) {
                    console.error(`Invoice not found: ${invoiceId}`);
                    return res.status(404).send("Invoice not found");
                }

                if (invoice.paymentStatus === "PAID") {
                    console.log(`ℹ️ Invoice ${invoiceId} is already paid. Skipping update.`);
                    return res.status(200).json({ received: true });
                }

                // step 3: Update 
                invoice.paymentStatus = "PAID";
                invoice.paidAt = new Date();
                
                await invoice.save();
                console.log(`✅ Invoice ${invoiceId} marked as PAID.`);

            } catch (error) {
                console.error("Database update failed:", error);
                return res.status(500).send("Internal Server Error");
            }
        }
    }

    res.status(200).json({ received: true });
};