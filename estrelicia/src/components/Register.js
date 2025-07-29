import React from 'react';
import { Link } from 'react-router-dom';
import './LogIn.css';
import '../App.css';


function Register() {
  return (
    <div className='container'>

      <div className='wrapper'>
        <div className='form-box register'>
              <form action ="">
                <h1>Registar</h1>
                <div className='input-box'>
                    <i class="fa-solid fa-user"></i><input type='text' placeholder='Primeiro Nome'/>
                </div>
                <div className='input-box'>
                    <i class="fa-solid fa-user"></i><input type='text' placeholder='Ultimo Nome'/>
                </div>
                <div className='input-box'>
                    <i class="fa-solid fa-envelope"></i><input type='email' placeholder='Email'/>
                </div>
                <div className='input-box'>
                    <i class="fa-solid fa-lock"></i><input type='password' placeholder='Password'/>
                </div>

                <div className='remember-forgot'>
                    <label><input type='checkbox' /> Concordo com os termos e condições</label>
                </div>

                <button type="submit">Registar</button>

                <div className='register-link'>
                    <p>Já tem uma conta?  <Link to="/log-in" className="registerlink">Log in</Link></p>
                </div>
              </form>
        </div>
    </div>
    </div>
  )
}

export default Register
