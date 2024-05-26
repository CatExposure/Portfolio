import Home from './Webpages/Home';
import Databases from './Webpages/DatabaseUsage';
import YouTubeAPI from './Webpages/YouTubeAPI';
import SpotifyAPI from './Webpages/SpotifyAPI';
import Contact from './Webpages/Contact';
import PageNotFound from './Webpages/404Page'
import SpotifySongs from "./Webpages/SpotifySongs"
import NavBar from './Components/NavBar';
import BannerSection from './Components/Banner';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BannerSection bannerClassName="flex flex-row w-full max-h-[20vh] bg-gradient-to-b to-gray-400 from-black py-2" imgClassName="h-28"/>
      <NavBar />
      <Routes>
        <Route path="" Component={Home}/>
        <Route exact path="*" Component={PageNotFound}/>
        <Route path="/Contact" Component={Contact}/>
        <Route path="/YouTubeAPI" Component={YouTubeAPI}/>
        <Route path="/SpotifyAPI" Component={SpotifyAPI}/>
        <Route path="/Databases" Component={Databases}/>
        <Route path="/404" Component={PageNotFound}/>
        <Route path="/SpotifySongs" Component={SpotifySongs}/>
      </Routes>
    </div>
  );
}

export default App;
