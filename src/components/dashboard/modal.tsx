import React from 'react'
import { toggleFollow } from '../../firebase/services';
import { IUserProfile } from '../../types/types'

type PropsModal = {
  user: IUserProfile;
  closeModal: () => void;
  loggedUser:IUserProfile;
  setIsFollowingProfile: React.Dispatch<React.SetStateAction<boolean>>
}
export function Modal(props: PropsModal) {
  const user = props.user
  const loggedUser = props.loggedUser

  function deleteFollow(): void {
    toggleFollow(true, user.userId, user.docId, loggedUser.userId, loggedUser.docId);
    props.setIsFollowingProfile(false)
    props.closeModal();
  }

  return (
    <div className='modal'>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgb(255, 255, 255)',
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px',
        padding: '40px 0'
      }}>
        <img
          src={user.avatarData?.avatarSrc || './images/icons/profile.jpg'}
          width='64'
          height='64' />
        <p>Unfollow @{user.username}?</p>
        <button style={{
          width: '100%',
          background: 'rgba(0, 0, 0, 0)',
          border: '1px solid #CCCCCC',
          padding: '20px'
        }}
          onClick={deleteFollow}>Unfollow</button>
        <button style={{
          width: '100%',
          background: 'rgba(0, 0, 0, 0)',
          border: '1px solid #CCCCCC',
          padding: '20px'
        }}
          onClick={props.closeModal}>Cansel</button>
      </div>
    </div>
  )
}

