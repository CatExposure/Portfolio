import React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';
import {useRef} from 'react';
import "../styles/SpotifySongs.css"
<script src="https://sdk.scdn.co/spotify-player.js"></script>

//grabs the token and artistId so that we can find the tracks for the particular artist the user clicked on
//we use 'useRef' for the audioplayer, otherwise every re-render will create another instance of an audioPlayer
//all useState force a re-render, which is crucial as data is not able to be manipulated once the program has rendered
//toggle is SOLEY used for play/pause on one song. For some reason, toggle does not like being used when switching to another song (we use setPlaying(--) instead)
//we create a useEffect that only runs after everything has been rendered the first time. We do this as we need to fetch the data only once
//we have another useEffect that runs every time the url Source is changed. Needed due to the fact that we need to load the audioplayer afterwards (allows us to continue where we previously paused)
//we also do not want to load every render, as that would cause the 'currentTime' property to reset
function SpotifySongs() {
    let artistId = window.sessionStorage.getItem("artistId");
    let token = window.localStorage.getItem("token");
    const audioPlayer = useRef(new Audio());
    let buttonImg

    const [ArtistTracks, setArtistTracks] = useState([]);
    const [isPlaying, setPlaying] = useState(false);
    const [urlSrc, setSrc] = useState();
    const toggle = () => setPlaying(!isPlaying);

    isPlaying ? playAudio() : pauseAudio()
    
    audioPlayer.current.volume = .05; 

    useEffect(() => {
        getArtistAlbum();
    }, []);

    useEffect(() => {
        audioPlayer.current.src = urlSrc;
        audioPlayer.current.load();
    }, [urlSrc]);

    function playAudio() {
        audioPlayer.current.play()
        buttonImg = require("../Images/pauseButton.png")
    }

    function pauseAudio() {
        audioPlayer.current.pause()
        buttonImg = require("../Images/playButton.png")
    }
    //had to change the get request as the Spotify API params dont support 'top-tracks'. Also, country is for some reason a required param
    const getArtistAlbum = async() => {
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
                setArtistTracks(data.tracks)
            }catch(err) {
                console.log(err);
            }
        }

    //converts ms into M:S
    function convertMs(mS) {
        var minutes = Math.floor(mS / 60000);
        var seconds = ((mS % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
            (minutes+1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
          );
    }

    const render = () => {
        return (
            <div className='wrapper'>
                {ArtistTracks.map(item => (
                    <div key={item.id} className='trackTable'>
                        <div className='trackImgContainer'>
                            <img src={item.album.images[0].url} alt='' className='trackImg'></img>
                        </div>
                        <div className="trackInfo">
                            <p className="trackName">{item.name}</p>
                            <p className="trackReleaseDate">Duration: {convertMs(item.duration_ms)}</p>
                        </div>
                        <div className='playButton'>
                            <button onClick={() => {
                                if (item.preview_url === audioPlayer.current.src){
                                    toggle();
                                } else {
                                    console.log(ArtistTracks.indexOf(item))
                                    setPlaying(false);
                                    setSrc(item.preview_url);
                                    audioPlayer.current.oncanplay = function() {
                                        //for some reason, toggle does NOT work here, even though it should do the exact same thing
                                        setPlaying(true);
                                    };
                                };
                            }}><img src={buttonImg} alt="" className='playButtonImg'></img></button>
                        </div>
                    </div>))}
                    <div className='audioPlayer_GUI'>
                        <button className='GUI_ITEM'>Previous</button>
                        <button className='GUI_ITEM'>Play</button>
                        <button className='GUI_ITEM'>Next</button>
                    </div>
            </div>
            )
    }

    return (
        render()
    )
}

export default SpotifySongs