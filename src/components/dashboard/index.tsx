import { User } from 'firebase/auth';
import React, { useContext, useEffect } from 'react';
import PhotosContext from '../../context/photos-context';
import { getPhotosByUserId } from '../../firebase/services';
import { getUserDataHook } from '../../hooks/getLoggedUserData';
import { IPhotoDoc } from '../../types/types';
import Timeline from '../timeline';

import './index.scss';
import { Recomendation } from './recomendation';

interface MainPageProps {
  user: User;
}

export default function MainPage({ user }: MainPageProps) {
  const userData = getUserDataHook(user.uid);
  const { setPhotos } = useContext(PhotosContext);

  useEffect(() => {
    async function getPhotos() {
      if (userData) {
        const usersIds = [...userData.following, userData.userId];
        const photos: IPhotoDoc[] = [];

        for (let i = 0; i < usersIds.length; i += 1) {
          const arr = await getPhotosByUserId(usersIds[i]);
          photos.push(...arr);
        }

        const sortedPhotos = photos.sort(
          (a, b) => b.dateCreated - a.dateCreated
        );
        setPhotos(sortedPhotos);
      }
    }

    getPhotos();
  }, [userData]);

  return (
    <div className="dashboard" >
      <div className='dashboard__inner'>

        <Timeline />
        {userData
          ? <Recomendation
            userData={userData}
          />
          : null
        }
      </div>
    </div>
  );
}
