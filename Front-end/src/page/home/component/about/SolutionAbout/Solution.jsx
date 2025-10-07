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
    <div className="flex gap-4 p-10 ">
      <div className="relative inline-block">
        <img className="w-full h-[750px] rounded-3xl" src={imageTurbine_4} alt="Turbine Wind"  />
        <div className="absolute bottom-10 left-16 z-10 w-28 h-28  bg-sky-600 p-4 rounded-2xl">
            <div className="flex justify-center items-center">
                <Triangle className=" fill-current text-white w-10 h-10" />
            </div>
            <span className="flex justify-center items-center text-white font-sans text-2xl font-semibold ml-2">Aelora</span>
        </div>
      </div>
      <div className="w-1/2 h-[750px] bg-sky-600 rounded-3xl px-12 py-20">
        <div className="flex items-center p-2 w-36 bg-lime-400 rounded-xl gap-4">
            <Zap className=" w-5 h-5" />
            <span className="font-sans text-lg font-semibold">Solution</span>
        </div>
        <div>
            <h1 className="font-sans font-bold text-4xl text-white leading-tight py-8">
                <span>The Solar Home Dashboard</span><br />
                <span>empowers you to monitor</span><br />
                <span>your solar panels, receive</span><br />
                <span>instant alerts for anomalies,</span><br />
                <span>and optimize your energy</span><br />
                <span>usage for maximum savings</span><br />
                <span>and peace of mind.</span><br />
             </h1>
        </div>
        <div>
            {solutionDetails.map((e1) => {
                    return (
                        <DetailsCard
                            key={e1.details}
                            details={e1.details}
                            iconColor={e1.iconColor}
                            textColor={e1.textColor}
                        />
                    );
                })}
        </div>
      </div>
    </div>
  );
};

export default Solution;
