import { useState, createContext } from 'react';
import ToolboxSlider from './Components/Toolbox';
import Carousel from './Components/Carousel';
import { AtSymbolIcon } from '@heroicons/react/24/outline';

export const themeContext = createContext()

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div>
      <div className="fixed z-10 w-screen h-[0vh] bg-black overflow-hidden text-center animate-slideU animate-duration-[1300ms]">
        <p className="my-[50vh] translate-y-[-50%] text-white text-center text-9xl">hey!</p>
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
          <a className="text-3xl lg:text-5xl px-auto" href="mailto: andrenewbauer@gmail.com">Andre Newbauer</a>
          <p className='p-5'>A full-stack web developer from Myrtle Beach, SC who enjoys playing games and with cats!</p>
        </div>
        <div className={`${darkTheme ? "text-white" : "text-black"} flex-col text-center`}>
          <p className='text-xl md:text-2xl lg:text-3xl xl:text-4xl'>Toolbox</p>
          <themeContext.Provider value={darkTheme}>
            <ToolboxSlider/>
          </themeContext.Provider>
        </div>
        <div className={`${darkTheme ? "border-white" : "border-black"} border-b-2 lg:border-b-4 py-5 lg:py-8 mx-5 md:mx-10 lg:mx-14 2xl:mx-16`}>
          <p className={`${darkTheme ? "text-white" : "text-black"} text-2xl md:text-3xl lg:text-4xl pt-1 pb-3 text-center`}>More About Me</p>
          <div className='flex'>
          <img src={require("./Images/Itsme.jpg")} className={`${darkTheme ? "text-white" : "text-black"} h-[40vh] sm:h-[50vh] mr-5 rounded-md`}></img>
          <p className={`${darkTheme ? "text-white" : "text-black"} my-auto sm:text-2xl`}>When I'm not working, coding or playing fetch with my cat, I'm playing many different video games such as Warframe, League of Legends and Rain World!</p>
          </div>
        </div>
        <div className={`${darkTheme ? "border-white" : "border-black"} border-b-2 lg:border-b-4 py-5 lg:py-8 mx-5 md:mx-10 lg:mx-14 2xl:mx-16`}>
          <p className={`${darkTheme ? "text-white" : "text-black"} text-2xl md:text-3xl lg:text-4xl text-center pt-1 pb-3`}>Projects</p>
          <div className=''>
          <themeContext.Provider value={darkTheme}>
            <Carousel/>
          </themeContext.Provider>
          </div>
        </div>
        <div className={`${darkTheme ? "border-white" : "border-black"} border-t-2 p-1 flex gap-6 bottom-0 mt-3`}>
          <p className='content-center text-2xl lg:text-3xl'>SOCIAL</p>
          <div className='flex'>
          <AtSymbolIcon className={`${darkTheme ? "text-white" : "text-black"} w-8 lg:w-12 mr-2`}/>
          <a className={`${darkTheme ? "text-white" : "text-black"} text-xl lg:text-2xl content-center`} href="mailto: andrenewbauer@gmail.com">andrenewbauer@gmail.com</a>
          </div>
          <div className='flex content-center'>
            <img className='w-8 lg:w-12 mr-2' src={require("./Images/githubIcon.png")}/>
            <a className='content-center text-xl lg:text-2xl' target="_blank" rel="noopener norefferer" href="https://github.com/CatExposure">CatExposure</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
