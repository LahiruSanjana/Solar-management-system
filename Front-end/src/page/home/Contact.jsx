import { Input } from "@/components/ui/input";
const Contact = () => {
    return (
        <div className="flex flex-col justify-start items-start gap-4 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <div className="flex flex-col justify-start items-start gap-2">
                <span className="font-sans text-lg font-semibold">Contact Us</span>
                <Input placeholder="Your Name" />
                <Input placeholder="Your Email" />
                <Input placeholder="Your Message" />
            </div>
        </div>
    );
}

export default Contact;
