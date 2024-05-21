import React from 'react';
import {Link} from 'react-router-dom';
import {Bars3Icon} from '@heroicons/react/24/outline';

function NavBar(){
    const [isOpen, setIsOpen] = React.useState(false);


    return(
        <div className="fixed t-0 l-0 flex flex-row-reverse z-10">
            <div onClick={() => setIsOpen(!isOpen)} className="flex">
                <Bars3Icon className="h-10"/>
            </div>
            <div className={`${isOpen ? "h-[17vh] w-[13vw] shadow-[0_0_10px_5px_rgba(255,255,255,.4),0_0_20px_10px_rgba(0,255,255,.2)] [transition:width_300ms_0ms]" : "border-transparent h-[0vh] w-[0vw] [transition:height_0ms_300ms,width_300ms_0ms,border_0ms_300ms]"} relative rounded-sm border border-black bg-white overflow-hidden`}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/YouTubeAPI">YouTube API</Link></li>
                    <li><Link to="/SpotifyAPI">Spotify API</Link></li>
                    <li><Link to="/Databases">Database</Link></li>
                    <li><Link to="/Contact">Contact</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;