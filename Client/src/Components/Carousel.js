import React from 'react';
import {ArrowRightCircleIcon, ArrowLeftCircleIcon} from "@heroicons/react/24/outline"
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function Carousel(){

    const [slide, setSlide] = React.useState(0);
    var slideInterval;

    startSlider();

    function startSlider(){
        slideInterval = setInterval(()=> {if(slide===carImages.length-1){setSlide(0)}else{setSlide(slide+1)}}, 5000);
    }

    function stopSlider(){
        clearInterval(slideInterval)
    }

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

    return (
        <div id="carousel" className="relative flex justify-center w-full">
            <button className="w-8 bg-white rounded-[50%] p-[-1] h-fit my-auto text-black" onClick={()=>{ stopSlider(); if(slide===0){setSlide(carImages.length-1)}else{setSlide(slide-1)}; startSlider();}}><ArrowLeftCircleIcon/></button>
            <div  className="relative flex flex-row justify-center">
            {carImages.map((img, index) => {
                return(
                <img className={`${slide===index ? " w-[60vw] h-[60vh]":"hidden"}`} src={img.src} alt={img.alt} key={index}></img>)})}</div>
                <button className="w-8 bg-white rounded-[50%] h-fit my-auto text-black" onClick={()=>{if(slide===carImages.length-1){setSlide(0)}else{setSlide(slide+1)}; console.log("yay33"); clearInterval(slideInterval)}}><ArrowRightCircleIcon/></button>
            <div className="absolute flex flex-row gap-2 justify-center bottom-3 right-[auto]">
                {carImages.map((_, index) => {
                    return <button className={`${index===slide ? "bg-cyan-400" : "bg-white"} w-3 h-3 rounded-[50%]`} key={index} onClick={()=> setSlide(index)}></button>
                })}
            </div>
        </div>
    )
}

export default Carousel