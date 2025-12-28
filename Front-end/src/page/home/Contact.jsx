import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-4">
             {/* Header matches other components */}
            <div className="flex justify-start items-center gap-2">
                <span className="font-sans text-lg font-semibold text-blue-700">
                    Contact Us
                </span>
            </div>

            {/* Vertical List */}
            <div className="flex flex-col gap-4 text-white mt-2">
                <div className="flex items-center gap-3 hover:text-lime-400 transition-colors cursor-pointer">
                    <Phone className="w-5 h-5 text-lime-400" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center gap-3 hover:text-lime-400 transition-colors cursor-pointer">
                    <Mail className="w-5 h-5 text-lime-400" />
                    <span className="text-sm">support@solarenergy.com</span>
                </div>
                
                <div className="flex items-start gap-3 hover:text-lime-400 transition-colors cursor-pointer">
                    <MapPin className="w-5 h-5 text-lime-400" />
                    <span className="text-sm leading-tight">123 Solar Street,<br/>Eco City</span>
                </div>
            </div>
        </div>
    );
}

export default Contact;