import { useGetEnvironmentConditionQuery } from "../../lib/redux/Weather";
import { Wind, Droplet, Thermometer,ThermometerSun,Cloudy } from "lucide-react";
import Enviromentcondition from "../../assets/enviromentcondition.jpg";

const Weather = () => {
    const weatherData = [
        { icon: <Wind />, parameter: 'wind_kph', unit: ' m/s', title: 'Wind Speed' },
        { icon: <Droplet />, parameter: 'humidity', unit: '%', title: 'Humidity' },
        { icon: <Thermometer />, parameter: 'temp_c', unit: '°C', title: 'Temperature' },
    ];

    const { data: environmentCondition = {}, error: envError, isLoading: envLoading, isError: envIsError } =
        useGetEnvironmentConditionQuery({
            API_KEY: import.meta.env.VITE_WEATHER_API_KEY
        });

    if (envLoading) return <div>Loading.....</div>;
    if (envIsError) return <div>Error: {envError?.toString()}</div>;
    console.log("Environment Condition Data:", environmentCondition);

    return (
        <div className="w-2/3 max-w-screen-lg mx-auto p-4 mt-4 relative">
            <img
                src={Enviromentcondition}
                alt="Environment Condition"
                className="w-full h-64 sm:h-48 md:h-56 lg:h-[320px] object-cover rounded-lg shadow-md brightness-50"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="bg-white bg-opacity-30 p-3 rounded-t-md shadow-md flex flex-row gap-4">
                    <ThermometerSun className="w-6 h-6 text-white mb-2 flex justify-center items-center" />
                    <h3 className="text-2xl font-semibold text-white">Weather Conditions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 p-4">
                    {weatherData.map((item) => (
                        <div
                            key={item.parameter}
                            className="bg-blue-600 bg-opacity-20 p-3 rounded-md shadow-md flex items-center border-2 border-white"
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
    );
};

export default Weather;
