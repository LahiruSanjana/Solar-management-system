import { useGetEnergyGenerationRecordsQuery, useGetSolarUnitsByClerkIdQuery } from "../../lib/redux/Query";
import { useGetEnvironmentConditionQuery } from "../../lib/redux/Weather";
import { subDays, toDate, format } from "date-fns";
import Enviromentcondition from "./enviromentcondition.jpg";
import { Thermometer, Wind, Droplet } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Datacard = ({ title = "Data Overview", solarUnitId }) => {
  const { user } = useUser();

  const weatherData = [
    { icon: <Wind />, parameter: 'wind_kph', unit: 'm/s', title: 'Wind Speed' },
    { icon: <Droplet />, parameter: 'humidity', unit: '%', title: 'Humidity' },
    { icon: <Thermometer />, parameter: 'temp_c', unit: '°C', title: 'Temperature' },
  ];

  const { data, error, isLoading, isError } =
    useGetEnergyGenerationRecordsQuery({
      id: solarUnitId,
      groupBy: "date",
      limit: 7
    });

  const { data: environmentCondition = {}, error: envError, isLoading: envLoading, isError: envIsError } =
    useGetEnvironmentConditionQuery({
      API_KEY: import.meta.env.VITE_WEATHER_API_KEY
    });

  if (isLoading || envLoading ) return (
      <div>Loading.....</div>
    );
  if (isError || envIsError) return <div>Error: {error?.toString() || envError?.toString()}</div>;

  const energyGenerationRecords = data.slice(0, 7).map((e1) => ({
    date: format(toDate(e1._id.date), 'MMM d'),
    energy: e1.totalEnergy.toFixed(2),
  }));

  return (
    <div className="datacard">
      <h2 className="text-4xl font-bold text-black">{user?.firstName}'s Home</h2>
      <p className="text-base text-gray-600">Welcome back to your Solar Energy Dashboard.</p>

      <div className="w-full max-w-screen-lg mx-auto p-4 relative mt-4">
        <img
          src={Enviromentcondition}
          alt="Environment Condition"
          className="w-80 h-64 sm:w-80 sm:h-48 md:w-96 md:h-56 lg:w-[500px] lg:h-[320px] object-cover rounded-lg shadow-md brightness-50"
        />

        <div className="absolute top-4 left-4 bg-white bg-opacity-30 p-3 rounded-md shadow-md mt-6 ml-32">
          <h3 className="text-2xl font-semibold text-white">Weather Conditions</h3>
        </div>

        <div className="absolute bottom-4 ml-9 mb-2">
          <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-8">
            {weatherData.map((item) => (
              <div
                key={item.parameter}
                className="bg-blue-600 bg-opacity-20 p-3 rounded-md shadow-md flex items-center border-2 border-white w-44"
              >
                <div className="bg-slate-400 w-16 h-16 p-2 rounded-md mr-4 flex justify-center items-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {environmentCondition?.current?.[item.parameter]}{item.unit}
                  </p>
                  <p className="text-sm md:text-base text-gray-300 font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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