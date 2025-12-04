import imageTurbine_4 from "./wind-turbine-4.png";
import { Triangle } from "lucide-react";
import { Zap } from "lucide-react";
import DetailsCard from "../DetailsCard";

const Solution = () => {
    const solutionDetails = [
        {details:"Real-time energy tracking",iconColor:"text-lime-400",textColor:"text-white"},
        {details:"Anomaly alerts" ,iconColor:"text-lime-400",textColor:"text-white"},
        {details:"Historical performance reports" ,iconColor:"text-lime-400",textColor:"text-white"},
        {details:"Remote diagnostics & support", iconColor:"text-lime-400",textColor:"text-white"},
    ]
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-10">
      {/* Image / Visual */}
      <div className="relative w-full lg:w-1/2">
        <img
          className="w-full h-auto rounded-3xl object-cover max-h-[420px] md:max-h-[540px] lg:max-h-[750px]"
          src={imageTurbine_4}
          alt="Turbine Wind"
        />
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-16 z-10 w-20 h-20 md:w-28 md:h-28 bg-sky-600 p-2 md:p-4 rounded-2xl flex flex-col items-center justify-center">
          <Triangle className="fill-current text-white w-6 h-6 md:w-10 md:h-10" />
          <span className="text-white font-sans text-sm md:text-2xl font-semibold mt-1 md:mt-2">Aelora</span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 bg-sky-600 rounded-3xl px-6 md:px-12 py-8 md:py-20 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center p-2 w-max bg-lime-400 rounded-xl gap-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-sans text-sm md:text-lg font-semibold">Solution</span>
          </div>

          <h1 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white leading-tight py-6 md:py-8 max-w-xl">
            The Solar Home Dashboard empowers you to monitor your solar panels, receive instant alerts for anomalies, and optimize your energy usage for maximum savings and peace of mind.
          </h1>
        </div>

        <div className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solutionDetails.map((e1) => (
              <DetailsCard
                key={e1.details}
                details={e1.details}
                iconColor={e1.iconColor}
                textColor={e1.textColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;
