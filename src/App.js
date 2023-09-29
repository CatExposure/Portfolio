import Home from './Webpages/Home';
import Databases from './Webpages/Database_Usage';
import YouTubeAPI from './Webpages/YouTube_API';
import SpotifyAPI from './Webpages/Spotify_API';
import Contact from './Webpages/Contact';
import PageNotFound from './Webpages/404Page'
import NavBar from './Components/NavBar';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route exact path="*" Component={PageNotFound}/>
        <Route path="/" Component={Home}/>
        <Route path="/Contact" Component={Contact}/>
        <Route path="/YouTubeAPI" Component={YouTubeAPI}/>
        <Route path="/SpotifyAPI" Component={SpotifyAPI}/>
        <Route path="/Databases" Component={Databases}/>
      </Routes>
    </div>
  );
}

export default App;
