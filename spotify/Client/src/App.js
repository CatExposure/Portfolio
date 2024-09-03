import SpotifyAPI from './Webpages/SpotifyAPI';
import PageNotFound from './Webpages/404Page'
import BannerSection from './Components/Banner';
import {Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BannerSection/>
      {/** <NavBar /> || Include this when there's more than 1 page*/}
      <Routes>
        <Route path="/" Component={SpotifyAPI}/>
        <Route exact path="*" Component={PageNotFound}/>
      </Routes>
    </div>
  );
}

export default App;
