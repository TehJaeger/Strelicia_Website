import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'

function Navbar() {
    const[click, setClick] = useState(false);
    const[button, setButton] = useState(true)

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    
    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        }else {
            setButton(true);
        }
    };
    useEffect(() =>  {
        showButton()
    },[]);

    window.addEventListener('resize', showButton);

  return (
    <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <img src="/images/Img1.png" alt="Simbolo" className="navbar-image" />
                    <span className="navbar-text">
                        Strelicia <i className="fa-solid fa-house"></i>
                    </span>
                </Link>
                <div className = "menu-icon" onClick={handleClick}>
                    <i className={click ? 'fa-solid fa-times' : 'fa-solid fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}> 
                    <li className='nav-item'>
                        <Link to ='/' className='nav-links' onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to ='/Calender' className='nav-links' onClick={closeMobileMenu}>
                            Calender    
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to ='/Rent' className='nav-links' onClick={closeMobileMenu}>
                            Rent
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-links' href="https://drive.google.com/file/d/1KYuK4iDIww87NqKzCzXbZd-FILB7eR9Z/view" target="_blank" rel="noopener noreferrer">
                            Info
                        </a>
                    </li>
                    <li>
                        <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                            Sign Up
                        </Link>
                    </li>
                </ul>
                <Link to ='/sign-up' className='nav-links' onClick={closeMobileMenu} >
                {button && <Button buttonStyle='btn--outline'>SING UP</Button>}
                </Link>
            </div>
        </nav>

    </>
  )
}

export default Navbar
