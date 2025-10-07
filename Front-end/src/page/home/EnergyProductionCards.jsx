import EnergyCard from "./EnergyCard"
const SolarEnergyProductionCards = (props) => {
    if(props.solarData.length===0){
        return(
            <div className="flex justify-center items-center h-36"> 
                <p className="text-gray-500 text-lg">No data available</p>
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