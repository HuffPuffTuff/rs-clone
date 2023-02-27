import React, { useContext, useEffect, useState } from 'react';
import { getUserDataHook } from '../../hooks/getLoggedUserData';
import { getRelativeTimeString } from '../../helpers/helpers';
import { IComment, IUserProfile } from '../../types/types';
import UserContext from '../../context/user-context';
import { deleteComment } from '../../firebase/services';
import CommentsContext from '../../context/comments-context';

import './comment-item.scss';

interface CommentProps {
  commentData: IComment;
  photoDocId: string;
  photoUserId: string;
}

export default function CommentItem({
  commentData,
  photoDocId,
  photoUserId,
}: CommentProps) {
  const { userId, comment, date } = commentData;
  const prettyDate = getRelativeTimeString(date, 'en');
  const commentUser = getUserDataHook(userId);
  const loggedUser = useContext(UserContext).user;
  const [user, setUser] = useState<IUserProfile | null>(commentUser);
  const { setCommentsArr } = useContext(CommentsContext);

  const checkCanDelete = () => {
    if (photoUserId == loggedUser?.uid) {
      return true;
    } else if (userId == loggedUser?.uid) {
      return true;
    } else {
      return false;
    }
  };

  const canDelete = checkCanDelete();

  const handleDeleteComment = async (): Promise<void> => {
    const newCommentsArr = await deleteComment(photoDocId, date);
    setCommentsArr(newCommentsArr);
  };

  useEffect(() => {
    setUser(commentUser);
  }, [commentUser]);

  return (
    <li className='comments-list__item comment'>
      <div className='comment__inner'>
        <div className='comment__message'>
          {user ? (
            <span className='comment__user'>
              {user.username}
            </span>
          ) : null}
          <span className='comment__text'>{comment}</span>
        </div>
        <p className='comment__date'>{prettyDate}</p>
      </div>
      <div className='comment__action'>
        {canDelete ? (
          <button className='comment__delete button button--delete' onClick={handleDeleteComment}></button>
        ) : null}
      </div>
    </li>
  );
}
