import React from 'react';
import {Link} from 'react-router-dom';
import {Bars3Icon, HomeIcon, VideoCameraIcon, SpeakerWaveIcon, CircleStackIcon, IdentificationIcon} from '@heroicons/react/24/outline';
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function NavBar(){
    const [isOpen, setIsOpen] = React.useState(false);

    function LinkItem(props){
        return(<Link className="text-4xl mt-3 hover:text-5xl lg:text-3xl lg:hover:text-4xl 2xl:hover:text-3xl 2xl:text-2xl transition-all duration-150ms flex flex-row justify-between border-b border-black" to={"/"+props.value}>{props.text}{props.img}</Link>)
    }

    return(
        <div className="fixed t-0 l-0 flex flex-row-reverse z-10">
            <div onClick={() => setIsOpen(!isOpen)} className="flex">
                <Bars3Icon className="h-10 hover:cursor-pointer hover:h-12 transition-all border border-l-0 border-black bg-gray-400"/>
            </div>
            <div className={`${isOpen ? "w-[85vw] min-[480px]:w-[70vw] sm:w-[50vw] min-[900px]:w-[40vw] lg:w-[30vw] xl:w-[22vw] 2xl:w-[14vw] h-full shadow-[0_0_10px_5px_rgba(255,255,255,.4),0_0_20px_10px_rgba(0,255,255,.2)] [transition:width_300ms_0ms]" : "border-0 h-[0vh] w-[0vw] [transition:height_0ms_300ms,width_300ms_0ms,border_0ms_300ms]"} relative rounded-sm border border-black bg-white overflow-hidden`}>
                <ul>
                    <li><LinkItem img={<HomeIcon className="w-8 mr-5"/>} value="" text="Home"/></li>
                    <li><LinkItem img={<VideoCameraIcon className="w-8 mr-5"/>} value="YouTubeAPI" text="YouTubeAPI"/></li>
                    <li><LinkItem img={<SpeakerWaveIcon className="w-8 mr-5"/>} value="SpotifyAPI" text="SpotifyAPI"/></li>
                    <li><LinkItem img={<CircleStackIcon className="w-8 mr-5"/>} value="Databases" text="Databases"/></li>
                    <li><LinkItem img={<IdentificationIcon className="w-8 mr-5"/>} value="Contact" text="Contact"/></li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;