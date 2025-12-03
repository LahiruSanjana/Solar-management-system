import { useParams, useNavigate } from "react-router-dom";
import { useGetAllSolarUnitsQuery } from "../../../lib/redux/Query";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import Viewpage from "./Viewpage";

const SolarUnitView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: solarUnits, isLoading, isError, error } = useGetAllSolarUnitsQuery();
  
  
  // Safely handle the data - check if it's an array
  const solarUnitsArray = Array.isArray(solarUnits) ? solarUnits : [];
  const solarUnit = solarUnitsArray.find(solarUnit => solarUnit._id === id);
  console.log("Solar Unit ID from URL:", id);
  console.log("Fetched Solar Units:", solarUnit?._id);
  console.log("Viewing Solar Unit:", solarUnit);
  console.log("All Solar Units:", solarUnitsArray);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div role="status" aria-label="Loading" className="flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-xl font-semibold text-gray-900">Error loading solar unit</p>
          <p className="text-gray-600 mt-2">{error?.toString()}</p>
          <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!solarUnit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-xl font-semibold text-gray-900">Solar unit not found</p>
          <p className="text-gray-600 mt-2">The requested solar unit does not exist.</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  return (
      <div>
        <Viewpage solarUnit={solarUnit}  />
      </div>
  );
};

export default SolarUnitView;