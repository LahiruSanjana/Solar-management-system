import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetAllUsersQuery } from "@/lib/redux/Query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
const UserDetailsTable = () => {
    const [search, setSearch] = useState("");
    const{data:users,isLoading,isError}=useGetAllUsersQuery();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Loading solar units...</span>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-xl border border-red-200">
                Error loading solar units. Please try again.
            </div>
        );
    }
    const filteredUser = Array.isArray(users) 
        ? users.filter((user) =>
            user.email.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Input
                        type="text"
                        placeholder="Search by serial number "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-2xl border-2 border-slate-200 focus:border-blue-500"
                    />
                    <span className="text-sm text-slate-500">
                        {filteredUser.length} of {users?.length || 0} 
                    </span>
                </div>
            </div>

            {/* Table */}
            {filteredUser.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-lg">No user found</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {search ? "Try adjusting your search criteria" : "No solar units available"}
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">First Name</TableHead>
                                <TableHead className="font-bold text-slate-700">Last Name</TableHead>
                                <TableHead className="font-bold text-slate-700">Role</TableHead>
                                <TableHead className="font-bold text-slate-700">Phone No</TableHead>
                                <TableHead className="font-bold text-slate-700">Address </TableHead>
                                <TableHead className="text-right font-bold text-slate-700">email </TableHead>
                                <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUser.map((user, index) => (
                                <TableRow key={user._id || index} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="text-slate-700">
                                        {user.firstname}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block`}>
                                            {user.lastname}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {user.role}
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {user.phoneNo}
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {user.address}
                                    </TableCell>
                                    <TableCell className="text-right">
                                       {user.email}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <button className="text-white bg-blue-600 hover:underline font-medium">
                                            Edit
                                        </button>
                                        <button className="text-white bg-red-600 hover:underline font-medium ml-4">
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
export default UserDetailsTable;