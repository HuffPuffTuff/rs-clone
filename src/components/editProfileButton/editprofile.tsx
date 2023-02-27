import React, { useState, useContext } from 'react';
import { getAuth, updateProfile, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import FirebaseContext from '../../context/firebase-context';
import { IUserProfile } from '../../types/types';
import { FirebaseApp } from '@firebase/app-types';
import { doesUsernameExist } from '../../firebase/services';
import { updateUserData } from '../../firebase/services';
import UserContext from '../../context/user-context';

import './editprofile.scss';

interface IProps {
  loggedUserData: IUserProfile | null;
}

export default function EditProfileButton({ loggedUserData }: IProps) {
  const firebase = useContext(FirebaseContext)?.firebase as FirebaseApp;
  const { setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullname, setNewFullname] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleEditProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const auth = getAuth(firebase);
    const usernameExists = await doesUsernameExist(newUsername);

    if (!usernameExists) {
      updateUserData(newUsername, newFullname, loggedUserData?.docId)
        .then(() => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, { displayName: newUsername })
              .then(() => {
                setUser(auth.currentUser);
              })
              .then(() => {
                navigate(`/${newUsername}`);
              });
          }
        })
        .catch((e) => console.log(e));
    } else {
      setError('That username is already taken, please try another!');
    }
  };

  return (
    <>
      <button
        className='button'
        onClick={() => {
          if (loggedUserData) {
            setNewUsername(loggedUserData.username);
            setNewFullname(loggedUserData.fullName);
          }
          setShowModal(true);
        }}
      >
        Edit profile
      </button>

      {showModal ? (
        <div className="modal">
          <div className="modal__inner">
            {error && <p className='error'>{error}</p>}
            <form
              className='edit-form'
              onSubmit={handleEditProfile}
            >
              <label className='field-wrapper'>
                Username
                <input
                  className='field'
                  type="text"
                  defaultValue={loggedUserData?.username}
                  onChange={({ target }) =>
                    setNewUsername(target.value.toLowerCase())
                  }
                />
              </label>
              <label className='field-wrapper'>
                Full Name
                <input
                  className='field'
                  type="text"
                  defaultValue={loggedUserData?.fullName}
                  onChange={({ target }) => setNewFullname(target.value)}
                />
              </label>
              <div className='field-wrapper__actions'>
                <button className='button button--primary' type="submit">Edit</button>
                <button
                  className='button'
                  onClick={() => {
                    if (loggedUserData) {
                      setNewUsername(loggedUserData.username);
                      setNewFullname(loggedUserData.fullName);
                    }
                    setShowModal(false);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
