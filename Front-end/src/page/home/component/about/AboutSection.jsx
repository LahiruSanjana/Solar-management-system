import imgWindTurbine_2 from "./wind-turbine-2.png";
import solarConstruction from "./solar-construction_2.jpg";

const AboutSection = () => {
    return (
        <main className="px-4 sm:px-6 md:px-16 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
                <div className="flex justify-center md:justify-start">
                    <img
                        alt="Wind Turbine"
                        src={imgWindTurbine_2}
                        className="rounded-2xl w-full max-w-[640px] h-auto object-cover"
                    />
                </div>
                <div className="py-6 md:py-24">
                    <div>
                        <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl leading-tight pb-6 md:pb-8">
                            <span>Your Solar Energy</span>
                            <br />
                            <span>Generation</span>
                        </h1>

                        <p className="font-sans text-neutral-600 text-base sm:text-[18px] leading-relaxed pb-6 md:pb-16">
                            This month, your solar panels generated X kWh of clean energy,
                            helping you save on electricity bills and reduce your carbon
                            footprint. Track your energy production trends and see how much
                            power you contribute back to the grid.
                        </p>

                        <div>
                            <img
                                className="object-cover rounded-2xl h-36 w-52 sm:h-40 sm:w-56 md:h-44 md:w-60"
                                src={solarConstruction}
                                alt="Solar Construction"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AboutSection;
