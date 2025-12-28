import { useGetEnergyGenerationRecordsQuery, useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import {  toDate, format } from "date-fns";
import { analyzeDailyPatterns } from "../../lib/redux/AnomalyDetection";
import { AlertTriangle, CheckCircle, AlertOctagon, CloudRain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Datacard = ({ title = "Data Overview", solarUnitId }) => {
  const { data = [], error, isLoading, isError } =
    useGetEnergyGenerationRecordsQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: 7
    }, {
      skip: !solarUnitId
    });
  const analyzedData = analyzeDailyPatterns(data || []);

  const energyGenerationRecords = analyzedData.slice(0, 7).map((e1) => ({
    date: format(toDate(e1._id.date), 'MMM d'),
    energy: e1.totalEnergy.toFixed(2),
    status: e1.status,
    anomalyMessage: e1.anomalyMessage,
    hasAnomaly: e1.hasAnomaly,
    anomalyType: e1.anomalyType
  }));

  if (isLoading) return <div>Loading energy data...</div>;
  if (isError) return <div>Error loading energy data</div>;
  if (energyGenerationRecords.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
        <div className="text-red-500 text-2xl mb-4">No energy data available</div>
        <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-56 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-100 border-red-300 hover:bg-red-200';
      case 'WARNING': return 'bg-orange-100 border-orange-300 hover:bg-orange-200';
      case 'INFO': return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      default: return 'bg-gray-200 border-transparent hover:bg-gray-300';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'HARDWARE_FAILURE': return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case 'LOW_PRODUCTION_DAY': return <CloudRain className="h-4 w-4 text-orange-600" />;
      case 'FROZEN_DAILY_DATA': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="datacard ">
      <div className="rounded-md bg-slate-50 p-5 mt-4 mr-4">
        <h1 className="text-xl font-semibold text-black">Last 7 Days Energy Consumption</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {energyGenerationRecords.map((record) => (
            <TooltipProvider key={record.date}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`p-4 rounded-md shadow flex flex-col items-center justify-center mt-4 transition-colors border-2 cursor-help ${getStatusColor(record.status)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-center text-gray-600">{record.date}</h3>
                      {record.hasAnomaly && getStatusIcon(record.anomalyType)}
                    </div>
                    <p className="font-bold text-black text-lg">{record.energy} kWh</p>
                    {record.hasAnomaly && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/50 mt-2 text-slate-700">
                        {record.status}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {record.hasAnomaly && (
                  <TooltipContent>
                    <p className="font-semibold">{record.anomalyType?.replace(/_/g, ' ')}</p>
                    <p className="text-sm">{record.anomalyMessage}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Datacard;