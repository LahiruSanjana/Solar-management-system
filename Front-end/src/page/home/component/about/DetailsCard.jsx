import {ChevronRight} from "lucide-react";
const DetailsCard = ({ details, iconColor,textColor}) => {
    return (
        <div className="flex justify-start items-center leading-[54px] text-lg">
            <ChevronRight className={`${iconColor} mr-2`}/>
            <span className={`${textColor} font-sans`}>{details}</span>
        </div>
    );
}

export default DetailsCard;
