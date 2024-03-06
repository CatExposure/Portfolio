import React from 'react'
import axios from 'axios'

function Databases(){
    return(
        <div>
            <h1>Databases</h1>
            <p>{axios.get("http://localhost:3000/test")}</p>
        </div>
    )
}

export default Databases;