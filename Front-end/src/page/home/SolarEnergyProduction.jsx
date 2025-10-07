import EnergyCard from "./EnergyCard"
import Tab from "./Tab";
import EnergyProductionCards from "./EnergyProductionCards";
import { useSelector } from "react-redux";

const SolarEnergyProduction = () => {
 
    const solarData = [
        { day: 'Mon',date:'Sep 1', energy: 15.9,hasAnomaly:false },
        { day: 'Tue',date:'Sep 2', energy: 38.3,hasAnomaly:false },    
        { day: 'Wed',date:'Sep 3', energy: 5,hasAnomaly:true },
        { day: 'Thu',date:'Sep 4', energy: 42.7,hasAnomaly:false},    
        { day: 'Fri',date:'Sep 5', energy: 40.2,hasAnomaly:false },
        { day: 'Sat',date:'Sep 6', energy: 6,hasAnomaly:true },    
        { day: 'Sun',date:'Sep 7', energy: 40,hasAnomaly:false },
    ];
    const tab=[
       {label:"All",value:"all"},  
       {label:"Anomaly",value:"anomaly"}
    ]

    const selectTab=useSelector((state)=>state.ui.selectedHomeTab);

    const filteredData = solarData.filter(e1 => {
        if (selectTab === "all") {
            return true; 
        }
        else if (selectTab === "anomaly") {
            return e1.hasAnomaly;
        }
        return false;
    });

    return (
        <section className="px-20 py-10">
            <div className="mb-6">           
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Solar Energy Production</h2>
                <p className="text-base text-gray-600">Daily energy output for the past 7 days</p>
            </div> 
            <div>
                {
                   tab.map((t)=>{
                    return(
                        <Tab
                            key={t.value}
                            tab={t}
                        />  
                    );
                })}
            </div>
            <EnergyProductionCards
                solarData={filteredData}
            />
        </section>                 
    );
};
export default SolarEnergyProduction;