import React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';

//grabs the token and artistId so that we can find the tracks for the particular artist the user clicked on
function SpotifySongs() {
    let artistId = window.sessionStorage.getItem("artistId");
    let token = window.localStorage.getItem("token");

    const [ArtistTracks, setArtistTracks] = useState([]);

    //had to change the get request as the Spotify API params dont support 'top-tracks'. Also, country is for some reason a required param
    const getArtistAlbum = async() => {
        try{
            let test = "https://api.spotify.com/v1/artists/"+artistId+"/top-tracks"
            const {data} = await axios.get(test, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }, 
                    params: {
                        country: "NA"
                    }
                })
                console.log(data);
                setArtistTracks(data.tracks);
                console.log(ArtistTracks);
            }catch(err) {
                console.log(err);
            }
        }

        getArtistAlbum();

    const renderArtistAlbum = () => {
        return ArtistTracks.map(item => (
            <div key={item.id}>
                <div className="trackInfo">
                    <p className="trackName">{item.name}</p>
                    <p className="trackReleaseDate">Duration: {item.duration_ms}ms</p>
                </div>
            </div>
            ))
    }

    return (
        renderArtistAlbum()
    )
}

export default SpotifySongs