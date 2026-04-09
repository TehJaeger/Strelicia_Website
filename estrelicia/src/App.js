import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Calender from './components/Pages/Calender';
import Login from './components/Pages/Login';
import Admin from './components/Pages/Admin';
import More from './components/Pages/More';

function App() {
  return (
    <>
    <Router>
        <Navbar/>
          <Routes>
            <Route path='/' exact Component= {Home}/>
            <Route path='/Calender' Component={Calender}/>
            <Route path='/log-in' Component={Login}/>
            <Route path='/admin' Component={Admin}/>
            <Route path='/More' Component={More}/>
          </Routes>
      </Router>
    </>
  );
}

export default App;
