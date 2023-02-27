import React, { useState } from 'react'
import { toggleFollow } from '../../firebase/services'
import { IUserProfile } from '../../types/types'
import { PreviewUser } from '../userProfile/preview-user'
import { Modal } from './modal'

import './recommended-user.scss';

type PropsRecommendedUser = {
  user: IUserProfile,
  loggedUser: IUserProfile
}

export function RecommendedUser(props: PropsRecommendedUser) {
  const user = props.user;
  const loggedUser = props.loggedUser;
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  function addFollow(): void {
    if(!isFollowingProfile){
      toggleFollow(isFollowingProfile, user.userId, user.docId, loggedUser.userId, loggedUser.docId);
      setIsFollowingProfile(true)
    } else {
      setIsOpenModal(true);
    }
  }

  function closeModal(): void {
    setIsOpenModal(false)
  }

  return (
    <li className='recomendations__item'>
      <PreviewUser
        name={user.username}
        avatar={user.avatarData?.avatarSrc || './images/icons/profile.jpg'}
      />
      <button className='button button--transparent' onClick={() => addFollow()}>
        {isFollowingProfile ? 'Unfollow' : 'Follow'}
      </button>
      {isOpenModal && <Modal
        user={user}
        closeModal={closeModal}
        loggedUser={loggedUser}
        setIsFollowingProfile={setIsFollowingProfile}
      />}
    </li>
  )
}