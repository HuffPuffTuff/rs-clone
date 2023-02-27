import React, { useEffect, useState } from 'react';
import { toggleFollow, setDataUsers } from '../../firebase/services';
import { shuffle } from '../../helpers/helpers';
import { IUserProfile } from '../../types/types';
import { PreviewUser } from '../userProfile/preview-user';
import { RecommendedUser } from './recommended-user';

import './recomendation.scss';

type PropsRecomendations = {
  userData: IUserProfile;
}

export function Recomendation(props: PropsRecomendations) {
  if (!props.userData) null;

  const [users, setUsers] = useState<IUserProfile[]>([]);

  useEffect(() => {
    setDataUsers().
      then((data) => {
        data = data.filter(el => !props.userData.following.includes(el.userId) && el.userId !== props.userData.userId);
        data = shuffle(data).slice(0, 5)
        setUsers(data);
      })
  }, []);

  return (
    <div className='recomendations'>
      <PreviewUser
        name={props.userData.username}
        avatar={props.userData.avatarData?.avatarSrc || './images/icons/profile.jpg'}
      />
      <h3 className='recomendations__title'>Suggestions for you</h3>
      <ul className='recomendations__list'>
        {users.map(user => {
          return (
            <RecommendedUser
              key={user.userId}
              user={user}
              loggedUser={props.userData}
            />
          )
        })}
      </ul>
    </div>
  )
}