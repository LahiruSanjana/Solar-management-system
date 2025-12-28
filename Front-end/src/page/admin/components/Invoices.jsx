import { useGetAllInvoicesQuery } from '../../../lib/redux/Query';
import { useState } from 'react';
import {FileText,CircleCheck,Hourglass,Search} from 'lucide-react';
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
        <div className="space-y-4 p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-sky-950 text-lime-500 rounded-lg shadow-lg hover:bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">All Invoices</CardTitle>
                        <FileText className='w-6 h-6 text-blue-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Invoices?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-sky-950 text-lime-500 rounded-lg shadow-lg hover:bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>\
                        <CircleCheck className='w-6 h-6 text-green-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Invoices?.filter(inv => inv.paymentStatus === "PAID").length || 0}</div>
                    </CardContent>
                </Card>
                <Card className='bg-sky-950 text-lime-500 rounded-lg shadow-lg hover:bg-white'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
                        <Hourglass className='w-6 h-6 text-orange-600'/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Invoices?.filter(inv => inv.paymentStatus === "UNPAID").length || 0}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex items-center py-4 relative">
                <Input
                    placeholder="Filter by email, status or ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm rounded-full"
                />
                <Search className='absolute right-4'/>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className='flex gap-8'>
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
                                <TableRow key={invoice._id} className="hover:bg-slate-100 flex gap-8">
                                    <TableCell>{invoice.userId?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        {new Date(invoice.billingPeriodEnd).toLocaleDateString()} - {new Date(invoice.billingPeriodStart).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{invoice.totalEnergyGenerated}</TableCell>
                                    <TableCell>{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "Unpaid"}</TableCell>
                                    <TableCell>
                                        {invoice.paymentStatus === "PAID" ? (
                                            <div className='text-green-700 bg-green-300 font-bold px-4 py-2 rounded-md'>PAID</div>
                                        ) : invoice.paymentStatus === "UNPAID" ? (
                                            <div className='text-red-700 bg-red-300 font-bold px-4 py-2 rounded-md'>UNPAID</div>
                                        ) : (
                                            <div className='text-yellow-600 bg-yellow-300 font-bold px-4 py-2 rounded-md'>PENDING</div>
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