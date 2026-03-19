import React from "react";
import'../../App.css';
import HeroSection from "../HeroSection";
import Cards from "../Cards";
import Footer from "../Footer";
import Popup from "../Popup";

function Home(){
    return(
        <>
        <Popup />
        <HeroSection/>
        <Cards />
        <Footer/>
        </>
    );
}

export default Home;