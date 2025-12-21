import express from 'express';
import {
   getMyInvoices,
   getInvoiceById,
   getAllInvoices
} from '../application/Invoices';
import authenticationMiddleware from "./middlware/authentication-middlware";
import authorizationMiddleware from "./middlware/authorization-middlware";

export const invoiceRouter  = express.Router();
invoiceRouter.route("/").get(authenticationMiddleware, getMyInvoices);
invoiceRouter.route("/:id").get(authenticationMiddleware, getInvoiceById);

export const adminInvoiceRouter = express.Router();
adminInvoiceRouter.route("/").get(authenticationMiddleware, authorizationMiddleware, getAllInvoices);