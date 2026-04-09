import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'

function Navbar() {
    const[click, setClick] = useState(false);
    const[button, setButton] = useState(true)

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    
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
                    <img src="http://localhost:3001/images/Img1.png" alt="Simbolo" className="navbar-image" />
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
                            Calendário    
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-links' href="https://drive.google.com/file/d/1KYuK4iDIww87NqKzCzXbZd-FILB7eR9Z/view" target="_blank" rel="noopener noreferrer">
                            Info
                        </a>
                    </li>
                    <li>
                        <span className='nav-links-mobile' onClick={() => setShowModal(true)}>
                            Promoções
                        </span>
                    </li>
                </ul>
                {button && (<span className="nav-links" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }} >
                    <Button buttonStyle="btn--outline">
                        Promoções
                    </Button>
                </span>)}                
            </div>
        </nav>


        {showModal && (<div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

      <h3>Receba Promoções</h3>
      <h5>Receba avisos das nossas promoções por email</h5>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="submit-btn"
        onClick={async () => {
          const res = await fetch("http://localhost:3001/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          setMessage(data.message);

          if (res.ok) {
            setMessage("Subscrito com sucesso!");
            setEmail("");

            setTimeout(() => {
                setShowModal(false);
                setMessage(""); 
            }, 1200);
        }
        }}
      >
        Submeter
      </button>

      {message && <p className="modal-message">{message}</p>}
    </div>
    </div>
    )}
    </>
    
  )
}

export default Navbar
