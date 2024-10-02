import Marquee from 'react-fast-marquee';
import { useContext } from 'react';
import { themeContext } from '../App'
const images = [
    {
        src: require("../Images/reactIcon.png"),
        alt: "ReactIcon",
    },
    {
        src: require("../Images/jsIcon.png"),
        alt: "JavaScriptIcon",
    },
    {
        src: require("../Images/htmlIcon.png"),
        alt: "HTMLIcon",
    },
    {
        src: require("../Images/cssIcon.png"),
        alt: "CSS3Icon",
    },
    {
        src: require("../Images/tailwindIcon.png"),
        alt: "TailWindIcon",
    },
    {
        src: require("../Images/expressIcon.png"),
        alt: "ExpressIcon",
    },
    {
        src: require("../Images/nodeIcon.png"),
        alt: "NodeJSIcon",
    },
    {
        src: require("../Images/sqlIcon.png"),
        alt: "SQLIcon",
    },
    {
        src: require("../Images/redisIcon.png"),
        alt: "redisIcon",
    },
]

export default function ToolboxSlider(){
    const darkTheme = useContext(themeContext)
    console.log(darkTheme)
    return (
        <div className={`${darkTheme ? "border-white" : "border-black"} relative h-14 w-[90vw] mx-auto border-y-2 overflow-hidden`}>
            <Marquee direction='right' speed={30} gradient={true} gradientColor={`${darkTheme ? "black" : "white"}`} gradientWidth={20}>
                {images.map((img) => 
                <img src={img.src} alt={img.alt} className="w-12 h-12 mx-2"/>
                )}
            </Marquee>
        </div>
    )
}