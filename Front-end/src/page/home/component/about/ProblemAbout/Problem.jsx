import { TriangleAlert } from "lucide-react";
import imgWind from "./wind-turbine-3.png";
import DetailsCard from "../DetailsCard";
const Problem = () => {
    const problemDetails = [
        { details: "Panel shading or dirt", iconColor: "text-red-500", textColor: "text-gray-500" },
        { details: "Unexpected drop in output", iconColor: "text-red-500", textColor: "text-gray-500" },
        { details: "Inverter errors", iconColor: "text-red-500", textColor: "text-gray-500" },
        { details: "Missed maintenance reminders", iconColor: "text-red-500", textColor: "text-gray-500" },
    ];

    return (
        <div className="px-4 py-10 flex flex-col md:flex-row items-center md:justify-around gap-8 md:gap-40">
            <div className="w-full md:w-1/2 pt-8">
                <div className="flex items-center gap-3">
                    <div className="bg-red-500 rounded-lg text-white w-10 h-8 flex justify-center items-center">
                        <TriangleAlert className="w-4 h-4" />
                    </div>
                    <span className="font-sans font-semibold text-base">Problem</span>
                </div>

                <h1 className="font-sans font-bold text-2xl md:text-4xl leading-tight md:leading-snug py-6 md:py-8 opacity-90">
                    Home solar systems can face
                    <br className="hidden md:block" />
                    reduced efficiency and missed
                    <br className="hidden md:block" />
                    savings due to panel shading
                    <br className="hidden md:block" />
                    dirt, unexpected drops in
                    <br className="hidden md:block" />
                    output, or inverter issues.
                    <br className="hidden md:block" />
                    Stay ahead with instant
                    <br className="hidden md:block" />
                    anomaly alerts.
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {problemDetails.map((e1) => (
                        <DetailsCard
                            key={e1.details}
                            details={e1.details}
                            iconColor={e1.iconColor}
                            textColor={e1.textColor}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <img
                    className="rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-[650px] h-auto object-cover"
                    src={imgWind}
                    alt="Wind turbine illustration"
                />
            </div>
        </div>
    );
}

export default Problem;
