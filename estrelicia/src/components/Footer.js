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
                <Link to='/sign-up'>Como funciona</Link>
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
                <a href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">Youtube</a>
                <a href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
            </div>
        </div>
      </div>
      <section className="social-media">
        <div className='social-media-wrap'>
            <div className='footer-logo'>
                <Link to='/' className='social-logo'>
                    <img src="/images/Img1.png" alt="Simbolo" className="navbar-image" />
                </Link>
            </div>
            <div className='social-icons'>
                <a className='social-icon-link Instagram' href={"https://www.instagram.com/streliciahouse/"} target="_blank" rel="noopener noreferrer">
                <i className='fab fa-instagram'/>
                </a>
                <a className='social-icon-link Youtube' href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">
                <i className='fab fa-youtube'/>
                </a>
                <a className='social-icon-link Facebook' href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">    
                <i className='fab fa-facebook-f'/>
                </a>
                <a className='social-icon-link Twitter' href={"https://www.youtube.com/@rievolutioncycling6178"} target="_blank" rel="noopener noreferrer">   
                <i className='fab fa-twitter'/>
                </a>
            </div>
        </div>
      </section>
    </div>

  )
}

export default Footer
