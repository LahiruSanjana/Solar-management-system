import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/lib/redux/Query"; // 1. Import delete hook
import { Loader2, Trash2, Search, UserX } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const UserDetailsTable = () => {
    const [search, setSearch] = useState("");
    const { data: users, isLoading, isError } = useGetAllUsersQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const handleDelete = async (userId) => {
        if(window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteUser(userId).unwrap(); 
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <span className="text-slate-600 font-medium">Loading users...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-red-600 bg-red-50 rounded-xl border border-red-200">
                <UserX className="w-8 h-8 mb-2" />
                <p className="font-semibold">Error loading users.</p>
            </div>
        );
    }

    const filteredUser = Array.isArray(users)
        ? users.filter((user) => {
            const searchTerm = search.toLowerCase();
            return (
                user.email?.toLowerCase().includes(searchTerm) ||
                user.firstname?.toLowerCase().includes(searchTerm) ||
                user.lastname?.toLowerCase().includes(searchTerm)
            );
        })
        : [];

    const getRoleBadgeStyle = (role) => {
        const r = role?.toLowerCase();
        if (r === 'admin') return "bg-blue-100 text-blue-700 border-blue-200";
        if (r === 'editor') return "bg-purple-100 text-purple-700 border-purple-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 border-slate-200 focus:border-blue-500"
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                        Total: {users?.length || 0}
                    </span>
                </div>
            </div>
            {filteredUser.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-600 font-medium text-lg">No users found</p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700 py-4">Full Name</TableHead>
                                <TableHead className="font-semibold text-slate-700">Role</TableHead>
                                <TableHead className="font-semibold text-slate-700">Email Address</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUser.map((user, index) => (
                                <TableRow key={user._id || index} className="hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="font-medium text-slate-700 py-4">
                                        {user.firstname} {user.lastname}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.role)}`}>
                                            {user.role || "User"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            disabled={isDeleting} 
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-all duration-200 disabled:opacity-50"
                                            title="Delete User"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
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
};

export default UserDetailsTable;