import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetSolarUnitsByClerkIdQuery, useGetAllSolarUnitsQuery, useDeleteSolarUnitMutation } from "@/lib/redux/Query";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const SolarUnitDetailsTable = () => {
    const Navigate = useNavigate();
    const [search, setSearch] = useState("");
    const { data: solarUnits, isLoading, isError, refetch } = useGetAllSolarUnitsQuery();
    const [deleteSolarUnit, { isLoading: isDeleting }] = useDeleteSolarUnitMutation();


    const handleDelete = async (_id, serialNumber) => {
        if (window.confirm(`Are you sure you want to delete solar unit ${serialNumber}? This action cannot be undone.`)) {
            try {
                await deleteSolarUnit(_id).unwrap();
                toast.success("Solar unit deleted successfully", {
                    description: `${serialNumber} has been removed from the system.`,
                });
                refetch();
            } catch (error) {
                toast.error("Failed to delete solar unit", {
                    description: error?.data?.message || "An error occurred while deleting the unit.",
                });
            }
        }
    };

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
    const filteredSolarUnits = Array.isArray(solarUnits)
        ? solarUnits.filter((unit) =>
            unit.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
            unit.status.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <div className="space-y-4">
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
                        {filteredSolarUnits.length} of {solarUnits?.length || 0} units
                    </span>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700
                 hover:to-blue-800 text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all 
                 duration-300 font-semibold flex items-center gap-2 group"
                    onClick={() => Navigate('/admin/solar-units')}
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Add New Solar Unit
                </Button>
            </div>
            {filteredSolarUnits.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-slate-500 text-lg">No solar units found</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {search ? "Try adjusting your search criteria" : "No solar units available"}
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Serial Number</TableHead>
                                <TableHead className="font-bold text-slate-700">Capacity</TableHead>
                                <TableHead className="font-bold text-slate-700">Status</TableHead>
                                <TableHead className="font-bold text-slate-700">Installation Date</TableHead>
                                <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSolarUnits.map((unit, index) => (
                                <TableRow key={unit._id || index} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-semibold text-slate-900">
                                        {unit.serialNumber}
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {unit.capacity} kW
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${unit.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                unit.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {unit.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {unit.installationDate
                                            ? new Date(unit.installationDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                                                onClick={() => Navigate(`/admin/solar-units/view/${unit._id}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="bg-red-600 hover:bg-red-700 flex items-center gap-1"
                                                onClick={() =>handleDelete(unit._id, unit.serialNumber)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
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
export default SolarUnitDetailsTable;