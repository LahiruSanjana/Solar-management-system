import imgWindTurbine_2 from "./wind-turbine-2.png";
import solarConstruction from "./solar-construction_2.jpg";   
const AboutSection = ()=>{
    return (
       <main className="px-16 py-16">
        <div className="flex gap-x-16  ">
            <div className="flex ">
                <img alt="Wind Turbine" className="rounded-2xl w-[640px] h-[750px]" src={imgWindTurbine_2} />
            </div>
            <div className="py-24">
                <div className="">
                    <h1 className="font-sans font-bold text-5xl leading-tight pb-8">
                        <span>Your Solar Energy</span><br />
                        <span>Generation</span>
                    </h1>
                    <p className="font-sans text-neutral-600 text-[18px] leading-normal pb-16">This month, your solar panels generated X kWh of clean energy, <br />
                     helping you save on electricity bills and reduce your carbon <br />
                      footprint. Track your energy production trends and see how <br />
                       much power you contribute back to the grid.</p>
                       <div className="">
                            <img className="object-cover rounded-2xl h-44 w-60" src={solarConstruction} alt="Solar Construction" />
                       </div>
                </div>
            </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
       </main>
    );
}

export default AboutSection;
