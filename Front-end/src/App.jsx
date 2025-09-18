import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from './Component/Navigation'
import Herosection from './Component/Herosection/Herosection'
import About from './Component/About/About'
import Footer from './Component/Footer'
import SolarEnergyProduction from './Component/SolarEnergyProduction'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation/>
      <main>
        <Herosection/>
        <SolarEnergyProduction/>
        <About/>
      </main>
      <Footer/>
    </>
  )
}

export default App
