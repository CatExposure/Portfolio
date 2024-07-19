import React from 'react';
import axios from 'axios';
import {PlayCircleIcon, PauseCircleIcon, ArrowDownIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon} from '@heroicons/react/24/outline';
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
    const [ArtistTracks, setArtistTracks] = React.useState([]);
    const [currentTime, setCurrentTime] = React.useState()
    const [isPlaying, setPlaying] = React.useState(false);
    const [urlSrc, setSrc] = React.useState();
    const [itemId, setItemId] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);
    const [audioVolume, setVolume] = React.useState(.5)
    const toggle = () => setPlaying(!isPlaying);

    isPlaying ? playAudio() : pauseAudio()
    console.log(audioVolume);
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
        audioPlayer.current.src = urlSrc;
        audioPlayer.current.load();
    }, [urlSrc]);

    function playAudio() {
        console.log(sliderDragging.current)
        if(!sliderDragging.current){
        audioPlayer.current.play()
        }
    }

    function pauseAudio() {
        audioPlayer.current.pause()
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
                setArtistTracks(response.data.tracks);
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
        if (ArtistTracks[itemId] != undefined) {
            console.log(ArtistTracks[itemId]);
            return <div className='relative flex ml-16'><img className='border rounded-[50%] border-transparent' src={ArtistTracks[itemId].album.images[0].url}></img><div className='flex flex-col'><label className='text-2xl mt-3 ml-3 my-auto'>{ArtistTracks[itemId].name}</label><label className='text-sm ml-3 my-auto'>{ArtistTracks[itemId].artists[0].name}</label><div className='flex-1'></div></div></div>
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

    console.log(currentTime)
    function songSlider() {
        if (audioPlayer.current.src) {
            return <input type="range" min="0" max={audioPlayer.current.duration} value={currentTime} onMouseDown={() => {sliderDragging.current = true; audioPlayer.current.pause();}} onMouseUp={() => {sliderDragging.current = false; audioPlayer.current.play();}} step="1" onChange={(e) => 
                {audioPlayer.current.currentTime = parseInt(e.target.value); setCurrentTime(parseInt(e.target.value))}}/>
        }
    }

    return (
    <div className={`${isOpen ? "h-full w-full overflow-y-scroll" : "h-[13vh] w-full"} transition-all duration-[400ms] bg-gray-400 fixed bottom-0`}>
        <ArrowDownIcon className={`${isOpen ? "" : "rotate-180"} z-10 transition-all fixed h-10`} onClick={()=>{setIsOpen(!isOpen)}}/>
            {ArtistTracks.map(item => (
                <div key={item.id} className='flex border bg-gray-500 border-black w-[50%] mb-5 h-[20vh]'>
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
                                setSrc(item.preview_url);
                                setItemId(ArtistTracks.indexOf(item));
                                audioPlayer.current.oncanplay = function() {
                                    //for some reason, toggle does NOT work here, even though it should do the exact same thing
                                    setPlaying(true);
                                };
                            };
                        }}>{changeButtonImg(item.preview_url)}</button>
                </div>))}<div className="h-[10vh]"></div>
                
{/**----------------------------------------------------------Popup Bar---------------------------------------------------------------------------- */}
            
            <div className='flex fixed bg-gray-500 border border-black h-[13vh] bottom-0 w-full'>
                <div className="flex flex-1">
                    {displayPlaying()}
                </div>
                <div className="flex flex-1 justify-center">
                <div className='flex flex-col justify-center items-center'>
                <div className='flex gap-5'>
                <button className='' onClick={() => {
                    if (itemId > 0){
                        setPlaying(false)
                        let newItemId = itemId-1
                        let newSrc = ArtistTracks[newItemId].preview_url;
                        setSrc(newSrc);
                        setItemId(newItemId);
                        audioPlayer.current.oncanplay = function() {
                            //for some reason, toggle does NOT work here, even though it should do the exact same thing
                            setPlaying(true);
                        };
                }}}><BackwardIcon className='h-10'/></button>
                <button className='' onClick={() => {
                            toggle();
                        }}>{isPlaying ? <PauseCircleIcon className='h-10'/> : <PlayCircleIcon className='h-10'/>}</button>
                <button className='' onClick={() => {
                    console.log(ArtistTracks.length)
                    if (itemId < ArtistTracks.length-1){
                        setPlaying(false)
                        let newItemId = itemId+1
                        let newSrc = ArtistTracks[newItemId].preview_url;
                        setSrc(newSrc);
                        setItemId(newItemId);
                        audioPlayer.current.oncanplay = function() {
                            //for some reason, toggle does NOT work here, even though it should do the exact same thing
                            setPlaying(true);
                        };
                }}}><ForwardIcon className='h-10'/></button>
                </div>
                    {songSlider()}
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