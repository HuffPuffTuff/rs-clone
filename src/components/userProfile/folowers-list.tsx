import React, { useEffect, useRef, useState } from 'react';
import { setDataUsers } from '../../firebase/services';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { IUserProfile } from '../../types/types';
import { PreviewUser } from './preview-user';

import './folowers-list.scss';

type PropsFollowersList = {
  user: IUserProfile | null;
  modalName: string
  closeModal: () => void;
};

export function FollowersList({ user, modalName, closeModal }: PropsFollowersList) {
  if (!user) {
    return null;
  }
  const [users, setUsers] = useState<IUserProfile[]>([]);
  const [usersForDraw, setUsersForDraw] = useState<IUserProfile[]>([]);

  useEffect(() => {
    setDataUsers().
      then((data) => {
        setUsers(data);
      })
  }, []);

  useEffect(() => {
    const filtresUsers = modalName == ' Followers'
      ? user?.followers.map((element: string) => {
        if (users) {
          return users.find((i: { userId: string }) => {
            return i.userId === element;
          });
        }
      })
      : user?.following.map((element: string) => {
        if (users) {
          return users.find((i: { userId: string }) => {
            return i.userId === element;
          });
        }
      })
    setUsersForDraw(filtresUsers as IUserProfile[]);
  }, [users]);

  const listRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(listRef, closeModal);

  return (
    <div className='modal'>
      <div ref={listRef} className='folow-modal'>
        <h3 className='folow-modal__title'>{modalName}</h3>
        <ul className='folow-modal__list'>
          {usersForDraw && usersForDraw.map((user) => {
            if (user) {
              return (
              <div onClick={closeModal}>
                <PreviewUser 
                name={user.username}
                avatar={user.avatarData?.avatarSrc || './images/icons/profile.jpg'}
                />
              </div>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
}
