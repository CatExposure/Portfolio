import SpotifyAPI from './Webpages/SpotifyAPI.js';
import BannerSection from './Components/Banner';
import ThanksSpotify from './Webpages/ThanksSpotify';
import {BrowserRouter, Route, Routes} from 'react-router';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <BannerSection/>
        {/** <NavBar /> || Include this when there's more than 1 page*/}
        <Routes>
          <Route path="/SpotifyAPI" Component={SpotifyAPI}/>
          <Route path="/ThanksSpotify" Component={ThanksSpotify}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
