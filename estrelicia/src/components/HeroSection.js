import React from 'react';
import {Button} from './Button';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import '../App.css'

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src="http://localhost:3001/images/video-1.mp4" autoPlay loop muted/>
        <h1>Novas Experiências</h1>
        <p>Momentos inesquecíveis</p>
        <div className='hero-btns'>
            <Link to='/Calender'>
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                Reservar
            </Button>
            </Link>
            <Link to='/More'>
            <Button  className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                Saber Mais
            </Button>
            </Link>
        </div>
    </div>
  )
}

export default HeroSection
