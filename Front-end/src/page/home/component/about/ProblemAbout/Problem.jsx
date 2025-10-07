import { TriangleAlert } from "lucide-react";
import imgWind from "./wind-turbine-3.png";
import DetailsCard from "../DetailsCard";
const Problem = () => {
    const problemDetails=[
        {details:"Panel shading or dirt",iconColor:"text-red-500",textColor:"text-gray-500"},
        {details:"Unexpected drop in output",iconColor:"text-red-500",textColor:"text-gray-500"},
        {details:"Inverter errors",iconColor:"text-red-500",textColor:"text-gray-500"},
        {details:"Missed maintenance reminders",iconColor:"text-red-500",textColor:"text-gray-500"},
    ]
    return (
        <div className="px-1 py-10 flex justify-around items-center gap-40">
            <div className="pt-8">
                <div className="flex gap-4">
                <div className="bg-red-500 rounded-lg text-white w-12 h-8 flex justify-center items-center">
                    <TriangleAlert className="w-5 h-5"/>
                </div>
                <span className="flex justify-center items-center font-sans font-semibold text-base">Problem</span>
             </div>
             <h1 className="font-sans font-bold text-4xl leading-snug py-8 opacity-80">
                Home solar systems can face<br />
                reduced efficiency and missed<br />
                savings due to panel shading<br />
                dirt, unexpected drops in<br />
                output, or inverter issues.<br />
                Stay ahead with instant<br />
                anomaly alerts.<br />
             </h1>
             <div >
                {problemDetails.map((e1) => {
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
            <div className="flex">
                <img className="rounded-3xl w-[650px] h-[700px]" src={imgWind} alt="Wind Turbine" />
            </div>
        </div>
    );
}

export default Problem;
