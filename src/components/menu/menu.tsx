import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import FirebaseContext from '../../context/firebase-context';
import UserContext from '../../context/user-context';
import LoadPhotoButton from '../loadPhotoButton/loadPhotoButton';
import * as ROUTES from '../../constants/routes';

import './menu.scss';
import { FirebaseApp } from '@firebase/app-types';
import SearchBlock from '../searhBlock/searchBlock';
import { IPhotoDoc } from '../../types/types';
import { ThemeContext, themes } from '../../context/theme-context';
import Toggle from '../toggle/toggle';

interface MenuProps {
  isMainPage: boolean;
  profileUsername?: string;
}

export default function Menu({
  isMainPage,
  profileUsername,
}: MenuProps) {
  const firebase = useContext(FirebaseContext)?.firebase as FirebaseApp;
  const [searchBlock, setSearchBlock] = useState(false);
  const { user } = useContext(UserContext);

  function openSearchBlock(): void {
    setSearchBlock(true);
  }
  
  function closeSearchBlock(): void {
    setSearchBlock(false);
  }

  return (
    <nav className={searchBlock ? 'main-nav main-nav--compact' : 'main-nav'}>
      <Link className="main-nav__logo" to={ROUTES.DASHBOARD}>
        <img
          className="main-nav__image"
          src="./images/logo.png"
          alt="Instagram logo"
          width="103"
          height="29"
        />
      </Link>
      <ul className="main-nav__inner">
        <li className="main-nav__item">
          <Link
            className={
              isMainPage && !searchBlock
                ? 'main-nav__link main-nav__link--home main-nav__link--active'
                : 'main-nav__link main-nav__link--home'
            }
            to={ROUTES.DASHBOARD}
          >
            <span className="main-nav__text">Home</span>
          </Link>
        </li>
        <li className="main-nav__item main-nav__item--search">
          <a
            className={
              searchBlock
                ? 'main-nav__link main-nav__link--search main-nav__link--active'
                : 'main-nav__link main-nav__link--search'
            }
            onClick={openSearchBlock}
          >
            <span className="main-nav__text">Search</span>
          </a>
        </li>
        <li className="main-nav__item">
          <LoadPhotoButton
            isMainPage={isMainPage}
            profileUsername={profileUsername}
          />
        </li>
        <li className="main-nav__item">
          {user ? (
            <Link
              className={
                isMainPage
                  ? 'main-nav__link main-nav__link--profile'
                  : 'main-nav__link main-nav__link--profile main-nav__link--active'
              }
              to={`/${user.displayName}`}
            >
              <span className="main-nav__text">Profile</span>
            </Link>
          ) : null}
        </li>
        <li className="main-nav__item main-nav__item--theme">
        <ThemeContext.Consumer>
          {({ theme, setTheme }) => (
            <Toggle
              onChange={() => {
                if (theme === themes.light) setTheme(themes.dark)
                if (theme === themes.dark) setTheme(themes.light)
              }}
              value={theme === themes.dark}
            />
          )}
        </ThemeContext.Consumer>
        </li>
        <li className="main-nav__item">
          <a
            className="main-nav__link main-nav__link--signout"
            type="button"
            onClick={() => signOut(getAuth(firebase))}
          >
            <span className="main-nav__text">Sign Out</span>
          </a>
        </li>
      </ul>
      {searchBlock && <SearchBlock 
        closeSearchBlock={closeSearchBlock}
      />}
    </nav>
  );
}
