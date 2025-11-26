import Datacard from "./Datacard";
import Datachart from "./Datachart";
import { useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import { useUser } from "@clerk/clerk-react";

const DashboardPage = () => {

    const { user } = useUser();
    const { data: solarUnits, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitsByClerkIdQuery(
        user?.id, {
        skip: !user,
    }
    );
    
    if(isLoadingSolarUnit){
        return <div>Loading Solar Units...</div>;
    }
    if(isErrorSolarUnit){
        return <div>Error loading Solar Units: {errorSolarUnit.message}</div>;
    }

    console.log("Solar Units:", solarUnits);

    return (
        <div className="ml-8 mt-4">
            <Datacard />
            <Datachart />
        </div>
    );
}

export default DashboardPage;
