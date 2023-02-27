import React, { useEffect, useState, useContext } from 'react';
import UserHeader from './user-header';
import Timeline from '../timeline';
import { IUserProfile } from '../../types/types';
import { getPhotosByUserId } from '../../firebase/services';

import './index.scss';
import PhotosContext from '../../context/photos-context';

interface UserPageProps {
  user: IUserProfile;
}

export default function UserProfile({
  user,
}: UserPageProps) {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const {setPhotos} = useContext(PhotosContext)

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      if (user) {
        const photos = await getPhotosByUserId(user.userId);
        const sortedPhotos = photos.sort(
          (a, b) => b.dateCreated - a.dateCreated
        );
        setProfile(user);
        setFollowersCount(user.followers.length);
        setPhotos(sortedPhotos);
      }
    }
    getProfileInfoAndPhotos();
  }, [user?.username]);

  return (
    <div className='profile'>
      {profile ? (
        <UserHeader
          user={profile}
          followersCount={followersCount}
          setFollowersCount={setFollowersCount}
        />
      ) : null}

      {profile ? <Timeline  /> : null}
    </div>
  );
}
