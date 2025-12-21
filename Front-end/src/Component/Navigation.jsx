import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Navigation = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const [open, setOpen] = useState(false);

  const NavLink = ({ to, children, onClick, className = "" }) => (
    <Link
      to={to}
      onClick={() => {
        setOpen(false);
        if (onClick) onClick();
      }}
      className={`flex items-center gap-3 px-3 py-2 ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="relative px-4 md:px-52 py-4 flex items-center justify-between bg-helios-primary">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex justify-center items-center w-24 h-10 md:w-36 md:h-12 rounded-full">
          <img
            src={Logo}
            alt="Aelora Logo"
            className="w-24 h-10 md:w-36 md:h-20 object-contain"
          />
        </div>
        <span className="hidden sm:inline-block text-xl md:text-3xl font-bold font-sans text-lime-500">
          HELIOS ENERGY
        </span>
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-8">
        <SignedIn>
          {role === "admin" ? (
            <NavLink to="/admin" className="text-lime-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block"
              >
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              <span className="text-base font-semibold font-sans">
                Admin Dashboard
              </span>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" className="text-lime-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block"
              >
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
              <span className="text-base font-semibold font-sans">Dashboard</span>
            </NavLink>
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
          <div className="flex gap-3">
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
      <div className="flex items-center md:hidden gap-3">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "w-9 h-9 rounded-full border-2 border-lime-400 transition-transform duration-200 hover:scale-105",
              },
            }}
          />
        </SignedIn>

        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute right-4 top-full mt-3 w-64 sm:w-80 bg-helios-primary rounded-md shadow-lg p-4 z-50">
          <SignedIn>
            {role === "admin" ? (
              <NavLink to="/admin" className="text-lime-500">
                <span className="text-base font-semibold">Admin Dashboard</span>
              </NavLink>
            ) : (
              <NavLink to="/dashboard" className="text-gray-200">
                <span className="text-base font-semibold">Dashboard</span>
              </NavLink>
            )}
            <div className="pt-2 border-t border-white/10">
              <UserButton
                appearance={{
                  elements: {
                    userButton: "w-full justify-start px-0",
                    avatarBox:
                      "w-9 h-9 rounded-full border-2 border-lime-400 mr-3",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link
                  to="/sign-in"
                  className="w-full text-center px-3 py-2 text-white rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  to="/sign-up"
                  className="w-full text-center px-3 py-2 text-black bg-white/80 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
