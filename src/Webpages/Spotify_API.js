import React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';

function SpotifyAPI(){
    const CLIENT_ID = "b0fddc430d1245ec9a363bee851354d8"; //identifier of the created app
    const REDIRECT_URI = "http://localhost:3000/SpotifyAPI"; //where the user will get redirected once they login through spotify
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"; //where the user will get directed once they click the login button on our page
    const RESPONSE_TYPE = "token"; //the token of their credentials and permissions

    const [token, setToken] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);

    useEffect(()=> {
        //obtains the hash from our current webpage as well as token from our local storage (if we have one)
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        //if there is no token stored in the local storage (returned null) AND there is no hash...
        if(!token && hash) {
            //replaces the '#' and '?' symbols from our hash, then obtains the token using the urlParams.get function
            let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
            let token = urlParams.get('access_token');

            //once the token is obtained, removes the hash and sets the token value into our localStorage as 'token'
            window.location.hash="";
            window.localStorage.setItem("token", token);
            window.location.reload(false);
        }

        //lastly, sets the 'state' of token to the value of the token we obtained
        setToken(token);
    }, [])// because [] is blank, the useEffect function runs only on its initial render

    //sets the token state to blank and removes the localStorage token
    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        window.location.reload(false);
    }

    //we use axios as it is more secure (prevents xsrf), but functions similarly to a fetch request
    //we use an async function with await to ensure that no further code is executed before the fetch request is complete
    //lastly, we set the state of artists to an array of all the items for each artist in the data we fetched
    const searchArtists = async (e) => {
        e.preventDefault();
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })

        setArtists(data.artists.items);
    }

    //maps out the artists and gives each artists a div with their id as the key, then includes an image and their name.
    //make sure to include the try catch statement, otherwise this will give an error due to there being no artists to map out (as we haven't searched anything yet)
    const renderArtists = () => {
            return artists.map(artist => (
                <div key={artist.id}>
                    {artist.images.length ? <img src={artist.images[0].url} alt =""/> : <div>No Image</div>}
                    {artist.name}
                </div>
            ))
    }

    const test = () => {
        if (!token) {
            return (
                <div>
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a> 
                </div>
            )
        } else {
            return (
            <div>
                <button onClick={logout}>Logout</button>
            </div>
            )
        }
    }

    return(
        <div>
            <h1>Spotify!</h1>
            {test()}
            {token ? 
                <form onSubmit={searchArtists}> 
                    <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                    <button type={"submit"}>Search</button>
                </form>

                : <h2>Please login to use search feature</h2>
            }
            <div id='artistSection'>

            </div>
            {renderArtists()}

        </div>
    )
}

export default SpotifyAPI;