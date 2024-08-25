import React from 'react';
import {useEffect, useState} from "react";
import Axios from 'axios';
import {apiUrl} from "../Components/Api";
import PlaylistPopup from  "../Components/PlaylistPopup";
<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

function SpotifyAPI(){
    const [searchKey, setSearchKey] = useState("");
    const [artists, setArtists] = useState([]);
    const [Results, setResults] = useState("")
    const [artistId, setArtistId] = useState();
    const [validation, setValidation] = useState();
    const [toolTip, tooltipVisible] = useState([]);

    useEffect(() => {
        getValidation();
    }, []);

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
                    <div className="flex min-w-0 border h-[20vh] border-black border-solid max-w-[95%] sm:w-[80%] lg:w-[60%] xl:w-[50%] mt-5 transition-all bg-gray-600 hover:bg-gray-500 hover:h-[23vh] hover:ml-3 lg:hover:ml-10" key={item.id}
                    onMouseEnter= {() => {
                        tooltipVisible({[item.id]: true})
                    }} 

                    onMouseLeave={() => {
                        tooltipVisible({[item.id]: false})
                    }}

                    onClick={() => {
                        setArtistId(item.id);
                        
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
                        <div className={`${toolTip[item.id] ? "opacity-90 duration-300 delay-500" : "opacity-0"} absolute bg-white rounded-md px-1 right-[2%] w-fit sm:text-xl xl:text-2xl sm:left-[70%] lg:left-[60%] xl:left-[50%] mt-5 sm:mt-12`} >{item.name}</div></div>
                    </>
                    
                
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
    //displays the search text input as well as a message informing the user to login to use the spoitfy API if they are not
    //also displays all the render components
    return(
        <div className="bg-gray-400 min-h-screen max-h-full">
            <div className="ml-20 max-[640px]:flex-col sm:flex sm:gap-10">
                <div className=''>{LoginOut()}</div>
                {validation ? 
                    <div className="flex max-[640px]:mt-5"> 
                        <p className="text-black text-lg sm:text-2xl mr-3">Search here: </p><input className="text-black border border-black bg-gray-500 rounded-md pl-2" type="text" placeholder="Search Artist Here" onChange={e => setSearchKey(e.target.value)}/>
                    </div>

                    : <h2>Please login to use search feature</h2>
                }
            </div>
            <div id='artistSection'>

            </div>
            {renderResultsMessage()}
            <div className="ml-5">
            {renderArtists()}
            </div><div className='h-[19vh]'></div>
            <PlaylistPopup artistId={artistId} forceOpen={true}/>
        </div>
    )
}

export default SpotifyAPI;