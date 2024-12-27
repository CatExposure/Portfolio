import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Webpages/home.js'
import Shopping from './Webpages/shopping.js'
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import NavbarComponent from './Components/Navbar.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={NavbarComponent}>
      <Route path="Home" Component={Home}/>
      <Route path="Shopping" Component={Shopping}/>
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
