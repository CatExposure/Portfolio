import React, {useEffect, useState, useRef} from 'react';
import {ArrowRightCircleIcon, ArrowLeftCircleIcon} from "@heroicons/react/24/outline"
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function Carousel(){

    const [slide, setSlide] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true)

    var carImages=[
        {
            src: require("../Images/rivulet.jpg"),
            alt: "Image1",
        },
        {
            src: require("../Images/structure.png"),
            alt: "Image2",
        },
        {
            src: require("../Images/fastboy.jpg"),
            alt: "Image3",
        },
    ]

    let slideInterval = null;

    useEffect(() => {
        slideInterval = autoPlay && setTimeout(slideRight, 3000)
    });

    function slideLeft(){
        if(slide===0){
            setSlide(carImages.length-1)
        }else{
            setSlide(slide-1)
        };
    }

    function slideRight(){
        if(slide===carImages.length-1){
            setSlide(0)
        }else{
            setSlide(slide+1)
        };
    }

    return (
        <div id="carousel" className="relative mx-auto flex w-fit">
            <div className="relative flex flex-row max-w-[20vw] h-[20vh] w-full rounded-lg overflow-hidden">
            <button className="absolute w-8 ml-2 left-0 inset-y-0 rounded-[50%] p-[-1] h-fit my-auto text-white z-10" 
            onClick={()=>{clearTimeout(slideInterval); slideLeft()}}><ArrowLeftCircleIcon/></button>
            {carImages.map((img, index) => {
                return(
                    //Tailwind states that you should not use string interpolation as it will not find them and therefore not generate the corresponding css {translate-x-[50%] is fine but translate-x-[${-100 * (slide)}%] is not fine, as ${-100 * (slide)} is not a value during runtime}
                <img 
                onMouseEnter={()=> {clearTimeout(slideInterval); setAutoPlay(false)}} 
                onMouseLeave={()=> {setAutoPlay(true)}} 
                className={`${slide===1 ? "translate-x-[-100%]" : ""} ${slide===2 ? "translate-x-[-200%]" : ""} shrink-0 grow-0 [transition:transform_800ms] w-full`} 
                src={img.src} 
                alt={img.alt} 
                key={index}></img>)})}
                    <button className="absolute w-8 mr-2 right-0 inset-y-0 rounded-[50%] h-fit my-auto text-white z-10" 
                    onClick={()=>{clearTimeout(slideInterval); slideRight()}}><ArrowRightCircleIcon/></button>
                </div>
            <div className="absolute z-10 bottom-3 left-1/2 translate-x-[-50%]">
                {carImages.map((_, index) => {
                    return <button className={`${index===slide ? "bg-cyan-400" : "bg-white"} w-3 h-3 mx-1 rounded-[50%]`} 
                    key={index} 
                    onClick={()=> {clearTimeout(slideInterval); setSlide(index);}}></button>
                })}
            </div>
        </div>
    )
}

export default Carousel