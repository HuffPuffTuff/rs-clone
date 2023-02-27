import React from 'react';
import { Link } from 'react-router-dom';
import './preview-user.scss';

type PropsPreviewUser = {
  name: string;
  avatar: string;
}

export function PreviewUser(props: PropsPreviewUser) {
  return (
    <>
      <Link className="recomendations__user recomendations-user" to={`/${props.name}`}>
        <div className='recomendations-user__image-wrapper'>
          <img className="recomendations-user__image"
            src={props.avatar}
            width='56'
            height='56'
          />
        </div>
        <span className="recomendations-user__name">{props.name}</span>
      </Link>
    </>
  )
}
