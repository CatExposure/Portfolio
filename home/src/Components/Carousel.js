import React, {useContext, useEffect, useState} from 'react';
import {ArrowRightCircleIcon, ArrowLeftCircleIcon} from "@heroicons/react/24/outline"
import { themeContext } from '../App'
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

export default function Carousel(){
    const [slide, setSlide] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const darkTheme = useContext(themeContext);
    console.log(darkTheme)

    var carImages=[
        {
            src: require("../Images/Spotify.png"),
            href: "https://spotify.ProtoSite.online",
            alt: "Image1",
            text: "Featuring Tailwind, React, and Node, this application uses the Spotify API to allow the user to login to their account and search artists, as well as play their music with a playback GUI"
        }, 
        {
            src: require("../Images/underConstruction.png"),
            alt: "Under Contruction",
            href: "https://e-commerce.ProtoSite.online",
            text: "An e-commerce site that I'm currently working on! This application will feature an postgreSQL database and materialUI"
        }
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
        <div className='w-[85%] mx-auto'>
            <div className='flex'>
            <button className={`${darkTheme ? "text-white" : "text-black"} w-10 md:w-12 2xl:w-14 rounded-[50%] h-fit my-auto`} 
            onClick={()=>{clearTimeout(slideInterval); slideLeft()}}><ArrowLeftCircleIcon/></button>
        <div id="carousel" className="relative mx-auto flex w-fit">
            {/**this div is the over-arching container*/}
            <div className="relative flex flex-row w-full rounded-lg overflow-hidden">
            {carImages.map((img, index) => {
                function imgText() {
                    if (img.text) {
                        return (
                            <p className={`${darkTheme ? "text-white" : "text-black"} text-xl text-center mt-3`}>{img.text}</p>
                        )
                    } else return (<></>)
                }

                return(
                    <div className={`${slide===1 ? "translate-x-[-100%]" : ""} ${slide===2 ? "translate-x-[-200%]" : ""} shrink-0 grow-0 [transition:transform_800ms] w-fit`}>
                    {/** Tailwind states that you should not use string interpolation as it will not find them and therefore not generate the corresponding css {translate-x-[50%] is fine but translate-x-[${-100 * (slide)}%] is not fine, as ${-100 * (slide)} is not a value during runtime}*/}
                <a href={img.href}><img 
                onMouseEnter={()=> {clearTimeout(slideInterval); setAutoPlay(false)}} 
                onMouseLeave={()=> {setAutoPlay(true)}}  
                src={img.src} 
                alt={img.alt} 
                key={index}></img></a>
                {imgText()}
                </div>
                )})}
                </div>
        </div>
        <button className={`${darkTheme ? "text-white" : "text-black"} w-10 md:w-12 2xl:w-14 rounded-[50%] h-fit my-auto`}
        onClick={()=>{clearTimeout(slideInterval); slideRight()}}><ArrowRightCircleIcon/></button>
        </div>
        <div className="text-center">
        {carImages.map((_, index) => {
            return <button className={`${index===slide ? "bg-cyan-400" : "bg-white"} border-[1px] border-black w-3 h-3 mx-1 rounded-[50%]`} 
            key={index} 
            onClick={()=> {clearTimeout(slideInterval); setSlide(index);}}></button>
        })}
    </div>
    </div>
    )
    }
