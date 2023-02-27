import React, { useState, useEffect, useContext } from 'react';
import Post from './post/post';

import { IPhotoDoc, IUserProfile } from '../types/types';

import './timeline.scss';
import PhotosContext from '../context/photos-context';



export default function Timeline() {
  const {photos} = useContext(PhotosContext)

  const elements = photos.map((photo, index) => {
    return <Post key={index} photo={photo} />;
  });

  return (
    <div className='post-list'>
      <header className='post-list__header'>
        <h3 className='post-list__title'>Posts</h3>
      </header>
      <ul className='post-list__inner'>
        {elements}
      </ul>
    </div>
  );
}
