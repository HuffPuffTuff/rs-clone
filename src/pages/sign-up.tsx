import { FirebaseApp } from '@firebase/app-types';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserData, doesUsernameExist, getError } from '../firebase/services';
import FirebaseContext from '../context/firebase-context';
import * as ROUTES from '../constants/routes';
import { MyError } from '../types/types';
import './sign-up.scss';

export default function SignUp() {
  const navigate = useNavigate();
  const firebase = useContext(FirebaseContext)?.firebase as FirebaseApp;

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const auth = getAuth(firebase);
        const createUserResult = await createUserWithEmailAndPassword(
          auth,
          emailAddress,
          password
        );
        
        updateProfile(createUserResult.user, {
          displayName: username.toLowerCase(),
        });

        const newUser = {
          userId: createUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLocaleLowerCase(),
          following: [],
          followers: [],
          dateCreated: Date.now(),
          avatarData: {
            avatarSrc: '',
            imagePath: '',
          },
        };
        setUserData(newUser);
        
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        const err = error as MyError;
        const message = getError(err);

        setFullName('');
        setEmailAddress('');
        setPassword('');
        setError(message);
      }
    } else {
      setError('That username is already taken, please try another!');
    }
  };

  useEffect(() => {
    document.title = 'Sign Up - Instagram';
  }, []);

  return (
    <main className="signup-page page">
      <div className="signup-page__inner login-container">
        <header className="signup-page__header signup-header">
          <h1 className="signup-header__title visually-hidden">Instagram</h1>
          <img
            className="signup-header__logo"
            src="./images/logo.png"
            alt="Instagram logo"
            width="175"
            height="51"
          />
          <h2 className="signup-header__text">
            Sign up to see photos and videos from your friends.
          </h2>
        </header>

        {error && <p className='error'>{error}</p>}

        <form
          className="signup-page__form signup-form"
          onSubmit={handleSignUp}
          method="POST"
        >
          <input
            className="signup-form__field field"
            type="text"
            aria-label="Enter your username"
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
          />
          <input
            className="signup-form__field field"
            type="text"
            aria-label="Enter your full name"
            placeholder="Full Name"
            onChange={({ target }) => setFullName(target.value)}
            value={fullName}
          />
          <input
            className="signup-form__field field"
            type="text"
            aria-label="Enter your email address"
            placeholder="Email address"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
          />
          <input
            className="signup-form__field field"
            type="password"
            aria-label="Enter your password"
            placeholder="Password"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />
          <p className="signup-form__text">
            By signing up, you agree to our Terms.
          </p>
          <button
            className="signup-form__action button button--primary"
            disabled={isInvalid}
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className="signup-page__login login-container">
        <p>
          Have an account?{` `}
          <Link className="signup-page__link link" to={ROUTES.LOGIN}>
            Log In
          </Link>
        </p>
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
