import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role; 

  return (
    <nav className="px-52 py-5 flex justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex justify-center items-center w-10 h-10 bg-lime-400 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-wind block"
          >
            <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
            <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
            <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
          </svg>
        </div>
        <span className="text-xl font-semibold font-sans">Aelora</span>
      </Link>

      <div className="flex justify-center gap-14 items-center">
        <SignedIn>
          {role === "admin" ? (
            <Link
              to="/admin"
              className="flex justify-center items-center px-3 py-2 text-gray-600 gap-3"
            >
              <div className="flex justify-center items-center w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chart-column block"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <span className="text-base font-semibold font-sans">
                Admin Dashboard
              </span>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="flex justify-center items-center px-3 py-2 text-gray-600 gap-3"
            >
              <div className="flex justify-center items-center w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chart-column block"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <span className="text-base font-semibold font-sans">
                Dashboard
              </span>
            </Link>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-10 h-10 rounded-full border-2 border-lime-400 transition-transform duration-200 hover:scale-105",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <div className="flex gap-4">
            <Button asChild>
              <Link
                to="/sign-in"
                className="flex justify-center items-center px-3 py-2 text-white gap-3 rounded-md"
              >
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                to="/sign-up"
                className="flex justify-center items-center px-3 py-2 text-black hover:bg-gray-300 gap-3 rounded-md"
              >
                Sign Up
              </Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navigation;
