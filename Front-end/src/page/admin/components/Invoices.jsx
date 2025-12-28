import { useGetAllInvoicesQuery } from '../../../lib/redux/Query';
import { useState } from 'react';
import { FileText, CircleCheck, Hourglass, Search } from 'lucide-react';
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

const Invioices = () => {

    const [search, setSearch] = useState("");
    const { data: Invoices, isLoading, isError, error } = useGetAllInvoicesQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const filteredInvoices = Invoices?.filter((invoice) =>
        invoice._id?.toLowerCase().includes(search.toLowerCase()) ||
        invoice.paymentStatus?.toLowerCase().includes(search.toLowerCase()) ||
        (invoice.userId?.email && invoice.userId.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-4 p-4 bg-slate-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                {/* All Invoices Card */}
                <Card className="bg-gradient-to-br from-sky-950 to-slate-900 border-sky-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-sky-200">All Invoices</CardTitle>
                        <div className="p-2 bg-sky-900/50 rounded-full">
                            <FileText className='w-5 h-5 text-sky-400' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-1">{Invoices?.length || 0}</div>
                        <p className="text-xs text-sky-300/60">
                            Total invoices generated so far
                        </p>
                    </CardContent>
                </Card>

                {/* Paid Invoices Card */}
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

                {/* Unpaid Invoices Card */}
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
                        <p className="text-xs text-orange-300/60">
                            Action needed for these invoices
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center py-4 ">
                <Input
                    placeholder="Filter by email, status or ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm rounded-full relative"
                />
                <Search className='absolute right-4' />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-sky-800 text-white">
                        <TableRow className='flex justify-between'>
                            <TableHead>User Email</TableHead>
                            <TableHead>Billing Period</TableHead>
                            <TableHead>Total Energy (kWh)</TableHead>
                            <TableHead>Paid At</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices?.length ? (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice._id} className="hover:bg-slate-100 flex justify-between bg-sky-950 text-white">
                                    <TableCell>{invoice.userId?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        {new Date(invoice.billingPeriodEnd).toLocaleDateString()} - {new Date(invoice.billingPeriodStart).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{invoice.totalEnergyGenerated}</TableCell>
                                    <TableCell>{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "Unpaid"}</TableCell>
                                    <TableCell>
                                        {invoice.paymentStatus === "PAID" ? (
                                            <div className='text-green-800 bg-green-200 font-bold px-4 py-2 rounded-md'>PAID</div>
                                        ) : invoice.paymentStatus === "UNPAID" ? (
                                            <div className='text-red-800 bg-red-200 font-bold px-4 py-2 rounded-md'>UNPAID</div>
                                        ) : (
                                            <div className='text-yellow-800 bg-yellow-200 font-bold px-4 py-2 rounded-md'>PENDING</div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No results.
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