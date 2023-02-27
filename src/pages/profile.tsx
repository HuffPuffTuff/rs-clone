import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../context/user-context';
import { getUserByUsername } from '../firebase/services';
import * as ROUTES from '../constants/routes';
import { IPhotoDoc, IUserProfile } from '../types/types';
import Menu from '../components/menu/menu';
import UserProfile from '../components/userProfile';
import './profile.scss';
import PhotosContext from '../context/photos-context';

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from link /p/:username
  const loggedUser = useContext(UserContext).user;

  const [user, setUser] = useState<IUserProfile | null>(null);
  const [photos, setPhotos] = useState<IPhotoDoc[]>([]);

  useEffect(() => {
    document.title = `Instagram - ${username}`;
  }, [username]);

  useEffect(() => {
    if (loggedUser === null) {
      navigate(ROUTES.LOGIN);
    }
  }, [loggedUser]);

  useEffect(() => {
    async function checkUserExists() {
      const currUser = await getUserByUsername(
        username?.toLowerCase() as string
      );

      if (currUser?.userId) {
        setUser(currUser);
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }
    checkUserExists();
  }, [username, navigate]);

  return (
    <PhotosContext.Provider value={{photos, setPhotos}}>
      <main className="main-page">
        <Menu
          isMainPage={false}
          profileUsername={username}
        />
        {user ? (
          <UserProfile
            user={user}
          />
        ) : null}
      </main>
    </PhotosContext.Provider>
  );
}
