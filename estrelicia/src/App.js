import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Rent from './components/Pages/Rent';
import Calender from './components/Pages/Calender';
import SingUp from './components/Pages/SignUp';
import Login from './components/Pages/Login';

function App() {
  return (
    <>
    <Router>
        <Navbar/>
          <Routes>
            <Route path='/' exact Component= {Home}/>
            <Route path='/Rent' Component={Rent}/>
            <Route path='/Calender' Component={Calender} />
            <Route path='/sign-up' Component={SingUp} />
            <Route path='/log-in' Component={Login}/>
          </Routes>
      </Router>
    </>
  );
}

export default App;
