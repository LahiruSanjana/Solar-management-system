import {Zap} from "lucide-react";
import {Facebook} from "lucide-react";
import {Twitter} from "lucide-react";
import {Linkedin} from "lucide-react";
import { Github } from "lucide-react";

const SocialMedia = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-4 ">
            <div className="flex justify-center items-center gap-4">
                <div className="w-10 h-10 bg-lime-400 rounded-full p-2">
                    <Zap className="text-black w-11/12 h-11/12" />
                </div>
                <span className="text-lg font-semibold text-blue-700">Smart Energy</span>
            </div>
            <div>
                <p>
                    Revolutionizing wind farm management <br /> 
                    through advanced digital twin technology and <br />
                    predictive insights.
                </p>
            </div>
            <div>
                <div className="flex justify-center items-center gap-4 mt-2">
                    <Facebook className="text-gray-700 w-10 h-10 bg-gray-300 rounded-full p-3 hover:bg-blue-500 hover:text-white" />
                    <Twitter className="text-gray-700 w-10 h-10 bg-gray-300 rounded-full p-3 hover:bg-blue-500 hover:text-white" />
                    <Linkedin className="text-gray-700 w-10 h-10 bg-gray-300 rounded-full p-3 hover:bg-blue-500 hover:text-white" />
                    <Github className="text-gray-700 w-10 h-10 bg-gray-300 rounded-full p-3 hover:bg-blue-500 hover:text-white" />
                </div>
            </div>
        </div>
    );
}

export default SocialMedia;

