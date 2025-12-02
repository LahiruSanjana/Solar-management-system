import EnergyCard from "./EnergyCard"
import Tab from "./Tab";
import EnergyProductionCards from "./EnergyProductionCards";
import { useSelector } from "react-redux";
import {Button} from "@/components/ui/button";
import { getAllEnergyGenerationRecords } from "../../lib/api/energygenerationRecordes";
import { use, useEffect } from "react";
import { useState } from "react";
import { useGetEnergyGenerationRecordsQuery} from "../../lib/redux/Query";
import { subDays, toDate, format } from "date-fns";
import { SignedOut,SignedIn,useUser } from "@clerk/clerk-react";

const SolarEnergyProduction = ({ solarUnitId }) => {
    const { user, isSignedIn } = useUser();
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
    
    const { data: energyRecords, error, isLoading, isError } = useGetEnergyGenerationRecordsQuery({
        id: solarUnitId,
        groupBy: "date",
        limit: 7
    }, {
        skip: !isSignedIn || !solarUnitId  
    });
    
    if (isSignedIn && isLoading) {
        return <div>Loading...</div>;
    }

    if (isSignedIn && error) {
        return <div>Error: {error.toString()}</div>;
    }

    const energyGenerationRecords = (isSignedIn && energyRecords) ? energyRecords.slice(0, 7).map((e1) => {
        return {
            day: format(toDate(e1._id.date), 'EEE'),
            date: format(toDate(e1._id.date), 'MMM d'),
            energy: e1.totalEnergy.toFixed(2),
            hasAnomaly: e1.hasAnomaly
        };
    }) : [];
    
    console.log(energyGenerationRecords);
    
    console.log(energyGenerationRecords);

    const energyGenerationRecordsFilteredData = energyGenerationRecords.filter(e1 => {
        if (selectTab === "all") {
            return true; 
        }
        else if (selectTab === "anomaly") {
            return e1.hasAnomaly;
        }
        return false;
    });
    
    console.log(energyGenerationRecordsFilteredData);
    
    const energyGenerationRecordsFilteredDataSignOut = solarData.filter(e1 => {
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
            <SignedOut>
                <div>
                    {
                        tab.map((t) => {
                            return (
                                <Tab
                                    key={t.value}
                                    tab={t}
                                />
                            );
                        })}
                </div>
                <EnergyProductionCards
                    solarData={energyGenerationRecordsFilteredDataSignOut}
                />
            </SignedOut>
            <SignedIn>
                <div>
                    {
                        tab.map((t) => {
                            return (
                                <Tab
                                    key={t.value}
                                    tab={t}
                                />
                            );
                        })}
                </div>
                <EnergyProductionCards
                    solarData={energyGenerationRecordsFilteredData}
                />
            </SignedIn>
        </section>                 
    );
};
export default SolarEnergyProduction;