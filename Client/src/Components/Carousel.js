import React from 'react';
import {ArrowRightCircleIcon, ArrowLeftCircleIcon} from "@heroicons/react/24/outline"
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function Carousel(){

    const [slide, setSlide] = React.useState(0);

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

    var slideInterval;

    function startSlider(){
        slideInterval = setTimeout(slideRight, 3500)
    }

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

    function stopSlider(){
        clearInterval(slideInterval)
    }
    startSlider();

    return (
        <div id="carousel" className="relative flex justify-center w-full">
            <div className="relative flex flex-row max-w-[60vw] h-[60vh] w-full overflow-hidden">
            <button className="absolute w-8 ml-2 left-0 inset-y-0 rounded-[50%] p-[-1] h-fit my-auto text-white z-10" onClick={()=>{stopSlider(); slideLeft()}}><ArrowLeftCircleIcon/></button>
                {/**Right, so basically some ***hole decided hey, wouldnt it be a cool idea if the images automatically shrunk to their max resolution, 
                 *even if the user is trying to stretch it? what a ****head. Whenever stretching an image, add flex-grow/flex-shrink and make sure they are 0*/}
            {carImages.map((img, index) => {
                return(
                    //Tailwind states that you should not use string interpolation as it will not find them and therefore not generate the corresponding css {translate-x-[50%] is fine but translate-x-[${-100 * (slide)}%] is not fine, as ${-100 * (slide)} is not a value during runtime}
                <img onMouseEnter={()=>stopSlider()} onMouseLeave={()=>startSlider()} className={`${slide===1 ? "translate-x-[-100%]" : ""} ${slide===2 ? "translate-x-[-200%]" : ""} shrink-0 grow-0 [transition:transform_800ms] w-full`} src={img.src} alt={img.alt} key={index}></img>)})}</div>
                    <button className="absolute w-8 mr-2 right-0 inset-y-0 rounded-[50%] h-fit my-auto text-white z-10" onClick={()=>{stopSlider(); slideRight()}}><ArrowRightCircleIcon/></button>
            <div className="absolute flex flex-row gap-2 justify-center bottom-3 right-[auto]">
                {carImages.map((_, index) => {
                    return <button className={`${index===slide ? "bg-cyan-400" : "bg-white"} w-3 h-3 rounded-[50%]`} key={index} onClick={()=> {stopSlider(); setSlide(index);}}></button>
                })}
            </div>
        </div>
    )
}

export default Carousel