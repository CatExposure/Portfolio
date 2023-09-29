import "../styles/Spotify_API.css"
import React from 'react';
import {useEffect, useState} from "react";
import axios from 'axios';

/*
TO DO:
    change artist to songs if possible, mainly with the ability to play music, as well as show song name
    find out axios problem when going back to page or reloading page
*/
function SpotifyAPI(){
    const CLIENT_ID = "b0fddc430d1245ec9a363bee851354d8"; //identifier of the created app
    const REDIRECT_URI = "http://localhost:3000/SpotifyAPI"; //where the user will get redirected once they login through spotify
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"; //where the user will get directed once they click the login button on our page
    const RESPONSE_TYPE = "token"; //the token of their credentials and permissions

    const [token, setToken] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);
    const [Results, setResults] = useState(true)

    useEffect(()=> {
        //obtains the hash from our current webpage as well as token from our local storage (if we have one)
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");
        let userSearch = window.sessionStorage.getItem("userSearch")

        if (token && userSearch) {
            setSearchKey(userSearch);
            getArtists();
        }
        //if there is no token stored in the local storage (returned null) AND there is no hash...
        if(!token && hash) {
            //replaces the '#' and '?' symbols from our hash, then obtains the token using the urlParams.get function
            let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
            let token = urlParams.get('access_token');

            //once the token is obtained, removes the hash and sets the token value into our localStorage as 'token'
            window.location.hash="";
            window.localStorage.setItem("token", token);
            window.location.reload(false);
            window.sessionStorage.removeItem("userSearch");
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
    const searchVerify = async (e) => {
        e.preventDefault();

        //if the user entered nothing or uses the * character (explained more later) then set the results state to false and prevents the search from running
        //as for the * character, in the actual spotify app you can search with the * character, however the API seems to despise it.
        //I don't have enough knowledge on how their search params handle *, so we will refrain from using it for now
        if (searchKey.trim() === "" || searchKey.startsWith("*")) {
            setResults(false);
            return;
        }
        window.sessionStorage.setItem("userSearch", searchKey);
        getArtists()
    }


    const getArtists = async () => {
        try{
            const {data} = await axios.get("https://api.spotify.com/v1/search", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    q: searchKey,
                    type: "artist"
                }
            })

        //if the user enteres a value and there are no artists, set the Results state to false, and set to true in any other case (if there's at least 1 artist)
        if (data.artists.items.length === 0) {
            setResults(false);
        } else {
            setResults(true);
        }
        console.log(data);
        setArtists(data.artists.items);

    }catch(error){
        console.log(error);
    } 
    }

    const renderGenres = (item) => {
        var genreList = "";
        item.genres.forEach(genre => {
            genreList += genre+", ";
        })

        genreList = genreList.slice(0, -2);
        
        return genreList;
    }

    //maps out the artists and gives each artists a div with their id as the key, then includes an image and their name.
    //if the Results state is false, it will instead show no artists as this state would only be false if the search were to give an error or no artists
    const renderArtists = () => {
        if (Results === false) {
            return (
                <div></div>
            )
        } else {
            return artists.map(item => (
                    <div key={item.id}className="artistSection" onClick={() => window.location.assign(item.external_urls.spotify)}>
                        <div className="artistImage">
                            {item.images.length ? <img src={item.images[0].url} alt=""/> : <div>No Image</div>}
                        </div>
                        <div className="artistInfo">
                            <p className="artistName">{item.name}</p>
                            <p className="artistFollowers">Followers: {item.followers.total} </p>
                            <p className="artistGenres">Genres: {renderGenres(item)}</p>
                        </div>
                    </div>
                
            ));
        }
    }

    //will render a message stating there were no reults and to inform the user to refrain from using * if the Results state is false
    const renderResultsMessage = () => {
        if (Results === false) {
            return (
                <div>
                   <p>No results came up!</p>
                   <p>Refrain from using '*' in your searches</p>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }

    //allows the user to login to spotify (or log out if they are already logged in)
    const LoginOut = () => {
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

    //displays the search text input and button, as well as a message informing the user to login to use the spoitfy API if they are not
    //also displays the ResultsMessage and Artists
    return(
        <div>
            <h1>Spotify!</h1>
            {LoginOut()}
            {token ? 
                <form onSubmit={searchVerify}> 
                    <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                    <button type={"submit"}>Search</button>
                </form>

                : <h2>Please login to use search feature</h2>
            }
            <div id='artistSection'>

            </div>
            {renderResultsMessage()}
            <div className="artistResults">
                {renderArtists()}
            </div>
            
        </div>
    )
}

export default SpotifyAPI;