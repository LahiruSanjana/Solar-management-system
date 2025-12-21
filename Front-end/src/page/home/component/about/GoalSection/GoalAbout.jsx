import DetailsCard from "../DetailsCard";
import tiger from "./tiger.png";
import solarConstruction from "./solar-construction.jpg";
import { User } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const GoalAbout = () => {
    const goal = [
        { details: "Maximize solar energy savings.", iconColor: "text-black", textColor: "text-black" },
        { details: "Detect and resolve issues early.", iconColor: "text-black", textColor: "text-black" },
        { details: "Track daily, weekly, and monthly output.", iconColor: "text-black", textColor: "text-black" },
        { details: "Get notified of anomalies instantly.", iconColor: "text-black", textColor: "text-black" },
    ];
    const need = [
        { details: "A simple dashboard for real-time monitoring.", iconColor: "text-black", textColor: "text-black" },
        { details: "Instant alerts for system anomalies.", iconColor: "text-black", textColor: "text-black" },
        { details: "Easy access to historical performance data.", iconColor: "text-black", textColor: "text-black" },
        { details: "Clear, actionable insights for better energy management.", iconColor: "text-black", textColor: "text-black" },
    ];
    const { isLoaded, user } = useUser();
    const displayName = isLoaded && user
        ? user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "";

    return (
        <div className="flex flex-col md:flex-row justify-between items-start px-6 md:px-12 py-6 gap-8 md:gap-32">
            <div className="w-full md:w-1/2 space-y-6">
                <div>
                    <span className="font-sans font-bold text-2xl md:text-3xl">Goals:</span>
                    <div className="mt-4 space-y-3">
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
                    <span className="font-sans font-bold text-2xl md:text-3xl">Needs:</span>
                    <div className="mt-4 space-y-3">
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

                <SignedOut>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center box-border shadow-2xl border border-gray-200 gap-4 mt-4 p-4 rounded-xl w-full sm:max-w-[480px] bg-white">
                        <img className="w-12 h-12 rounded-full" src={tiger} alt="Tiger" />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 font-sans">
                            <div className="flex gap-2 items-center">
                                <span className="text-black font-semibold text-base">Alex P.</span>
                                <span className="text-gray-500">42 y.o.</span>
                            </div>
                            <div className="flex gap-6 items-center">
                                <span className="text-gray-500">Homeowner</span>
                                <span className="text-black font-semibold text-base">Solar User</span>
                            </div>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center box-border shadow-2xl border border-gray-200 gap-4 mt-4 p-4 rounded-xl w-full sm:max-w-[480px] bg-white">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox:
                                        "w-10 h-10 rounded-full border-2 border-lime-400 transition-transform duration-200 hover:scale-105",
                                },
                            }}
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                            {displayName ? (
                                <span className="text-black font-semibold">{displayName}</span>
                            ) : (
                                <span className="text-gray-500">Loading...</span>
                            )}
                            <div className="flex gap-6 items-center mt-2 sm:mt-0">
                                <span className="text-gray-500">Homeowner</span>
                                <span className="text-black font-semibold text-base">Solar User</span>
                            </div>
                        </div>
                    </div>
                </SignedIn>
            </div>
            <div className="w-full md:w-1/2 relative inline-block">
                <img
                    className="object-cover w-full h-64 md:h-[750px] rounded-3xl"
                    src={solarConstruction}
                    alt="Solar Construction"
                />
                <div className="absolute top-4 left-4 md:top-14 md:left-10 z-10 w-[160px] md:w-40 h-10 md:h-12 bg-sky-600 p-2 md:p-4 rounded-2xl flex items-center">
                    <div className="flex justify-center items-center">
                        <User className="text-white w-5 h-5" />
                    </div>
                    <span className="ml-2 text-white font-sans text-sm md:text-base font-semibold">User Profile</span>
                </div>
            </div>
        </div>
    );
}

export default GoalAbout;
