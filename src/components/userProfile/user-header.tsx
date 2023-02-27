import React, { Dispatch, useContext, useEffect, useState, MouseEvent } from 'react';
import { IUserProfile } from '../../types/types';
import UserContext from '../../context/user-context';
import ProfileAvatar from '../profileAvatar/profile-avatar';
import EditProfileButton from '../editProfileButton/editprofile';
import { getUserDataHook } from '../../hooks/getLoggedUserData';
import { isFollowingUserProfile, toggleFollow } from '../../firebase/services';
import './user-header.scss';
import PhotosContext from '../../context/photos-context';
import { FollowersList } from './folowers-list';

interface Props {
  user: IUserProfile;
  followersCount: number;
  setFollowersCount: Dispatch<React.SetStateAction<number>>;
}

export default function UserHeader({
  user,
  followersCount,
  setFollowersCount,
}: Props) {
  const loggedUser = useContext(UserContext).user;
  const loggedUserData = getUserDataHook(loggedUser?.uid);
  const { photos } = useContext(PhotosContext)

  const { username, avatarData, userId, docId, following } = user;
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);

  const isLoggedUserProfile = loggedUser
    ? loggedUser.displayName == username
    : false;

  const handleToggleFollow = () => {
    setIsFollowingProfile(!isFollowingProfile);

    setFollowersCount(
      isFollowingProfile ? followersCount - 1 : followersCount + 1
    );
    toggleFollow(
      isFollowingProfile,
      userId,
      docId,
      loggedUserData?.userId,
      loggedUserData?.docId
    );
  };

  useEffect(() => {
    async function checkIsFollowingProfile() {
      if (!isLoggedUserProfile && loggedUser?.displayName && userId) {
        const isFollowing = await isFollowingUserProfile(
          loggedUser.displayName,
          userId
        );
        setIsFollowingProfile(isFollowing);
      }
    }
    checkIsFollowingProfile();
  }, [loggedUser?.displayName, userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setIsModalName] = useState('');

  function openModal(e: MouseEvent) {
    setIsModalOpen(true);
    setIsModalName(e.currentTarget.textContent as string);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsModalName('');
  }


  return (
    <header
      className='profile__header'
    >
      <div className='profile__image'>
        <ProfileAvatar
          isLoggedUserProfile={isLoggedUserProfile}
          avatarData={avatarData ? avatarData : null}
        />
      </div>
      <div className='profile__info info'>
        <header className='info__header'>
          <h4 className='info__title'>{username}</h4>
          {isLoggedUserProfile ? (
            <EditProfileButton loggedUserData={loggedUserData} />
          ) : (
            <button className='button' onClick={handleToggleFollow}>
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </header>
        <ul className='info__inner shared'>
          <li className='shared__item'>
            <span className='shared__value'>{photos.length}</span>
            <span className='shared__name'> Publication</span>
          </li>
          <li className='shared__item'>
            <span className='shared__value'>{followersCount}</span>
            <span className='shared__name shared__name--actions' onClick={openModal}> Followers</span>
          </li>
          <li className='shared__item'>
            <span className='shared__value'>{following.length}</span>
            <span className='shared__name shared__name--actions' onClick={openModal}> Following</span>
          </li>
        </ul>
      </div>
      {isModalOpen && <FollowersList
        user={user}
        modalName={modalName}
        closeModal={closeModal}
      />}
    </header>
  );
}
