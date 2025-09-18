import SocialMedia from "./SocialMedia";
import Outcome from "./Outcome";
import Resource from "./Resource";
import Contact  from "./Contact";

const Footer = () => {
    return (
        <div className="flex justify-center items-start gap-20 bg-gray-200 p-10">
            <SocialMedia/>
            <Outcome/>
            <Resource/>
            <Contact/>
        </div>
    );
}

export default Footer;
