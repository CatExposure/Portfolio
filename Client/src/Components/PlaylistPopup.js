import React from 'react';
import axios from 'axios';
import {PlayCircleIcon, PauseCircleIcon, ArrowDownIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon} from '@heroicons/react/24/outline';
import { apiUrl } from './Api';

//grabs the token and artistId so that we can find the tracks for the particular artist the user clicked on
//we use 'useRef' for the audioplayer, otherwise every re-render will create another instance of an audioPlayer
//all useState force a re-render, which is crucial as data is not able to be manipulated once the program has rendered
//toggle is SOLEY used for play/pause on one song. For some reason, toggle does not like being used when switching to another song (we use setPlaying(--) instead)
//we create a useEffect that only runs after everything has been rendered the first time. We do this as we need to fetch the data only once
//we have another useEffect that runs every time the url Source is changed. Needed due to the fact that we need to load the audioplayer afterwards (allows us to continue where we previously paused)
//we also do not want to load every render, as that would cause the 'currentTime' property to reset
function PlaylistPopup(props) {
    const artistId = props.artistId;
    const audioPlayer = React.useRef(new Audio());
    var storedVolume = React.useRef(.5);
    var sliderDragging = React.useRef(false);
    const [currentArtistTracks, setCurrentTracks] = React.useState([]);
    const [displayedArtistTracks, setDisplayedTracks] = React.useState([]);
    const [currentTime, setCurrentTime] = React.useState()
    const [isPlaying, setPlaying] = React.useState(false);
    const [currentTrack, setTrack] = React.useState();
    const [itemId, setItemId] = React.useState();
    const [isOpen, setIsOpen] = React.useState(false);
    const [audioVolume, setVolume] = React.useState(.5)
    const toggle = () => setPlaying(!isPlaying);

    isPlaying ? playAudio() : pauseAudio()
    audioPlayer.current.volume = audioVolume


    audioPlayer.current.ontimeupdate = (e) => {
        if(!sliderDragging.current){
        setCurrentTime(audioPlayer.current.currentTime)
        }
    }

    React.useEffect(() => {
        getArtistAlbum();
    }, [artistId]); 

    React.useEffect(() => {
        if (currentTrack != undefined) {
        audioPlayer.current.src = currentTrack.preview_url;
        audioPlayer.current.load();
        }
    }, [currentTrack]);

    function playAudio() {
        if(!sliderDragging.current){
        audioPlayer.current.play()
        }
    }

    function pauseAudio() {
        audioPlayer.current.pause()
    }

    //for some reason, the audioplayer.current.ended does not fire (more specifically, the playbackrate cannot be positive in order for it to fire)
    //this is just a simpler solution
    audioPlayer.current.onended = () => {
        nextSong();
    }
    //had to change the get request as the Spotify API params dont support 'top-tracks'. Also, country is for some reason a required param
    const getArtistAlbum = async() => {
            if (artistId) {
            axios({
                method: 'post',
                url: apiUrl+'getSongs',
                withCredentials: true,
                data: {artistId},
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
            <div className='relative flex ml-16'><img className='border rounded-[50%] border-transparent' src={currentTrack.album.images[0].url}></img>
                <div className='flex flex-col'>
                    <label className='text-2xl mt-3 ml-3 my-auto'>{currentTrack.name}</label>
                    <label className='text-sm ml-3 my-auto' onClick={()=> {

                        setDisplayedTracks(currentArtistTracks);
                    }}>{currentTrack.artists[0].name}</label>
                    <div className='flex-1'></div>
                </div>
            </div>)
        } else {
            return 
        }
    }

    function speakerIcon() {
        if (audioVolume == 0) {
            return <SpeakerXMarkIcon className='h-10' onClick={() => {
                setVolume(storedVolume.current);
            }}/>
        } else {
            return <SpeakerWaveIcon className='h-10' onClick={() => {
                storedVolume.current = audioVolume;
                setVolume(0);
            }}/>
        }
    }

    function nextSong(){
        setPlaying(false)
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
        setPlaying(false)
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
            return <input type="range" min="0" max={audioPlayer.current.duration} value={currentTime} onMouseDown={() => {sliderDragging.current = true; audioPlayer.current.pause();}} onMouseUp={() => {sliderDragging.current = false; audioPlayer.current.play();}} step="1" onChange={(e) => 
                {audioPlayer.current.currentTime = parseInt(e.target.value); setCurrentTime(parseInt(e.target.value))}}/>
        } else {return <div></div>}
    }

    return (
    <div className={`${isOpen ? "h-full w-full overflow-y-scroll" : "h-[0vh] w-full"} transition-all duration-[400ms] bg-gray-400 fixed bottom-0`}>
            {displayedArtistTracks.map(item => (
                <div key={item.id} className='flex border mx-auto bg-gray-500 border-black w-[50%] mb-5 h-[20vh]'>
                        <img src={item.album.images[0].url} alt='' className='trackImg'></img>
                    <div>
                        <p className="text-3xl">{item.name}</p>
                        <p className="text-xl">Duration: {convertMs(item.duration_ms)}m</p>
                    </div>
                        <button className="w-[15%] ml-auto" onClick={() => {
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
                </div>))}<div className={`${isOpen? "h-[13vh]" : "h-[0vh]"}`}></div>
                
{/**----------------------------------------------------------Media Bar---------------------------------------------------------------------------- */}
            
            <div className="h-[13vh] overflow-hidden transition-all duration-300 flex fixed bg-gray-500 border border-black bottom-0 w-full">
            <button disabled={displayedArtistTracks.length===0} className={`${isOpen ? "" : "rotate-180"} z-10 transition-all fixed`} onClick={()=>{setIsOpen(!isOpen)}}><ArrowDownIcon className='h-10'/></button>
                <div className="flex flex-1">
                    {displayPlaying()}
                </div>
                <div className="flex flex-1 justify-center">
                <div className='flex flex-col justify-center items-center'>
                <div className='flex gap-5'>
                <button disabled={audioPlayer.current.error} onClick={() => {
                    audioPlayer.current.currentTime = audioPlayer.current.currentTime - 5;
                }}>
                    <ArrowUturnLeftIcon className='h-10'/>
                </button>
                <button disabled={audioPlayer.current.error} onClick={() => {
                    if (itemId > 0){
                        previousSong();
                }}}><BackwardIcon className='h-10'/></button>
                <button disabled={audioPlayer.current.error} onClick={() => {
                            toggle();
                        }}>{isPlaying ? <PauseCircleIcon className='h-10'/> : <PlayCircleIcon className='h-10'/>}</button>
                <button disabled={audioPlayer.current.error} onClick={() => {
                    if (itemId < currentArtistTracks.length-1){
                        nextSong();
                    }}}><ForwardIcon className='h-10'/></button>
                <button disabled={audioPlayer.current.error} onClick={() => {
                    audioPlayer.current.currentTime = audioPlayer.current.currentTime + 5;
                }}>
                    <ArrowUturnRightIcon className='h-10'/>
                </button>
                </div>
                <div>
                    {songSlider()}
                    <label className="ml-5">{convertMs(audioPlayer.current.currentTime * 1000)}</label>
                </div>
                </div>
                </div>
                <div className="flex flex-1 justify-center items-center">
                    {speakerIcon()}
                    <input className='ml-5' type="range" min="0" max="1" value={audioVolume} step=".01" onChange={(e)=> {setVolume(e.target.value)}}/>
                </div>
            </div>
    </div>
    )
}

export default PlaylistPopup