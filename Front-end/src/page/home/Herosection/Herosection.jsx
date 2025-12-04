import  {Wind,Sailboat,Triangle,Shield} from 'lucide-react';
import imgWindTurbine from "./wind-turbine.png";
const Herosection = ()=>{
    return (
       <div className="bg-helios-bg px-12 font-[Inter]">
          <nav className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex justify-center items-center rounded-full bg-lime-400 w-10 h-10 sm:w-12 sm:h-12">
              <Wind className="w-5 h-5 sm:w-7 sm:h-7 text-black" aria-hidden />
            </div>
            <span className="font-sans text-sm sm:text-base font-medium">Solar Energy</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex justify-center items-center rounded-full bg-blue-400 w-10 h-10 sm:w-12 sm:h-12">
              <Sailboat className="w-5 h-5 sm:w-7 sm:h-7 text-white" aria-hidden />
            </div>
            <span className="font-sans text-sm sm:text-base font-medium">Home Dashboard</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex justify-center items-center rounded-full bg-lime-400 w-10 h-10 sm:w-12 sm:h-12">
              <Triangle className="w-5 h-5 sm:w-7 sm:h-7 fill-current text-black" aria-hidden />
            </div>
            <span className="font-sans text-sm sm:text-base font-medium">Real-Time Monitoring</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex justify-center items-center rounded-full bg-blue-400 w-10 h-10 sm:w-12 sm:h-12">
              <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-white" aria-hidden />
            </div>
            <span className="font-sans text-sm sm:text-base font-medium">Anomaly Detection</span>
          </div>
        </nav>
          <main className="px-7 py-20 ">
            <div>
                <h1 className="font-sans font-bold text-8xl leading-snug"> 
                    <div>
                        <span>Monitor Your Home's </span>
                        </div>
                    <div className="flex  items-center gap-5">
                        <span>Solar Energy</span>
                        <div className="w-1/4"><img className="rounded-2xl" src={imgWindTurbine} alt="Solar Panel for a home" /></div>
                   </div>
                   <div>
                       <span>with Real-Time</span>
                   </div>
                   <div className="flex items-center gap-8">
                       <div>
                        <span>Insights & Alerts</span>
                       </div>
                       <div className="flex justify-center items-center rounded-full bg-blue-500 w-16 h-16">
                       <Triangle className="w-14 h-14 fill-current text-white sm:h-9 sm:w-9" />
                       </div>
                   </div>
                </h1> 
            </div>
          </main>
       </div>
    );
}

export default Herosection;