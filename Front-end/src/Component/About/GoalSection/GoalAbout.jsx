import DetailsCard from "../DetailsCard";
import tiger from "./tiger.png";
import solarConstruction from "./solar-construction.jpg";
import { User } from "lucide-react";

const GoalAbout = () => {
    const goal=[
        {details:"Maximize solar energy savings.",iconColor:"text-black",textColor:"text-black"},
        {details:"Detect and resolve issues early.",iconColor:"text-black",textColor:"text-black"},
        {details:"Track daily, weekly, and monthly output.",iconColor:"text-black",textColor:"text-black"},
        {details:"Get notified of anomalies instantly.",iconColor:"text-black",textColor:"text-black"},
    ]
    const need=[
        {details:"A simple dashboard for real-time monitoring.",iconColor:"text-black",textColor:"text-black"},
        {details:"Instant alerts for system anomalies.",iconColor:"text-black",textColor:"text-black"},
        {details:"Easy access to historical performance data.",iconColor:"text-black",textColor:"text-black"},
        {details:"Clear, actionable insights for better energy management.",iconColor:"text-black",textColor:"text-black"},
    ]
    return (
        <div className="flex justify-around items-center px-12 py-8 gap-32 ">
            <div className="inline pl-6">
                <div>
                    <span className="font-sans font-bold text-3xl">Goals:</span>
                    <div>
                        {goal.map((e1) => (
                            <DetailsCard 
                            key={e1.details} 
                            details={e1.details}
                            iconColor={e1.iconColor}
                            textColor={e1.textColor}
                             />
                        ))}
                    </div>
                </div>
                <div>
                    <span className="font-sans font-bold text-3xl">Needs:</span>
                    <div>
                        {need.map((e1) => (
                            <DetailsCard 
                            key={e1.details} 
                            details={e1.details}
                            iconColor={e1.iconColor}
                            textColor={e1.textColor}
                             />
                        ))}
                    </div>
                </div>
                <div className="flex justify-start items-center box-border shadow-2xl border border-gray-200 gap-4 mt-8 p-4 rounded-xl w-[500px] bg-white">
                    <img className="w-12 h-12 rounded-full " src={tiger} alt="Tiger" />
                    <div className="flex justify-evenly items-center gap-24 font-sans">
                        <div className="flex gap-2 ">
                            <span className="text-black font-semibold text-base">Alex P.</span>
                            <span className="text-gray-500">42 y.o. </span>
                        </div>
                        <div className="flex gap-8 ">
                            <span className="text-gray-500">Homeowner</span>
                            <span className="text-black font-semibold text-base">Solar User</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/2 h-[750px] relative inline-block">
                <img className="object-cover w-full h-full rounded-3xl" src={solarConstruction} alt="Solar Construction" />
                <div className="absolute flex top-14 left-10 z-10 w-40 h-12  bg-sky-600 p-4 rounded-2xl">
                    <div className="flex justify-center items-center">
                        <User className=" text-white w-5 h-5" />
                    </div>
                    <span className="flex justify-center items-center text-white font-sans text-1xl font-semibold ml-2">User Profile</span>
                </div>
            </div>
        </div>
    );
}

export default GoalAbout;
