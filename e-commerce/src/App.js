import NavbarComponent from './Components/Navbar.js';
import Home from './Webpages/home.js'
import Shopping from './Webpages/shopping.js'
import {Route, Routes} from 'react-router-dom';

function App() {
    return(
        <div className='App'>
            <NavbarComponent/>
            <Routes>
                <Route index Component={Home}/>
                <Route path="/Shopping" Component={Shopping}/>
            </Routes>
        </div>
    );
}

export default App;