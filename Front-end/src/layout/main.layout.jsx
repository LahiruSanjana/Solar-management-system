import Navigation from "@/Component/Navigation";
import { Outlet } from "react-router-dom";
const MainLayout = ({ children }) => {
    return (
        <>
           <Navigation />
           <Outlet />
        </>
    );
};
    
export default MainLayout;