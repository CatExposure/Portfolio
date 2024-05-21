import React from 'react';

function BannerSection(props){
//WARNING, DO NOT ATTEMPT TO ANIMATE TRIANGLES
    return(
        <div className={props.bannerClassName}>
            <img alt="forbidden head" className={props.imgClassName} src={require("../Images/headShot.png")}/>
            <div>
                <p className="text-white text-2xl">ProtoSite</p>
                <p className="text-white text-sm">Funny Website</p>
            </div>
            <></>
            <div className="flex animate-spin-slow flex-col ml-[80%] justify-center order-last">
                <div className="w-4 h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
                <div className="w-4 h-4 my-5 rounded-[50%] bg-black shadow-[0_0_10px_5px_#fff]"></div>
                <div className="w-4 h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
            </div>
        </div>
    );
}
export default BannerSection;