import React from 'react';
import Herosection from './Herosection/Herosection';
import About from './component/about/About';
import Footer from './Footer';

const HomePage = () => {

  return (
    <>
      <main className='bg-helios-bg'>
        <Herosection />
        <About />
      </main>
      <div className='border-b-2 border-gray-400'></div>
      <Footer />
    </>
  );
};

export default HomePage;
