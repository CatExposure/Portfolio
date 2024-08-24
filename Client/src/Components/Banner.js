import React from 'react';
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function BannerSection(props){
//WARNING, DO NOT ATTEMPT TO ANIMATE TRIANGLES
    return(
        <>
        {/**Fursona head and text */}
        <div className="flex w-full bg-gradient-to-b to-gray-400 from-black py-2">
            <img alt="forbidden head" className="h-16 sm:h-20 xl:h-28" src={require("../Images/headShot.png")}/>
            <div className='ml-3 xl:mt-1'>
                <p className="text-white text-3xl xl:text-5xl">ProtoSite</p>
                <p className="text-white text-md xl:text-xl">Funny Website</p>
            </div>
        </div>
    {/**weird triangle animation thing */}
        <div className="absolute flex animate-spin-slow top-2 right-10 lg:right-15 xl:right-20 flex-col justify-center order-last">
            <div className="w-3 h-3 xl:w-4 xl:h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
            <div className="w-3 h-3 xl:w-4 xl:h-4 my-3 xl:my-4 rounded-[50%] bg-black shadow-[0_0_10px_5px_#fff]"></div>
            <div className="w-3 h-3 xl:w-4 xl:h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
        </div></>
    );
}
export default BannerSection;