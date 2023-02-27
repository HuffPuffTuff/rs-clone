import React, { useState, useContext, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import UserContext from '../../context/user-context';
import UploadImageModal from '../modal/modal';
import { updateUserAvatar } from '../../firebase/services';
import { deletePhotoFromStorage } from '../../firebase/storage';

import './profile-avatar.scss'

interface Props {
  avatarData: {
    avatarSrc: string;
    imagePath: string;
  } | null;
  isLoggedUserProfile: boolean;
}

export default function ProfileAvatar({
  avatarData,
  isLoggedUserProfile,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext);
  const avatarPathToDeletePath = avatarData?.imagePath;
  const [avatarSrc, setAvatarSrc] = useState(avatarData?.avatarSrc);

  useEffect(() => {
    setAvatarSrc(avatarData?.avatarSrc);
  }, [avatarData]);

  const callback = async (url: string, imagePath: string): Promise<void> => {
    if (avatarPathToDeletePath) {
      await deletePhotoFromStorage(avatarPathToDeletePath);
    }

    updateUserAvatar(url, imagePath, user?.displayName);
    setAvatarSrc(url);
    setShowModal(false);
  };

  return (
    <>
      <button className='avatar'
        style={{
          
        }}
        onClick={isLoggedUserProfile ? () => setShowModal(true) : undefined}
      >
        <img
          className='avatar__image'
          src={avatarSrc ? avatarSrc : './images/icons/profile.jpg'}
          alt="avatar"
          width='150'
        />
        <Skeleton circle height={150} width={150} count={1} />
      </button>

      {showModal ? (
        <UploadImageModal
          setShowModal={setShowModal}
          callback={callback}
          type={'avatar'}
        />
      ) : null}
    </>
  );
}
