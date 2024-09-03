import Carousel from './Components/Carousel'

function App() {
  return (
    <div className="">
      <div className="bg-black bg-cover min-h-screen max-h-full flex-col h-screen pt-[2%]">
            <div className="w-fit h-fit rounded-xl px-3 ml-[1%] text-[56px] shadow-[0_0_10px_5px_#fff]">
                <p className='text-white '>Welcome to my portfolio!</p>
            </div>
            <div className='flex-col my-[5%] w-1/3 justify-center text-center'>
              <p className='text-[36px] text-white'>Projects</p>
              <Carousel/>
            </div>
      </div>
      <div className='bg-black flex min-h-screen max-h-full'>
        <img className="ml-auto mr-[2%] mt-[1%] h-[80%] shadow-[0_0_100px_5px_#fff] rounded-[50%]" src={require("./Images/karmaIcon.png")}></img>
      </div>
    </div>
  );
}

export default App;
