import NavbarComponent from './Components/Navbar.js';
import Home from './Webpages/Home.js';
import OuterWear from './Webpages/OuterWear.js';
import Undergarments from './Webpages/Undergarments.js';
import MiningEssentials from './Webpages/MiningEssentials.js';
import Sculptures from './Webpages/Sculptures.js';
import {BrowserRouter, Route, Routes} from 'react-router';

function App() {
    return(
        <div className='App'>
            <NavbarComponent/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={Home}/>
                    <Route path="/OuterWear" Component={OuterWear}/>
                    <Route path="/Undergarments" Component={Undergarments}/>
                    <Route path="/MiningEssentials" Component={MiningEssentials}/>
                    <Route path="/Sculptures" Component={Sculptures}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;