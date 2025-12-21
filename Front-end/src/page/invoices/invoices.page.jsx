import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyinvoicesQuery } from '../../lib/redux/Query'; 

const InvoicesPage = () => {
  const navigate = useNavigate();
  
  const [filterStatus, setFilterStatus] = useState('All');

  const { data: invoices, isLoading, isError, error } = useGetMyinvoicesQuery();
  console.log("Fetched Invoices:", invoices);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const filteredInvoices = invoices?.filter((invoice) => {
    if (filterStatus === 'All') return true;
    return invoice.paymentStatus?.toUpperCase() === filterStatus.toUpperCase();
  });

  const handlePayNow = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}/pay`);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500 animate-pulse">Invoices Load...</div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-4 m-6 text-red-600 bg-red-100 rounded-md border border-red-200">
        Error loading invoices: {error?.data?.error || 'Something went wrong'}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Invoices</h1>
        <div className="mt-4 md:mt-0 flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['All', 'PENDING', 'PAID'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                filterStatus === status
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'All' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      {filteredInvoices?.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-slate-900 rounded-xl border border-dashed border-gray-300">
          No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} invoices found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <div 
              key={invoice._id} 
              className="bg-slate-900 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-white uppercase tracking-wide">Billing Period</p>
                    <p className="font-semibold text-white text-sm">
                        {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      invoice.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-white">Unit Serial</span>
                    <span className="font-medium text-white">{invoice.solarUnitId?.serialNumber || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-white">Generated</span>
                    <span className="font-medium text-white">{invoice.totalEnergyGenerated?.toFixed(2)} kWh</span>
                  </div>
                </div>
              </div>
              {invoice.paymentStatus === 'PENDING' ? (
                <button
                  onClick={() => handlePayNow(invoice._id)}
                  className="w-full bg-lime-500 hover:bg-lime-600 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Pay Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-50 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed border border-gray-200"
                >
                  {invoice.paidAt ? `Paid on ${formatDate(invoice.paidAt)}` : 'Paid'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;