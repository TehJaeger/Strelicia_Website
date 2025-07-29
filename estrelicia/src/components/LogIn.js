import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LogIn.css';
import '../App.css';


const LogInSignup = () => {

    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction('active');
    }
    const loginLink = () => {
        setAction('');
    }


  return (
    <div className='container'>
    <div className='wrapper'>
        <div className='form-box login'>
              <form action ="">
                <h1>Login</h1>
                <div className='input-box'>
                    <i class="fa-solid fa-envelope"></i><input type='email' placeholder='Email'/>
                </div>
                <div className='input-box'>
                    <i class="fa-solid fa-lock"></i><input type='password' placeholder='Password'/>
                </div>

                <div className='remember-forgot'>
                    <label><input type='checkbox' /> Remember me</label>
                    <Link to="/new-pass" className="loginlink">Forgot Password</Link>
                </div>

                <button type="submit">Login</button>

                <div className='register-link'>
                    <p>Não tem uma conta? <Link to="/sign-up" className="loginlink">Registar</Link></p>
                </div>
              </form>
        </div>
    </div>
    </div>
  )
}

export default LogInSignup


