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
import SolarEnergyProduction from "@/page/home/SolarEnergyProduction";
import Editdetails from "../Editdetails";

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
  console.log("Solar Units Data:", solarUnits);
  if (!solarUnits) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
        <div className="text-red-500 text-2xl mb-4">No solaryyy available</div>
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
    <div className="bg-slate-50 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start gap-96 py-6">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              className="flex items-start  gap-2 text-gray-900 bg-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-bold">Solar Unit Details</span>
              <span className="text-sm text-gray-500">Comprehensive overview of the selected solar unit</span>
            </div>
          </div>

          
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white py-6 px-6 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{statusConfig.icon}</div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Current Status</span>
              <span className="text-2xl font-bold">{solarUnit?.status ?? 'Unknown'}</span>
            </div>
          </div>

          <div className={`mt-4 md:mt-0 inline-flex items-center ${statusConfig.color} border p-2 px-6 font-bold rounded-3xl`}>
            <span>{solarUnit?.status ?? 'Unknown'}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-helios-primary p-4 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Battery className="h-6 w-6 text-white" />
                <span className="text-2xl md:text-3xl font-bold text-white">Basic Information</span>
              </div>
              <span className="text-gray-200 text-sm">Core details about this solar unit</span>
                          <div className="mt-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border bg-helios-primary text-white hover:bg-white"
              onClick={() => navigate(`/admin/Editdetails/${solarUnit?._id}`)}
            >
              <Settings className="h-5 w-5 text-white" />
              <span>Edit Details</span>
            </Button>
          </div>
            </div>

            <div className="bg-white p-6 rounded-b-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-600">Serial Number</span>
                  <div className="mt-2 bg-helios-primary/5 p-4 rounded-2xl border border-slate-100">
                    <span className="text-lg md:text-xl font-bold text-gray-900">{solarUnit?.serialNumber || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Installation Date</span>
                  <div className="mt-2 bg-helios-primary/5 p-4 rounded-2xl border border-slate-100 flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 inline-block mr-2" />
                    <span className="text-lg md:text-xl font-bold">
                      {formatDate(solarUnit?.installationDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Capacity</span>
                  <div className="mt-2 bg-helios-primary/5 p-4 rounded-2xl border border-slate-100 flex items-center">
                    <Zap className="h-5 w-5 text-orange-700 inline-block mr-2" />
                    <span className="text-lg md:text-xl font-bold">
                      {solarUnit?.capacity ? `${solarUnit.capacity} kW` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-600">User ID</span>
                  <div className="mt-2 bg-helios-primary/5 p-4 rounded-2xl border border-slate-100 flex items-center">
                    <User className="h-5 w-5 text-purple-800 inline-block mr-2" />
                    <span className="text-lg md:text-xl font-bold">{solarUnit?.userId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-helios-primary p-4 rounded-t-2xl">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-white inline-block mr-2" />
                <span className="text-xl text-white font-bold">Performance Metrics</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-b-2xl border border-slate-200">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Panel Condition</span>
                  <span className="text-sm font-semibold text-green-600">Excellent</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Inverter Status</span>
                  <span className="text-sm font-semibold text-green-600">Optimal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Battery Health</span>
                  <span className="text-sm font-semibold text-yellow-600">Good</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="mt-6">
          <div className="bg-helios-primary p-6 rounded-t-2xl shadow-md">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-white inline-block mr-2" />
              <span className="text-2xl text-white font-bold">Energy Production Overview</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-b-2xl shadow-md border border-slate-200">
            <SolarEnergyProduction solarUnitId={solarUnit?._id}  />
            <div className="mt-6">
              <Datachart solarUnitId={solarUnit?._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Viewpage;