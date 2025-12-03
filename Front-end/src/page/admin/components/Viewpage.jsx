import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Zap,
  MapPin,
  Activity,
  Settings,
  AlertCircle,
  CheckCircle,
  Wrench,
  TrendingUp,
  Battery,
  User
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import Datacard from "../../dashboard/Datacard";
import Datachart from "../../dashboard/Datachart";
import { useGetSolarUnitsByClerkIdQuery } from "@/lib/redux/Query";

const Viewpage = ({ solarUnit = {} }) => {
  const navigate = useNavigate();

  const formatDate = (dateValue, formatStr = 'PPP') => {
    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
      return isValid(date) ? format(date, formatStr) : 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const { data: solarUnits, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitsByClerkIdQuery();
  console.log("Viewpage SolarUnits:", solarUnits?._id);
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

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          bgGradient: 'from-green-50 to-emerald-50'
        };
      case 'INACTIVE':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          bgGradient: 'from-red-50 to-rose-50'
        };
      case 'MAINTENANCE':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <Wrench className="h-5 w-5 text-orange-600" />,
          bgGradient: 'from-orange-50 to-amber-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <Activity className="h-5 w-5 text-gray-600" />,
          bgGradient: 'from-gray-50 to-slate-50'
        };
    }
  };
  console.log("Viewpage SolarUnit:", solarUnit);
  if (!solarUnit || !solarUnit._id) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
        <div className="text-red-500 text-2xl mb-4">No solar unit data available</div>
        <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-56 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(solarUnit?.status);
  return (
    <div className="bg-slate-300 pb-8">
      <div className="flex flex-row justify-around  ">
        <div className="flex flex-row gap-4 items-center p-6 ">
          <Button
            variant="ghost"
            className="mb-4 flex items-center justify-center gap-2 text-gray-900 bg-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex flex-col">
            <span className="text-4xl font-bold">Solar Unit Details</span>
            <span className="text-sm text-gray-500">Comprehensive overview of the selected solar unit</span>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center gap-2">
          <Button
            variant="ghost"
            className={"flex items-center bg-blue-700 gap-2 px-4 py-2 rounded-lg font-semibold border "}>
            <Settings className="h-6 w-full text-black " />
            <span className="flex">Edit Details</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center px-28 mx-36 bg-white py-6 rounded-xl shadow-md">
        <div className="flex flex-row gap-4 ">
          {statusConfig.icon}
          <div className="flex flex-col">
            <span>Current Status</span>
            <span className="text-2xl font-bold">{solarUnit?.status ?? 'Unknown'}</span>
          </div>
        </div>
        <div className={`${statusConfig.color} border p-2 px-6 font-bold rounded-3xl `}>
          <span >{solarUnit?.status ?? 'Unknown'}</span>
        </div>
      </div>
      <div className="mt-4 mx-28 flex flex-row gap-2">
        <div className="p-8 w-8/12">
          <div className="bg-indigo-700 p-4 rounded-t-2xl ">
            <div className="flex flex-row gap-3 items-center">
              <Battery className="h-6 w-6 text-white" />
              <span className="text-3xl font-bold ml-2 text-white">Basic Information</span>
            </div>
            <span className="text-gray-300 text-base">Core details about this solar unit</span>
          </div>
          <div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 bg-white p-6 rounded-b-2xl border-t-4 border-indigo-700">
              <div >
                <span className="text-base ">Serial Number</span>
                <div className="bg-green-300 p-4 rounded-2xl border-b-2 border-l-2 border-r-2 border-slate-200">
                  <span className="text-xl font-bold">{solarUnit?.serialNumber || 'N/A'}</span>
                </div>
              </div>
              <div>
                <span>Installation Date</span>
                <div className="bg-blue-300 p-4 rounded-2xl border-b-2 border-l-2 border-r-2 border-slate-200">
                  <span className="text-xl font-bold">
                    <Calendar className="h-5 w-5 text-gray-600 inline-block mr-2" />
                    {formatDate(solarUnit?.installationDate)}</span>
                </div>
              </div>
              <div>
                <span>Capacity</span>
                <div className="bg-orange-300 p-4 rounded-2xl border-b-2 border-l-2 border-r-2 border-slate-200">
                  <span className="text-xl font-bold">
                    <Zap className="h-5 w-5 text-orange-700 font-bold inline-block mr-2" />
                    {solarUnit?.capacity ? `${solarUnit.capacity} kW` : 'N/A'}</span>
                </div>
              </div>
              <div>
                <span>User ID</span>
                <div className="bg-purple-300 p-4 rounded-2xl border-b-2 border-l-2 border-r-2 border-slate-200">
                  <span className="text-xl font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-800" /> {solarUnit?.userId || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 w-2/6">
          <div className="bg-green-700 p-4 rounded-t-2xl">
            <span>
              <Activity className="h-6 w-6 text-white inline-block mr-2" />
              <span className="text-3xl text-white  font-bold ml-2">Performance Metrics</span>
            </span>
          </div>
          <div className="bg-white p-6 rounded-b-2xl border-t-4 border-green-700">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Panel Condition</span>
                <span className="text-sm font-semibold text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Inverter Status</span>
                <span className="text-sm font-semibold text-green-600">Optimal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Battery Health</span>
                <span className="text-sm font-semibold text-yellow-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-36 ">
        <div className="bg-gradient-to-r from-purple-700 to-rose-600 p-6 rounded-t-2xl mt-6 shadow-lg">
          <TrendingUp className="h-8 w-8 text-white inline-block mr-2" />
          <span className="text-3xl text-white font-bold ml-2">Energy Production Overview</span>
        </div>
        <div className="bg-white p-6 rounded-b-2xl shadow-lg">
          <Datacard
            solarUnitId={solarUnit?._id}
            title="Last 7 Days Energy Production"
          />
          <div className="mt-6">
            <Datachart
              solarUnitId={solarUnit?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Viewpage;