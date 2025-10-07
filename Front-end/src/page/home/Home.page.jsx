import React from 'react';
import Herosection from './Herosection/Herosection';
import SolarEnergyProduction from './SolarEnergyProduction';
import About from './component/about/About';
import Footer from './Footer';

const HomePage = () => {
  return (
    <>
      <main>
        <Herosection />
        <SolarEnergyProduction />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
