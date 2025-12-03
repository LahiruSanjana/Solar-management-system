import { useGetEnergyGenerationRecordsQuery, useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import {  toDate, format } from "date-fns";

const Datacard = ({ title = "Data Overview", solarUnitId }) => {
  const { data = [], error, isLoading, isError } =
    useGetEnergyGenerationRecordsQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: 7
    }, {
      skip: !solarUnitId
    });
  
  const energyGenerationRecords = (data || []).slice(0, 7).map((e1) => ({
    date: format(toDate(e1._id.date), 'MMM d'),
    energy: e1.totalEnergy.toFixed(2),
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

  return (
    <div className="datacard ">
      

      <div className="rounded-md bg-slate-50 p-5 mt-4 mr-4">
        <h1 className="text-xl font-semibold text-black">Last 7 Days Energy Consumption</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {energyGenerationRecords.map((record) => (
            <div
              key={record.date}
              className="bg-gray-200 p-4 rounded-md shadow flex items-center justify-center mt-4 hover:bg-gray-400 transition-colors"
            >
              <div>
                <h3 className="text-sm font-semibold text-center text-gray-600">{record.date}</h3>
                <p className="font-bold text-black text-lg">{record.energy} kWh</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Datacard;