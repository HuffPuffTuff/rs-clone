import { FirebaseApp } from '@firebase/app-types';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase-context';
import * as ROUTES from '../constants/routes';
import './login.scss';
import { MyError } from '../types/types';


import { getError } from '../firebase/services';

export default function Login() {
  const navigate = useNavigate();
  const firebase = useContext(FirebaseContext)?.firebase as FirebaseApp;

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const auth = getAuth(firebase);

      signInWithEmailAndPassword(auth, emailAddress, password)
        .then((value) => {
          localStorage.setItem('auth-user', JSON.stringify(value.user));
        })
        .then(() => {
          setTimeout(() => {
            navigate(ROUTES.DASHBOARD);
          }, 100);
        }).catch((e) => {
          const error = e as MyError;
          const message = getError(error)
          setError(message)
        });
      
    } catch {
      setEmailAddress('');
      setPassword('');
      setError('Invalid email address or password!');
    }
  };
  useEffect(() => {
    document.title = 'Login - Instagram';
  }, []);

  return (
    <main className="login-page page">
      <div className="login-page__wrapper">
        <div className="login-page__image login-image">
          <img
            className="login-image__item login-image__item--slide1"
            src="./images/login-img1.png"
            alt="Iphone with Instagram"
            width="250"
          />
          <img
            className="login-image__item login-image__item--slide2"
            src="./images/login-img2.png"
            alt="Iphone with Instagram"
            width="250"
          />
          <img
            className="login-image__item login-image__item--slide3"
            src="./images/login-img3.png"
            alt="Iphone with Instagram"
            width="250"
          />
          <img
            className="login-image__item login-image__item--slide4"
            src="./images/login-img4.png"
            alt="Iphone with Instagram"
            width="250"
          />
        </div>
        <div className="login-page__content">
          <div className="login-page__inner login-container">
            <header className="login-page__header login-header">
              <h1 className="login-header__title visually-hidden">Instagram</h1>
              <img
                className="login-header__logo"
                src="./images/logo.png"
                alt="Instagram logo"
                width="175"
                height="51"
              />
            </header>
            {error && <p className='error'>{error}</p>}

            <form
              className="login-page__form login-form"
              onSubmit={handleLogin}
              method="POST"
            >
              <input
                className="login-form__field field"
                type="text"
                aria-label="Enter your email address"
                placeholder="Email address"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />
              <input
                className="login-form__field field"
                type="password"
                aria-label="Enter your password"
                placeholder="Password"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
              />
              <button
                className="login-form__action button button--primary"
                disabled={isInvalid}
                type="submit"
              >
                Log In
              </button>
            </form>
          </div>
          <div className="login-page__signup login-container">
            <p>
              Don't have an account?{` `}
              <Link className="login-page__link link" to="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="signup-page__footer footer">
        <ul className="footer__owners owners">
          <li className="owners__item">
            <a className="owners__link" href="https://github.com/huffpufftuff">
              <img src="./images/github.svg" width="16" height="16" />
              <span>HuffPuffTuff</span>
            </a>
          </li>
          <li className="owners__item">
            <a className="owners__link" href="https://github.com/szyrwel">
              <img src="./images/github.svg" width="16" height="16" />
              <span>Szyrwel</span>
            </a>
          </li>
          <li className="owners__item">
            <a className="owners__link" href="https://github.com/sid-inc">
              <img src="./images/github.svg" width="16" height="16" />
              <span>Sid-inc</span>
            </a>
          </li>
        </ul>
        <span className="footer__text"> © 2023 Instagram from RSSchool </span>
        <div className="footer__rs rs">
          <img
            className="rs__image"
            src="./images/rs_school_js.svg"
            alt="rs school"
            width="80"
            height="29"
          />
          <a className="rs__link" href="https://rs.school/js/">
            Click to learn
          </a>
        </div>
      </footer>
    </main>
  );
}
