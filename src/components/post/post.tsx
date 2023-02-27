import React, { useEffect, useState } from 'react';
import ModalPost from './modal-post';
import './post.scss';
import { IComment, IPhotoDoc } from '../../types/types';
import PostHeader from './post-header';
import { getRelativeTimeString } from '../../helpers/helpers';
import Like from './like';
import Comments from './comments-list';
import { getUserDataHook } from '../../hooks/getLoggedUserData';
import CommentForm from './comment-form';
import CommentsContext from '../../context/comments-context';

function Post({ photo }: { photo: IPhotoDoc }) {
  const { likes, docId, dateCreated, comments, userId } = photo;
  const date = getRelativeTimeString(dateCreated, 'en');
  const currUser = getUserDataHook(userId);

  const [user, setUser] = useState(currUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [commentsArr, setCommentsArr] = useState<IComment[]>([]);

  function showModal(): void {
    setIsOpenModal(true);
  }

  function closeModal(): void {
    setIsOpenModal(false);
  }

  useEffect(() => {
    setUser(currUser);
  }, [currUser]);

  useEffect(() => {
    setCommentsArr(comments);
  }, [comments]);

  if (location.pathname === '/') {
    return (
      <CommentsContext.Provider value={{ commentsArr, setCommentsArr }}>
        <div className="post-list__item post post--dashboard">
          {user ? <PostHeader photoData={photo} user={user} /> : null}

          <div className='post__inner'>
            <img
              className='post__image'
              src={photo.imageSrc}
              width="468"
              height="584"
            />

            <div className='post__like'>
              <Like likes={likes} docId={docId} />
              <div className='post__date'>{date}</div>
            </div>

            <p className='post__desc'>{photo.caption}</p>

            <Comments comments={commentsArr} photoDocId={docId} photoUserId={userId} />

            {commentsArr.length > 2 ? (
              <a className='post__more' onClick={showModal}>
                Show more comments...
              </a>
            ) : null}

            <CommentForm docId={docId} />
          </div>
        </div>
        {isOpenModal && (
          <ModalPost user={user} photo={photo} closeModal={closeModal} />
        )}
      </CommentsContext.Provider>
    );
  } else {
    return (
      <CommentsContext.Provider value={{ commentsArr, setCommentsArr }}>
        <a
          className='post-list__item post'
          onClick={() => showModal()}
        >
          <div className='post__inner'>
            <img className='post__image' src={photo.imageSrc} />
            <div className="post__overlay overlay">
              {
                <>
                  <div className='overlay__item'>
                    <div className="overlay__likes"></div>
                    {likes.length !== 0 && (
                      <div className="overlay__text">{likes.length}</div>
                    )}
                  </div>
                  <div className='overlay__item'>
                    <div className="overlay__comments"></div>
                    {comments.length !== 0 && (
                      <div className="overlay__text">{comments.length}</div>
                    )}
                  </div>
                </>
              }
            </div>
          </div>
        </a>
          {isOpenModal && (
            <ModalPost user={user} photo={photo} closeModal={closeModal} />
          )}
      </CommentsContext.Provider>
    );
  }
}

export default Post;
