import React from 'react';
import {useEffect, useState, useRef} from "react";
import Axios from 'axios';
import {apiUrl} from "../Components/Api";
import {PlayCircleIcon, PauseCircleIcon, ArrowDownIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon} from '@heroicons/react/24/outline';

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function SpotifyAPI(){
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);
    const [Results, setResults] = useState("")
    const [validation, setValidation] = useState();
    const [ArtistTooltip, setArtistTooltip] = useState([]);
    const [trackTooltip, setTrackTooltip] = useState(false);
    const audioPlayer = useRef(new Audio());
    var artistId = useRef()
    var storedVolume = useRef(.5);
    var sliderDragging = useRef(false);
    var songDuration = useRef(30);
    const [currentArtistTracks, setCurrentTracks] = useState([]);
    const [displayedArtistTracks, setDisplayedTracks] = useState([]);
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setPlaying] = useState(false);
    const [currentTrack, setTrack] = useState();
    const [itemId, setItemId] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [audioVolume, setVolume] = useState(.5);


    const toggle = () => setPlaying(!isPlaying);

    isPlaying ? playAudio() : pauseAudio()
    audioPlayer.current.volume = audioVolume

    audioPlayer.current.ontimeupdate = (e) => {
        if(!sliderDragging.current){
        setCurrentTime(audioPlayer.current.currentTime)
        }
    }

    useEffect(() => {
        if (currentTrack != undefined) {
        //preview songs are only 30s long, but the below code gets the actual length of the full song.
        //songDuration.current = currentTrack.duration_ms;
        audioPlayer.current.src = currentTrack.preview_url;
        audioPlayer.current.load();
        }
    }, [currentTrack]);

    useEffect(() => {
        getValidation();
    }, []);

    //for some reason, the audioplayer.current.ended does not fire (more specifically, the playbackrate cannot be positive in order for it to fire)
    //this is just a simpler solution
    audioPlayer.current.onended = () => {
        nextSong();
    }

    function getAuth(){
            Axios({
                method: 'post',
                url: apiUrl+'authorization',
                withCredentials: true
            }).then ((response) => {
                window.location.href = response.data.authUrl;
            })
    }

    //if the user entered nothing or uses the * character (explained more later) then set the results state to false/none and prevents the search from running
        //as for the * character, in the actual spotify app you can search with the * character, however the API seems to despise it.
        //I don't have enough knowledge on how their search params handle *, so we will refrain from using it for now
        //also using a useEffect hook here to automatically search as the user types in the artist
    useEffect(()=> {
            if(searchKey.startsWith("*")) {
            setResults("false");
            return;
        }
        window.localStorage.setItem("userSearch", searchKey);
        getArtists();
    }, [searchKey]);

    //sets the token state to blank and removes the localStorage token
    function logout(){
        Axios({
            method: 'get',
            url: apiUrl+'logOut',
            withCredentials: true
        });
        window.location.reload();
    }

    //we use axios as it is more secure (prevents xsrf), but functions similarly to a fetch request
    //we use an async function with await to ensure that no further code is executed before the fetch request is complete
    //we also use a try catch statement to ensure the webpage does not crash as well as provide error responses
    //lastly, we set the state of artists to an array of all the items for each artist in the data we fetched
    function getArtists(){
        if (searchKey) {
            Axios({
                method: 'post',
                url: apiUrl+'getArtists',
                withCredentials: true,
                data: {searchKey},
                
            }).then((response) => {
                const data = response.data;
                //if the user enteres a value and there are no artists, set the Results state to false, and set to true in any other case (if there's at least 1 artist)
                if (data.artists.items.length === 0) {
                    setResults("");
                } else {
                    setResults("true");
                }
                setArtists(data.artists.items);
            })
        }
}

    function playAudio() {
        if(!sliderDragging.current){
        audioPlayer.current.play().catch((error) => {console.log(error)})
        }
    }

    function pauseAudio() {
        audioPlayer.current.pause()
    }

    //had to change the get request as the Spotify API params dont support 'top-tracks'. Also, country is for some reason a required param
    function getArtistAlbum() {
            if (artistId.current) {
            Axios({
                method: 'post',
                url: apiUrl+'getSongs',
                withCredentials: true,
                data: {artistId: artistId.current},
            }).then((response) => {
                setDisplayedTracks(response.data.tracks);
                setIsOpen(true);
            }).catch((err) => { 
                console.log(err);
            })
        }
    }

    //converts ms into M:S
    function convertMs(mS) {
        var minutes = Math.floor(mS / 60000);
        var seconds = ((mS % 60000) / 1000).toFixed(0);
        return (
            seconds === 60 ?
            (minutes+1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
          );
    };

    function changeButtonImg(url) {
        if (url === audioPlayer.current.src) {
            if (isPlaying){
                return <PauseCircleIcon/>
            } else{
                return <PlayCircleIcon/>
            }
        }
        else{
            return <PlayCircleIcon/>
        }
    };

    function displayPlaying() {
        if (currentTrack) {
            return (
            <div className='relative flex ml-5 md:ml-8 xl:ml-12 2xl:ml-16'><img className='border rounded-[50%] border-transparent' src={currentTrack.album.images[0].url}></img>
                <div className='flex min-w-0 overflow-hidden flex-col'>
                    <label className='truncate whitespace-pre-wrap text-lg md:text-2xl mt-1 md:mt-3 ml-1 md:ml-3 my-auto'

                    onMouseEnter= {() => {
                        setTrackTooltip(true)
                    }} 

                    onMouseLeave={() => {
                        setTrackTooltip(false)
                    }}>{currentTrack.name}</label>
                    <label className='text-sm ml-1 md:ml-3 my-auto hover:cursor-pointer' onClick={()=> {

                        setDisplayedTracks(currentArtistTracks);
                    }}>{currentTrack.artists[0].name}</label>
                    <div className='flex-1'></div>
                </div>
                <div className={`${trackTooltip ? "opacity-90 duration-300 delay-500" : "opacity-0"} absolute bg-white rounded-md px-1 right-[2%] w-fit sm:text-xl xl:text-2xl sm:left-[70%] lg:left-[60%] xl:left-[50%] mt-5 sm:mt-12`}>{currentTrack.name}</div>
            </div>)
        } else {
            return 
        }
    }

    function speakerIcon() {
        if (audioVolume == 0) {
            return <SpeakerXMarkIcon className='h-7 md:h-10 xl:h-12' onClick={() => {
                setVolume(storedVolume.current);
            }}/>
        } else {
            return <SpeakerWaveIcon className='h-7 md:h-10 xl:h-12' onClick={() => {
                storedVolume.current = audioVolume;
                setVolume(0);
            }}/>
        }
    }

    function nextSong(){
        let newItemId = itemId+1
        if (currentArtistTracks[newItemId]) {
        setTrack(currentArtistTracks[newItemId]);
        setItemId(newItemId);
        audioPlayer.current.oncanplay = function() {
            //for some reason, toggle does NOT work here, even though it should do the exact same thing
            setPlaying(true);
        }};
    }

    function previousSong(){
        let newItemId = itemId-1
        if (currentArtistTracks[newItemId]) {
        setTrack(currentArtistTracks[newItemId]);
        setItemId(newItemId);
        audioPlayer.current.oncanplay = function() {
            //for some reason, toggle does NOT work here, even though it should do the exact same thing
            setPlaying(true);
        }};
    }

    function songSlider() {
        if (audioPlayer.current.error === null) {
            return (<>
            <input className='w-36' type="range" min="0" 
            max={songDuration.current}
            value={currentTime} 
            onMouseDown={() => {sliderDragging.current = true; pauseAudio();}} 
            onMouseUp={() => {sliderDragging.current = false; playAudio();}} step="1" 
            onChange={(e) => {audioPlayer.current.currentTime = parseInt(e.target.value); setCurrentTime(parseInt(e.target.value))}}
            disabled={!currentTrack}/>
            <label className="ml-2 md:ml-5">{convertMs(audioPlayer.current.currentTime * 1000)}</label>
            </>)
        } else {return <div></div>}
    }

    function mediaControls() {
        return (
                <>
                <div className='flex mb-1 gap-2 md:gap-5'>
                <button disabled={!currentTrack} onClick={() => {
                    audioPlayer.current.currentTime = audioPlayer.current.currentTime - 5;
                }}>
                    <ArrowUturnLeftIcon className='h-8 md:h-10 xl:h-12'/>
                </button>
                <button disabled={!currentTrack} onClick={() => {
                    if (itemId > 0){
                        previousSong();
                }}}><BackwardIcon className='h-8 md:h-10 xl:h-12'/></button>
                <button disabled={!currentTrack} onClick={() => {
                            toggle();
                        }}>{isPlaying ? <PauseCircleIcon className='h-8 md:h-10 xl:h-12'/> : <PlayCircleIcon className='h-8 md:h-10 xl:h-12'/>}</button>
                <button disabled={!currentTrack} onClick={() => {
                    if (itemId < currentArtistTracks.length-1){
                        nextSong();
                    }}}><ForwardIcon className='h-8 md:h-10 xl:h-12'/></button>
                <button disabled={!currentTrack} onClick={() => {
                    audioPlayer.current.currentTime = audioPlayer.current.currentTime + 5;
                }}>
                    <ArrowUturnRightIcon className='h-8 md:h-10 xl:h-12'/>
                </button>
                </div>
                <div>
                    {songSlider()}
                </div>
                </>
        )
    }

    function volumeSlider() {
        if (window.innerWidth < 640) {
            return (
                <div className="flex">
                        <input className='w-36 ml-1 mr-2' type="range" min="0" max="1" value={audioVolume} step=".01" 
                        onChange={(e)=> {setVolume(e.target.value)}}/>
                        {speakerIcon()}     
                    </div>
            )
        } else {
        return (
            <div className="flex sm:flex-1 sm:justify-center sm:items-center">
                    {speakerIcon()}
                    <input className='w-36 ml-3' type="range" min="0" max="1" value={audioVolume} step=".01" 
                    onChange={(e)=> {setVolume(e.target.value)}}/>     
                </div>
        )
    }}

    function mediaBar() {
        if (window.innerWidth < 640) {
            return (
                <>
                <div className="flex overflow-hidden flex-1">
                {displayPlaying()}
                </div>
                <div className="flex flex-1 justify-center">
                <div className='flex flex-col justify-center items-center'>
                {mediaControls()}
                {volumeSlider()}
                </div>
                </div>
                </>
            )
        } else {
            return (
                <>
                <div className="flex flex-1">
                {displayPlaying()}
                </div>
                <div className="flex flex-1 justify-center">
                <div className='flex flex-col justify-center items-center'>
                {mediaControls()}
                </div>
                </div>
                <div className="flex flex-1 justify-center">
                    {volumeSlider()}
                </div>
                </>
            )
        }
    }

    //maps out the artists and gives each artists a div with their id as the key, then includes an image and their name.
    //if the Results state is false, it will instead show no artists as this state would only be false if the search were to give an error or no artists
    //clicking on a artist send the user to another page to view their top-10 tracks, as well as the ability to play them
    function renderArtists() {
        if (Results === "false" || Results.trim() === "" || !searchKey) {
                return (
                    <div></div>
                )
        } else {
            return artists.map(item => (
                <>
                    <div className="h-[20vh] flex min-w-0 border border-black border-solid transition-all max-w-[90%] sm:w-[80%] lg:w-[60%] xl:w-[50%] mt-5 bg-gray-600 hover:bg-gray-500 hover:h-[23vh] hover:ml-3 lg:hover:ml-10"
                    key={item.id}
                    onMouseEnter= {() => {
                        setArtistTooltip({[item.id]: true})
                    }} 

                    onMouseLeave={() => {
                        setArtistTooltip({[item.id]: false})
                    }}

                    onClick={() => {
                        if (artistId.current != item.id){
                            artistId.current = item.id;
                            getArtistAlbum();
                        } else {
                            setIsOpen(true);
                        }
                        
                    }}>
                        {item.images.length ? <img className="h-full" src={item.images[0].url} alt=""/> : <div>No Image</div>}
                        {/**setting 'min-w-0 stops the flex item from overflowing parent 
                         * also, I dont entirely understand this: truncate usually causes an ellipsis, but usually doesn't allow wrapping. However,
                         * with the use of specifically whitespace-pre-wrap, its truncates only the last word if it cannot wrap anymore
                        */}
                        <div className="min-w-0 overflow-hidden ml-5">
                            <p className="truncate whitespace-pre-wrap text-4xl sm:text-5xl lg:text-6xl mb-3">{item.name}</p>
                            <p className="text-lg lg:text-xl">Followers: {item.followers.total}</p>
                        </div>
                        <div className={`${ArtistTooltip[item.id] ? "opacity-90 duration-300 delay-500" : "opacity-0"} absolute bg-white rounded-md px-1 right-[2%] w-fit sm:text-xl xl:text-2xl sm:left-[70%] lg:left-[60%] xl:left-[50%] mt-5 sm:mt-12`} >{item.name}</div></div>
                    </>
                    
                
            ));
        }
    }

    //will render a message stating there were no reults and to inform the user to refrain from using * if the Results state is false
    function renderResultsMessage() {
        if (Results === "false") {
            return (
                <div>
                   <p>No results came up!</p>
                   <p>Refrain from using '*' in your searches</p>
                </div>
            )
        } else {
            return (
                <></>
            )
        }
    }

    //allows the user to login to spotify (or log out if they are already logged in)
    const LoginOut = () => {
        if (!validation) {
            return (
                <button onClick={()=> {getAuth()}}>Login</button>
            )
        } else {
            return (
                <button className="text-2xl border border-black rounded-md p-1 bg-gray-600" onClick={logout}>Log out</button>
            )
        }
    }

    function getValidation() {
        Axios({
            method: 'get',
            url: apiUrl+"getValidation",
            withCredentials: true
        }).then((response) => {
            setValidation(response.data)
        })
    }

    function renderSongs() {
        return (
            displayedArtistTracks.map(item => (
                <div key={item.id} className='flex border mx-auto bg-gray-500 border-black w-[90%] md:w-[70%] xl:w-[50%] 2xl:w-[40%] mb-5 h-[20vh]'>
                        <img src={item.album.images[0].url} alt='' className='trackImg'></img>
                    <div className='overflow-hidden ml-2 max-w-[40%]'>
                        <p className="truncate whitespace-pre-wrap text-xl md:text-3xl">{item.name}</p>
                        <p className="text-lg md:text-xl">Duration: {convertMs(item.duration_ms)}m</p>
                    </div>
                        <button className="w-20 ml-auto" onClick={() => {
                            if (item.preview_url === audioPlayer.current.src){
                                toggle();
                            } else {
                                setPlaying(false);
                                setCurrentTracks(displayedArtistTracks);
                                setTrack(item);
                                setItemId(currentArtistTracks.indexOf(item));
                                audioPlayer.current.oncanplay = function() {
                                    //for some reason, toggle does NOT work here, even though it should do the exact same thing
                                    setPlaying(true);
                                };
                            };
                        }}>{changeButtonImg(item.preview_url)}</button>
                </div>))
        )
    }
    //displays the search text input as well as a message informing the user to login to use the spoitfy API if they are not
    //also displays all the render components
    return(
        <div className="min-h-[80vh] bg-gray-400 max-h-full">
            <div className="ml-20 max-[640px]:flex-col sm:flex sm:gap-10">
                <div className=''>{LoginOut()}</div>
                {validation ? 
                    <div className="flex max-[640px]:mt-5"> 
                        <p className="text-black text-lg sm:text-2xl mr-3">Search here: </p><input className="text-black border border-black bg-gray-500 rounded-md pl-2" type="text" placeholder="Search Artist Here" onChange={e => setSearchKey(e.target.value)}/>
                    </div>

                    : <h2>Please login to use search feature</h2>
                }
            </div>
            {renderResultsMessage()}
            <div className="fixed bottom-0 h-[77vh] w-full sm:h-[80vh] lg:h-[77vh] overflow-y-auto pb-36 pl-5">
            {renderArtists()}
            </div>
            {/**overflow-y-auto disables scrollbar if there is no overflowing elements (for some reason this removes the scrollbar when my original div when) 
             * my other div is open
            */}
            <div className={`${isOpen ? "h-full w-full pt-[5vh]" : "h-[0vh] w-full"} overflow-y-auto z-5 transition-all duration-[400ms] bg-gray-400 fixed bottom-0`}>
                {renderSongs()}
            <div className={`${isOpen? "h-[16vh]" : "h-[0vh]"}`}></div>
                
{/**----------------------------------------------------------Media Bar---------------------------------------------------------------------------- */}
            
            <div className="h-[16vh] md:h-[13vh] overflow-hidden transition-all duration-300 flex fixed bg-gray-500 border border-black bottom-0 w-full">
            <button disabled={displayedArtistTracks.length===0} className={`${isOpen ? "" : "rotate-180"} z-10 transition-all fixed`} 
            onClick={()=>{setIsOpen(!isOpen)}}><ArrowDownIcon className='h-8 md:h-10'/></button>
                {mediaBar()}
            </div>
    </div>
        </div>
    )
}

export default SpotifyAPI;