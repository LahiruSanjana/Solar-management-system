const Navigation = () =>{
  const user="LF";

    return(
         <nav className="px-52 py-5 flex justify-between">
            <div className="flex items-center gap-3">
                 <div className="flex justify-center items-center w-10 h-10 bg-lime-400 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" viewBox="0 0 24 24" 
                    fill="none" stroke="currentColor" stroke-width="2" 
                    stroke-linecap="round" stroke-linejoin="round" 
                    class="lucide lucide-wind-icon lucide-wind block">
                    <path d="M12.8 19.6A2 2 0 1 0 14 16H2"/>
                    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/>
                    <path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>
                </svg>
                </div>
                <span className="text-xl font-semibold font-sans">Aelora</span>
            </div>  
            <div className="flex justify-center gap-14">
                  <div className="flex justify-center items-center px-3 py-2 text-gray-600 gap-3">
                    <div className="flex justify-center items-center w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                      width="24" height="24" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" stroke-width="2" 
                      stroke-linecap="round" stroke-linejoin="round" 
                      class="lucide lucide-chart-column-icon lucide-chart-column block">
                      <path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/>
                      <path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                    </div>
                    <span className="text-base font-semibold font-sans">Dashboard</span>
                  </div>
                  <div className="flex justify-center items-center gap-3 font-semibold font-sans">
                      <div className="w-10 h-10 flex justify-center items-center bg-blue-400 rounded-full text-white text-xl">{user}</div>
                      <span className="text-gray-500 text-lg">Lahiru</span>
                  </div>
            </div> 
         </nav>
    );
}

export default Navigation;