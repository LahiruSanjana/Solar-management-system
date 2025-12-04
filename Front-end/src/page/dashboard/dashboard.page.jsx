import Datacard from "./Datacard";
import Datachart from "./Datachart";
import { useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import Weather from "./Weather";
import { useUser } from "@clerk/clerk-react";

const DashboardPage = () => {
    const { user } = useUser();
    const { data: solarUnits, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitsByClerkIdQuery();

    if (!solarUnits) {
        return (
            <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
                <div className="text-red-500 text-2xl mb-4">No solar units available</div>
                <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-56 bg-gray-200 rounded"></div>
            </div>
        );
    }
    if (isLoadingSolarUnit) {
        return <div>Loading Solar Units...</div>;
    }
    if (isErrorSolarUnit) {
        return <div>Error loading Solar Units: {errorSolarUnit.message}</div>;
    }
    console.log("Solar Units:", solarUnits);

    return (
        <div className="ml-8 mt-4 bg-slate-50 pb-8">
            <h2 className="text-4xl font-bold text-black">{user?.firstName}'s Home</h2>
            <p className="text-base text-gray-600">Welcome back to your Solar Energy Dashboard.</p>
            <Weather />
            <Datacard
                solarUnitId={solarUnits._id}
                title="Last 7 Days Energy Production"
            />
            <Datachart
                solarUnitId={solarUnits._id}
            />
        </div>
    );
}

export default DashboardPage;
