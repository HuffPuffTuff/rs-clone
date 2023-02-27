import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/user-context';
import Menu from '../components/menu/menu';
import * as ROUTES from '../constants/routes';
import { useNavigate } from 'react-router-dom';
import { IPhotoDoc } from '../types/types';
import MainPage from '../components/dashboard';
import PhotosContext from '../context/photos-context';

import './dashboard.scss';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [photos, setPhotos] = useState<IPhotoDoc[]>([]);

  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate(ROUTES.LOGIN);
    }
  }, [user]);

  return (
    <PhotosContext.Provider value={{photos, setPhotos}}>
      <main className="main-page">
        <Menu isMainPage={true} />
        {user ? (
          <MainPage user={user} />
        ) : null}
      </main>
    </PhotosContext.Provider>
  );
}
