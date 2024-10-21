import { useState, createContext } from 'react';
import ToolboxSlider from './Components/Toolbox';
import Carousel from './Components/Carousel';
import { AtSymbolIcon } from '@heroicons/react/24/outline';

export const themeContext = createContext()

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div>
      <div className="absolute z-10 w-screen bg-black overflow-hidden animate-slideUp animate-duration-[1100ms]">
        <p className="absolute top-1/2 left-1/2 translate-x-[-50%] text-white text-center translate-y-[-50%] text-7xl">hey!</p>
      </div>
      <div className={`${darkTheme ? "bg-black" : "bg-white"} min-h-screen max-h-full`}>
        <div className='w-screen overflow-hidden'>
          <button className={`${darkTheme ? "text-white" : "text-black"} relative float-right border-black border-2 px-2 rounded-2xl`}
          onClick={()=>setDarkTheme(!darkTheme)}>
           Theme
          </button>
        </div>
        <div className={`${darkTheme ? "text-white" : "text-black"} flex-col text-center pt-5`}>
          <img alt="forbidden head" className={`${darkTheme ? "border-white" : "border-black"} mx-auto h-48 border-2 rounded-[50%]`} src={require("./Images/headShot.png")}/>
          <a className="text-3xl px-auto" href="mailto: andrenewbauer@gmail.com">Andre Newbauer</a>
          <p className='p-5'>A full-stack web developer from Myrtle Beach, SC who enjoys playing games and with cats!</p>
        </div>
        <div className={`${darkTheme ? "text-white" : "text-black"} flex-col text-center`}>
          <p className=''>Toolbox</p>
          <themeContext.Provider value={darkTheme}>
            <ToolboxSlider/>
          </themeContext.Provider>
        </div>
        <div className={`${darkTheme ? "border-white" : "border-black"} border-b-2 pb-5 mx-5`}>
          <p className={`${darkTheme ? "text-white" : "text-black"} text-2xl pt-1 pb-3 text-center`}>More About Me</p>
          <div className='flex'>
          <img src={require("./Images/Itsme.jpg")} className={`${darkTheme ? "text-white" : "text-black"} h-[30vh] mr-5 rounded-md`}></img>
          <p className={`${darkTheme ? "text-white" : "text-black"}`}>When I'm not working, coding or playing fetch with my cat, I'm playing many different video games such as Warframe, League of Legends and Rain World!</p>
          </div>
        </div>
        <div className={`${darkTheme ? "border-white" : "border-black"} border-b-2 pb-5 mx-5`}>
          <p className={`${darkTheme ? "text-white" : "text-black"} text-2xl text-center pt-1 pb-3`}>Projects</p>
          <div className=''>
          <themeContext.Provider value={darkTheme}>
            <Carousel/>
          </themeContext.Provider>
          </div>
        </div>
        <div className='flex bottom-0 border mt-3'>
          <AtSymbolIcon className={`${darkTheme ? "text-white" : "text-black"} w-5 mr-1`}/>
          <a className={`${darkTheme ? "text-white" : "text-black"}`} href="mailto: andrenewbauer@gmail.com">andrenewbauer@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

export default App;
