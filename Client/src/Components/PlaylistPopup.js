import React from 'react';
import axios from 'axios';
import {PlayCircleIcon, PauseCircleIcon, ArrowDownIcon} from '@heroicons/react/24/outline';
<script src="https://sdk.scdn.co/spotify-player.js"></script>

//grabs the token and artistId so that we can find the tracks for the particular artist the user clicked on
//we use 'useRef' for the audioplayer, otherwise every re-render will create another instance of an audioPlayer
//all useState force a re-render, which is crucial as data is not able to be manipulated once the program has rendered
//toggle is SOLEY used for play/pause on one song. For some reason, toggle does not like being used when switching to another song (we use setPlaying(--) instead)
//we create a useEffect that only runs after everything has been rendered the first time. We do this as we need to fetch the data only once
//we have another useEffect that runs every time the url Source is changed. Needed due to the fact that we need to load the audioplayer afterwards (allows us to continue where we previously paused)
//we also do not want to load every render, as that would cause the 'currentTime' property to reset
function PlaylistPopup(props) {
    const artistId = props.artistId;
    const token = window.localStorage.getItem("access_token");
    const audioPlayer = React.useRef(new Audio());
    const [ArtistTracks, setArtistTracks] = React.useState([]);
    const [isPlaying, setPlaying] = React.useState(false);
    const [urlSrc, setSrc] = React.useState();
    const [itemId, setItemId] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setPlaying(!isPlaying);

    isPlaying ? playAudio() : pauseAudio()
    
    audioPlayer.current.volume = .05; 

    React.useEffect(() => {
        getArtistAlbum();
    }, [artistId]);

    React.useEffect(() => {
        audioPlayer.current.src = urlSrc;
        audioPlayer.current.load();
    }, [urlSrc]);

    function playAudio() {
        audioPlayer.current.play()
    }

    function pauseAudio() {
        audioPlayer.current.pause()
    }

    //had to change the get request as the Spotify API params dont support 'top-tracks'. Also, country is for some reason a required param
    const getArtistAlbum = async() => {
            if (artistId) {
        try{
            let artistName = "https://api.spotify.com/v1/artists/"+artistId+"/top-tracks"
            const {data} = await axios.get(artistName, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, 
                    params: {
                        country: "NA"
                    }
                })
                setArtistTracks(data.tracks);
                setIsOpen(true);
            }catch(err) {
                console.log(err);
            }
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

    return (
    <div className={`${isOpen ? "h-full w-full" : "h-[10%] w-full"} transition-all duration-[400ms] bg-gray-400 fixed bottom-0`}>
        <ArrowDownIcon className={`${isOpen ? "" : "rotate-180"} z-10 transition-all relative h-10`} onClick={()=>{setIsOpen(!isOpen)}}/>
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
                                console.log(ArtistTracks.indexOf(item))
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
            <div className='fixed bg-gray-500 border border-black h-[10vh] bottom-0 flex justify-center gap-10 w-full'>
                <div>
                    <label>Now playing: {}</label>
                </div>
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
                }}}>Previous</button>
                <button className='' onClick={() => {
                            toggle();
                        }}>{isPlaying ? "Pause" : "Play"}</button>
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
                }}}>Next</button>
            </div>
    </div>
    )
}

export default PlaylistPopup