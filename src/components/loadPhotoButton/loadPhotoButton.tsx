import React, { useState, useContext, Dispatch, SetStateAction } from 'react';
import UserContext from '../../context/user-context';
import { sendPhotoDataToFirestore } from '../../firebase/services';
import { User } from 'firebase/auth';
import UploadImageModal from '../modal/modal';

import { IPhotoDoc } from '../../types/types';
import PhotosContext from '../../context/photos-context';

interface Props {
  isMainPage: boolean;
  profileUsername?: string;
}

export default function LoadPhotoButton({
  isMainPage,
  profileUsername,
}: Props) {
  const user = useContext(UserContext).user as User;
  const { photos, setPhotos } = useContext(PhotosContext);

  const [showModal, setShowModal] = useState(false); // потом поменять на false
  const [caption, setCaption] = useState('');

  // send Data to FireStore after sending to Storage
  const callback = async (url: string, imagePath: string): Promise<void> => {
    const imageData = {
      caption: caption,
      comments: [],
      dateCreated: Date.now(),
      imageSrc: url,
      likes: [],
      imagePath: imagePath,
      userId: user.uid,
    };

    if (user.displayName == profileUsername || isMainPage) {
      await sendPhotoDataToFirestore(imageData, (docId) => {
        const photoDoc = { ...imageData, docId };
        setPhotos([photoDoc, ...photos]);
      });
    } else {
      await sendPhotoDataToFirestore(imageData);
    }

    setShowModal(false);
    setCaption('');
  };

  return (
    <>
      <a
        className={
          showModal
            ? 'main-nav__link main-nav__link--create main-nav__link--active'
            : 'main-nav__link main-nav__link--create'
        }
        onClick={() => setShowModal(true)}
      >
        <span className="main-nav__text">Create</span>
      </a>
      {showModal ? (
        <UploadImageModal
          setCaption={setCaption}
          setShowModal={setShowModal}
          callback={callback}
          type={'photos'}
        />
      ) : null}
    </>
  );
}
