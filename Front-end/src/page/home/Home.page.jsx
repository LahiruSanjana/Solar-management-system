import React from 'react';
import Herosection from './Herosection/Herosection';
import SolarEnergyProduction from './SolarEnergyProduction';
import About from './component/about/About';
import Footer from './Footer';
import { useGetSolarUnitsByClerkIdQuery } from '@/lib/redux/Query';
import { useUser } from '@clerk/clerk-react';

const HomePage = () => {
  const { isSignedIn } = useUser();
  const { data: solarUnits, isLoading: isLoadingSolarUnit, isError: isErrorSolarUnit, error: errorSolarUnit } = useGetSolarUnitsByClerkIdQuery(undefined, {
    skip: !isSignedIn 
  });

  if (isSignedIn && isLoadingSolarUnit) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow animate-pulse mx-4 mt-4">
        <div className="h-4 w-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-3 w-64 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-56 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (isSignedIn && isErrorSolarUnit) {
    return <div>Error loading Solar Units: {errorSolarUnit?.message}</div>;
  }

  return (
    <>
      <main>
        <Herosection />
        <SolarEnergyProduction solarUnitId={solarUnits?._id} />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
