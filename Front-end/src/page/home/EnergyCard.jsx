import { useState } from "react";

const EnergyCard =(props)=>{

    const energyunit='kWh';
    const [isSelected,setIsSelected]=useState(false);

    const handleClick= ()=>{
         setIsSelected(!isSelected);
         
    };

    return(
        <div 
           onClick={handleClick}
           aria-pressed={isSelected}
           className={`relative block w-40 h-36 rounded-lg border shadow-md 
                  transition duration-200 ease-in-out 
                  hover:shadow-xl cursor-pointer focus:outline-none bg-helios-primary
                   ${
                    isSelected
                      ? "outline outline-2 outline-offset-2 outline-blue-300"
                      : ""
                  }
                  ${props.hasAnomaly ? "border-red-500" : "border-gray-300"}`}
        >
                 {props.hasAnomaly && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                        Anomaly
                    </div>
           )}
            <div className="flex flex-col p-6 pb-2 items-center">
                <h3 className="text-white font-semibold font-sans text-sm">{props.day}</h3>
                <p className="text-white text-xs">{props.date}</p>
            </div>
            <div className="p-6 pt-0 ">           
                <div className="flex flex-col items-center">
                    <span
                        className={`block mb-1 text-3xl font-bold ${
                        props.hasAnomaly ? "text-red-600" : "text-lime-500"
                            }`}
                        >
                        {props.energy}
                    </span>
                    <p className="text-sm font-medium text-white">{energyunit}</p>
                </div>
            </div>
        </div>
    );
}

export default EnergyCard;