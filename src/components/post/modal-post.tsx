import React, {
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from 'react';
import { IUserProfile, IPhotoDoc, IComment } from '../../types/types';
import PostHeader from './post-header';
import Like from './like';
import { getRelativeTimeString } from '../../helpers/helpers';
import Comments from './comments-list';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import CommentForm from './comment-form';
import CommentsContext from '../../context/comments-context';

import './modal-post.scss';

type ModalPropsType = {
  user: IUserProfile | null;
  photo: IPhotoDoc;
  closeModal: () => void;
};

function ModalPost({ user, photo, closeModal }: ModalPropsType) {
  const { caption, dateCreated, docId, imageSrc, likes, userId } = photo;
  const date = getRelativeTimeString(dateCreated, 'en');
  const menuRef = useRef<HTMLDivElement>(null);

  const { commentsArr } = useContext(CommentsContext);

  useOnClickOutside(menuRef, closeModal);

  return (
    <div className='modal modal--post'>
      <div className="modal__inner">
        <div className='modal__content modal-post' ref={menuRef}>
          <div className='modal-post__left'>
            <img
              className='modal-post__image'
              src={imageSrc}
            />
          </div>
          <div className='modal-post__right comments'>
            {user ? <PostHeader photoData={photo} user={user} closeModal={closeModal} /> : null}

            <div className='comments__inner'>
              <p className='comments__desc'>{caption}</p>

              <Comments comments={commentsArr} photoDocId={docId} photoUserId={userId} />

            </div>
              <footer className='comments__footer comments-footer'>
                <div className='comments-footer__inner'>
                  <Like likes={likes} docId={docId} />
                  <div className='comments-footer__date'>{date}</div>
                </div>

                <CommentForm docId={docId} />
              </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPost;
