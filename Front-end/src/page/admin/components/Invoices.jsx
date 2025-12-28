import { useGetAllInvoicesQuery } from '../../../lib/redux/Query';
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import { Input } from "../../../components/ui/input"
import Tab from '@/page/home/Tab';

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
        invoice._id.toLowerCase().includes(search.toLowerCase()) ||
        invoice.paymentStatus.toLowerCase().includes(search.toLowerCase()) ||
        invoice.userId?.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4 p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Tab title="All Invoices" value={Invoices?.length || 0} />
                <Tab title="Paid Invoices" value={Invoices?.filter(inv => inv.paymentStatus === "PAID").length || 0} />
                <Tab title="Unpaid Invoices" value={Invoices?.filter(inv => inv.paymentStatus === "UNPAID").length || 0} />
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by email, status or ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
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
                                <TableRow key={invoice._id}>
                                    <TableCell>{invoice.userId?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        {new Date(invoice.billingPeriodEnd).toLocaleDateString()} - {new Date(invoice.billingPeriodStart).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{invoice.totalEnergyGenerated}</TableCell>
                                    <TableCell>{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "Unpaid"}</TableCell>
                                    <TableCell>
                                        {invoice.paymentStatus === "PAID" ? (
                                            <div className='text-green-600 font-bold px-4 py-2 rounded-md'>PAID</div>
                                        ) : invoice.paymentStatus === "UNPAID" ? (
                                            <div className='text-red-600 font-bold px-4 py-2 rounded-md'>UNPAID</div>
                                        ) : (
                                            <div className='text-yellow-600 font-bold px-4 py-2 rounded-md'>PENDING</div>
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