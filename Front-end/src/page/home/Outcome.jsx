import {Wind} from 'lucide-react';
const Outcome = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-2 ">
            <div className="flex justify-center items-center gap-2 ">
                <Wind className="text-lime-400 w-6 h-6"/>
                <span className="font-sans text-lg font-semibold">Solutions</span>
            </div>
            <div className="flex flex-col justify-start items-start gap-2  mt-4">
                <span>Digital Twin Platform</span>
                <span>Predictive Analytics</span>
                <span>Remote Monitoring</span>
                <span>Performance Optimization</span>
                <span>Real-time Alerts</span>
                <span>Maintenance Planning</span>
            </div>
        </div>
    );
}

export default Outcome;
