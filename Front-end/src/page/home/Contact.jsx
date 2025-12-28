import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
    return (
        <div className=" bg-slate-950 text-slate-200 py-8 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-1">Contact US</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 text-sm">
                        <div className="flex items-center gap-2 hover:text-white transition-colors">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span>support@solarenergy.com</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-white transition-colors">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span>123 Solar Street, Eco City</span>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default Contact;
