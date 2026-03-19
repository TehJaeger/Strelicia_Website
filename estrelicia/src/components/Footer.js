import React from 'react';
import './Footer.css';
import '../App.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-card'>
        <p className='footer-text'>
            Junta-te a nós para uma estadia inesquecível.
            Numa casa luxuosa completamente equipada para ter as férias perfeitas junto á natureza.
        </p>
      </section>
      <div className='footer-links'>
        <div className='footer-links-wrapper'>
            <div className='footer-links-items'>
                <h2>About Us</h2>
                <a href={"https://share.google/XD2q2k9MFIRy9Z8YB"} target="_blank" rel="noopener noreferrer">Reviews</a>
            </div>
            <div className='footer-links-items'>
                <h2>Contactos</h2>
                <h5>+351 910 733 700</h5>
                <h5>969 134 039</h5>
                <h5>streliciahouse@gmail.com</h5>
            </div>
            <div className='footer-links-wrapper'>
            <div className='footer-links-items'>
                <h2>Social Media</h2>
                <a href={"https://www.instagram.com/streliciahouse/"} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            </div>
        </div>
      </div>
      <section className="social-media">
        <div className='social-media-wrap'>
            <div className='footer-logo'>
                <Link to='/' className='social-logo'>
                    <img src="http://localhost:3001/images/Img1.png" alt="Simbolo" className="navbar-image" />
                </Link>
            </div>
            <div className='social-icons'>
                <a className='social-icon-link Instagram' href={"https://www.instagram.com/streliciahouse/"} target="_blank" rel="noopener noreferrer">
                <i className='fab fa-instagram'/>
                </a>
            </div>
        </div>
      </section>
      <p>
        Made by{" "}
        <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
                Me 😊
        </a>
      </p>
    </div>

  )
}

export default Footer
