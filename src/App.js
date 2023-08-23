import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Databases from './Database_Usage';
import YouTubeAPI from './YouTube_API';
import SpotifyAPI from './Spotify_API';
import Contact from './Contact';
import PageNotFound from './404Page'
import NavBar from './NavBar';
import {Route, Link, Routes} from 'react-router-dom';

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
