import SpotifyAPI from './Webpages/SpotifyAPI.js';
import BannerSection from './Components/Banner';
import {BrowserRouter, Route, Routes} from 'react-router';

function App() {
  return (
    <div className="App">
        <BannerSection/>
        {/** <NavBar /> || Include this when there's more than 1 page*/}
        <Routes>
          <Route path="/" Component={SpotifyAPI}/>
        </Routes>
    </div>
  );
}

export default App;
