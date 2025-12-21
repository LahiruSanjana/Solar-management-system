import EnergyCard from "./EnergyCard"
const SolarEnergyProductionCards = (props) => {
    if(props.solarData.length===0){
        return(
             <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
                <div className="text-red-500 text-2xl mb-4">No data available</div>
                <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-56 bg-gray-200 rounded"></div>
            </div>
        ); 
    }
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 ">
                 {
                    props.solarData.map((e)=>{
                        return(
                             <EnergyCard
                             key={e.date}
                             day={e.day}
                             date={e.date}
                             energy={e.energy}
                             hasAnomaly={e.hasAnomaly}
                             />
                        );
                    })
                 } 
            </div>
    );
}

export default SolarEnergyProductionCards;