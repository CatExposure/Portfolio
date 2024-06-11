import React from 'react';
import {useEffect, useState} from "react";
import Axios from 'axios';
import {redirectUri} from "../Components/Api"
import {apiUrl} from "../Components/Api"
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function SpotifyAPI(){
    const urlParams = new URLSearchParams(window.location.search);
    const token = window.localStorage.getItem("access_token");
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);
    const [Results, setResults] = useState("")

    if (urlParams.get('code')){
        window.sessionStorage.setItem("code", urlParams.get('code'))
        console.log(window.sessionStorage.getItem("code_verifier"));
        getToken();
    }

    function getAuth(){
        try {
            Axios.get(apiUrl+"authorization").then((response) => {
                window.sessionStorage.setItem("code_verifier", response.data.codeVerifier);
                window.sessionStorage.setItem("state", response.data.state);
                window.location.href = (response.data.authUrl);
            });
        } catch(err) {
            console.log(err)
        }
    }

    async function preCheck(){
        let result
        await Axios({
            method: 'post',
            url: apiUrl+"tokenPreCheck",
            data: {
                state: window.sessionStorage.getItem("state")
            },
        }).then((response) => {
            result = response.data;
        })
        return result
    }

    async function getToken(){
        console.log("test")
        if (await preCheck() === true){
            Axios({
                method: 'post',
                url: apiUrl+"token",
                data: {
                    code: window.sessionStorage.getItem("code"),
                    codeVerifier: window.sessionStorage.getItem("code_verifier")
                }
            }).then((response) => {
                console.log(response);
                window.localStorage.setItem('access_token', response.data.access_token);
                window.localStorage.setItem('refresh_token', response.data.refresh_token);
                window.localStorage.setItem('expr', response.data.expires_in)
                window.location.href = redirectUri+"SpotifyAPI";
            });
        }
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
    const logout = () => {
        window.localStorage.removeItem("access_token");
        window.location.href = redirectUri+"SpotifyAPI";
    }

    //we use axios as it is more secure (prevents xsrf), but functions similarly to a fetch request
    //we use an async function with await to ensure that no further code is executed before the fetch request is complete
    //we also use a try catch statement to ensure the webpage does not crash as well as provide error responses
    //lastly, we set the state of artists to an array of all the items for each artist in the data we fetched
    const getArtists = async () => {
        if (searchKey) {
        try{
            const {data} = await Axios.get("https://api.spotify.com/v1/search", {
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
            setResults("");
        } else {
            setResults("true");
        }
        setArtists(data.artists.items);

    }catch(error){
        console.log(error);
    } 
    }
}

    //renders the genres of a particular artist in case they have more than one genre
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
    //clicking on a artist send the user to another page to view their top-10 tracks, as well as the ability to play them
    const renderArtists = () => {
        if (Results === "false" || Results.trim() === "") {
            return (
                <></>
            )
        } else {
            return artists.map(item => (
                    <div className="flex border h-[20vh] border-black border-solid w-[50%] mt-5 transition-all bg-gray-600 hover:bg-gray-500 hover:h-[23vh] hover:ml-10" key={item.id} onClick={() => {
                        window.localStorage.setItem("artistId", item.id)
                        window.location.assign(redirectUri+"SpotifySongs");
                    }}>
                        {item.images.length ? <img className="h-full" src={item.images[0].url} alt=""/> : <div>No Image</div>}
                        <div className="ml-5">
                            <p className="text-6xl mb-3">{item.name}</p>
                            <p className="text-xl">Followers: {item.followers.total} </p>
                            <p className="text-xl">Genres: {renderGenres(item)}</p>
                        </div>
                    </div>
                
            ));
        }
    }

    //will render a message stating there were no reults and to inform the user to refrain from using * if the Results state is false
    const renderResultsMessage = () => {
        if (Results === "false") {
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
        if (token === null) {
            return (
                <div>
                    <button onClick={()=> {getAuth()}}>Login</button>
                </div>
            )
        } else {
            return (
            <div>
                <button className="text-2xl border border-black rounded-md p-1 bg-gray-600" onClick={logout}>Log out</button>
            </div>
            )
        }
    }

    //displays the search text input as well as a message informing the user to login to use the spoitfy API if they are not
    //also displays all the render components
    return(
        <div className="bg-gray-400 min-h-screen max-h-full">
            <div className="ml-20 flex gap-10">
            {LoginOut()}
            {token ? 
                <form className="flex"> 
                    <p className="text-black text-2xl mr-3">Search here: </p><input className="text-black border border-black bg-gray-500 rounded-md pl-2" type="text" placeholder="Search Artist Here" onChange={e => setSearchKey(e.target.value)}/>
                </form>

                : <h2>Please login to use search feature</h2>
            }
            </div>
            <div id='artistSection'>

            </div>
            {renderResultsMessage()}
            <div className="ml-5">
                {renderArtists()}
            </div>
            <div className='pt-10'></div>
        </div>
    )
}

export default SpotifyAPI;