import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CheckoutForm from "./components/CheckoutForm";
import { useGetInvoiceByIdQuery } from "../../lib/redux/Query"; 

export default function PaymentPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError } = useGetInvoiceByIdQuery(id);

  const handleBack = () => navigate("/dashboard/invoices");

  if (isLoading) return <div className="p-8">Loading invoice details...</div>;
  if (isError || !invoice) return <div className="p-8 text-red-500">Error loading invoice!</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button 
        onClick={handleBack} 
        className="mb-6 text-sm text-black font-semibold hover:text-gray-800 flex items-center gap-2 bg-lime-500 p-3 rounded-lg"
      >
        <span>&larr;</span> Back to Invoices
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Complete Your Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-sky-950 p-6 rounded-xl border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white">Invoice ID</span>
              <span className="font-mono font-medium text-white">{invoice._id}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white">Billing Period</span>
              <span className="font-medium text-white">
                {new Date(invoice.billingPeriodStart).toLocaleDateString()} - {new Date(invoice.billingPeriodEnd).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white">Usage (kWh)</span>
              <span className="font-medium text-white">{invoice.totalEnergyGenerated?.toFixed(2)} kWh</span>
            </div>

            <hr className="border-gray-300 my-4" />

            <div className="flex justify-between items-center text-lg font-bold text-white">
              <span>Total Amount</span>
              <span>${Number(invoice.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {invoice.status === 'PAID' ? (
             <div className="text-center text-green-600 py-10 flex flex-col items-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-bold">Already Paid!</h3>
                <p className="text-gray-500">This invoice has already been settled.</p>
             </div>
          ) : (
            <CheckoutForm invoiceId={id} />
          )}
        </div>

      </div>
    </div>
  );
}