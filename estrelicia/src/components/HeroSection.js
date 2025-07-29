import React from 'react';
import {Button} from './Button';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import '../App.css'

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src="/videos/video-1.mp4" autoPlay loop muted/>
        <h1>Novas Experiências</h1>
        <p>Momentos inesquecíveis</p>
        <div className='hero-btns'>
            <Link to='/Rent'>
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                Alugar
            </Button>
            </Link>
            <Button  className='btns' buttonStyle='btn--primary' buttonSize='btn--large' onClick={() => window.open('https://www.instagram.com/streliciahouse/', '_blank')}>
                Ver Mais
            </Button>
            <Button className = 'btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                Play <i className='far fa-play-circle' />
            </Button>
        </div>
    </div>
  )
}

export default HeroSection
