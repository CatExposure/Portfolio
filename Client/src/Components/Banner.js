import React from 'react';
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function BannerSection(props){
//WARNING, DO NOT ATTEMPT TO ANIMATE TRIANGLES
    return(
        <>
        <div className={props.bannerClassName}>
            <img alt="forbidden head" className={props.imgClassName} src={require("../Images/headShot.png")}/>
            <div>
                <p className="text-white text-3xl">ProtoSite</p>
                <p className="text-white text-md">Funny Website</p>
            </div>
        </div>
        <div className="max-[369px]:hidden absolute flex animate-spin-slow top-5 right-20 flex-col justify-center order-last">
            <div className="w-4 h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
            <div className="w-4 h-4 my-5 rounded-[50%] bg-black shadow-[0_0_10px_5px_#fff]"></div>
            <div className="w-4 h-4 rounded-[50%] bg-white shadow-[0_0_10px_5px_#0ff]"></div>
        </div></>
    );
}
export default BannerSection;