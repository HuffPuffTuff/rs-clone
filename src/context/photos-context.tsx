import { createContext, Dispatch, SetStateAction } from 'react';
import { IPhotoDoc } from '../types/types';

export interface IPhonotContext {
  photos: IPhotoDoc[];
  setPhotos: Dispatch<SetStateAction<IPhotoDoc[]>>;
}

const PhotosContext = createContext<IPhonotContext>({
  photos: [],
  setPhotos: () => {},
});

export default PhotosContext;
