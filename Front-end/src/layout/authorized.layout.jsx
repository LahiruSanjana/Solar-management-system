import { Navigate, Outlet } from "react-router";
import { useUser } from "@clerk/clerk-react";

const AuthorizedLayout = () => {
  const { user } = useUser();

   if (user?.publicMetadata.role !== 'admin') {
    return <Navigate to="/" />;
  }
  console.log("AuthorizedLayout User:", user);
  console.log("AuthorizedLayout User Role:", user?.publicMetadata.role);
  return (
    <div>
      <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <p className="text-xs font-medium opacity-90">Logged in as</p>
            <p className="text-sm font-bold">
              {user?.publicMetadata.role?.toUpperCase() || 'USER'}
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default AuthorizedLayout;