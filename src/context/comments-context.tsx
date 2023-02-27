import { createContext, Dispatch, SetStateAction } from 'react';
import { IComment } from '../types/types';

export interface ICommentsContext {
  commentsArr: IComment[];
  setCommentsArr: Dispatch<SetStateAction<IComment[]>>;
}

const CommentsContext = createContext<ICommentsContext>({
  commentsArr: [],
  setCommentsArr: () => {},
});

export default CommentsContext;
