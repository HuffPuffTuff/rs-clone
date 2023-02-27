import React from 'react';

import { IComment, IUserProfile } from '../../types/types';
import CommentItem from './comment-item';

import './comments-list.scss';

interface CommentsProps {
  comments: IComment[];
  photoDocId: string
  photoUserId: string
}

export default function Comments({ comments, photoDocId, photoUserId }: CommentsProps) {
  const elements = comments.map((value, i) => {
    return <CommentItem key={`p${i}`} commentData={value} photoDocId={photoDocId} photoUserId={photoUserId} />;
  });

  return (
    <ul className='comments-list'>
      {elements}
    </ul>
  );
}
