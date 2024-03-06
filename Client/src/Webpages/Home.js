import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function Home(){
    let test = Axios.get("/test")
    console.log(test)
    return(
        <div>
            <h1>Home Page Test</h1>
        </div>
    )
}

export default Home;