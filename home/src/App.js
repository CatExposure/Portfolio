import { useState, createContext } from 'react';
import ToolboxSlider from './Components/Toolbox';

export const themeContext = createContext()

function App() {
  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div>
      <div className="absolute z-10 w-screen bg-black overflow-hidden animate-slideUp animate-duration-[1100ms]">
        <p className="absolute top-1/2 left-1/2 translate-x-[-50%] text-white text-center translate-y-[-50%] text-7xl">hey!</p>
      </div>
      <div className={`${darkTheme ? "bg-black" : "bg-white"} h-screen`}>
        <div className='w-screen overflow-hidden'>
          <button className={`${darkTheme ? "text-white" : "text-black"} float-right`}
          onClick={()=>setDarkTheme(!darkTheme)}>Theme</button>
        </div>
        <div className={`${darkTheme ? "text-white" : "text-black"} flex-col text-center pt-5`}>
          <img alt="forbidden head" className={`${darkTheme ? "border-white" : "border-black"} mx-auto h-48 border-2 rounded-[50%]`} src={require("./Images/headShot.png")}/>
          <a className="text-3xl px-auto" href="mailto: andrenewbauer@gmail.com">Andre Newbauer</a>
          <p className='p-5'>A full-stack web developer from Myrtle Beach, SC who enjoys playing games and drawing!</p>
        </div>
        <div className={`${darkTheme ? "text-white" : "text-black"} flex-col text-center`}>
          <p className=''>Toolbox</p>
          <themeContext.Provider value={darkTheme}>
            <ToolboxSlider/>
          </themeContext.Provider>
        </div>
        <div className='fixed bottom-0 border '>
          <a href="mailto: andrenewbauer@gmail.com">andrenewbauer@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

export default App;
