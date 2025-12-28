import { useGetAllInvoicesQuery } from '../../../lib/redux/Query';
import { useState } from 'react';
import { FileText, CircleCheck, Hourglass, Search, Eye, Download } from 'lucide-react'; // Added icons
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card"
import { Button } from "../../../components/ui/button" // Assuming you have a button component

const Invioices = () => {

    const [search, setSearch] = useState("");
    const { data: Invoices, isLoading, isError, error } = useGetAllInvoicesQuery();

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading invoices...</div>;
    }
    if (isError) {
        return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;
    }

    const filteredInvoices = Invoices?.filter((invoice) =>
        invoice._id?.toLowerCase().includes(search.toLowerCase()) ||
        invoice.paymentStatus?.toLowerCase().includes(search.toLowerCase()) ||
        (invoice.userId?.email && invoice.userId.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
            
            {/* --- Summary Cards Section --- */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* All Invoices */}
                <Card className="bg-gradient-to-br from-sky-950 to-slate-900 border-sky-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-sky-200">All Invoices</CardTitle>
                        <div className="p-2 bg-sky-900/50 rounded-full">
                            <FileText className='w-5 h-5 text-sky-400' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-1">{Invoices?.length || 0}</div>
                        <p className="text-xs text-sky-300/60">Total invoices generated</p>
                    </CardContent>
                </Card>

                {/* Paid Invoices */}
                <Card className="bg-gradient-to-br from-sky-950 to-slate-900 border-sky-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-lime-200">Paid Invoices</CardTitle>
                        <div className="p-2 bg-lime-900/30 rounded-full">
                            <CircleCheck className='w-5 h-5 text-lime-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-lime-400 mb-1">
                            {Invoices?.filter(inv => inv.paymentStatus === "PAID").length || 0}
                        </div>
                        <p className="text-xs text-lime-300/60 flex items-center gap-1">
                            <span className="font-semibold">+10%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Unpaid Invoices */}
                <Card className="bg-gradient-to-br from-sky-950 to-slate-900 border-sky-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-200">Unpaid Invoices</CardTitle>
                        <div className="p-2 bg-orange-900/30 rounded-full">
                            <Hourglass className='w-5 h-5 text-orange-500' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-400 mb-1">
                            {Invoices?.filter(inv => inv.paymentStatus === "UNPAID" || inv.status === "Pending").length || 0}
                        </div>
                        <p className="text-xs text-orange-300/60">Action needed</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- Filters & Search --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Invoice History</h2>
                <div className="relative w-full md:w-80">
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                    <Input
                        placeholder="Search by email, status or ID..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="pl-10 rounded-full border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                    />
                </div>
            </div>

            {/* --- Main Table --- */}
            <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">User Email</TableHead>
                            <TableHead className="font-semibold text-slate-700">Billing Period</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-center">Energy (kWh)</TableHead>
                            <TableHead className="font-semibold text-slate-700">Paid At</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices?.length ? (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice._id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                    <TableCell className="font-medium text-slate-700">
                                        {invoice.userId?.email || "Unknown User"}
                                        <div className="text-xs text-slate-400 font-normal">{invoice._id}</div>
                                    </TableCell>
                                    
                                    <TableCell className="text-slate-600">
                                        <div className="flex flex-col text-xs">
                                            <span>Start: {new Date(invoice.billingPeriodStart).toLocaleDateString()}</span>
                                            <span>End: {new Date(invoice.billingPeriodEnd).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center font-bold text-slate-700">
                                        {invoice.totalEnergyGenerated}
                                    </TableCell>
                                    
                                    <TableCell className="text-slate-600 text-sm">
                                        {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "-"}
                                    </TableCell>
                                    
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                            ${invoice.paymentStatus === "PAID" 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                : invoice.paymentStatus === "UNPAID"
                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}>
                                            {invoice.paymentStatus === "PAID" && <CircleCheck className="w-3 h-3 mr-1" />}
                                            {invoice.paymentStatus}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="w-8 h-8 mb-2 opacity-50" />
                                        <p>No invoices found matching your search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Invioices;