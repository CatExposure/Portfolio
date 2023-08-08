import React from 'react';
import {Link} from 'react-router-dom';

function NavBar(){
    return(
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/API">API</Link></li>
            <li><Link to="/Databases">Database</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
        </ul>
    );
}

export default NavBar;