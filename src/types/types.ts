export interface IUser {
  userId: string;
  username: string;
  fullName: string;
  emailAddress: string;
  following: string[];
  followers: string[];
  dateCreated: number;
  avatarData?: {
    avatarSrc: string;
    imagePath: string;
  };
}

export interface IUserProfile extends IUser {
  [x: string]: any;
  docId: string;
}

export interface MyError {
  code: string;
  message: string;
}

export interface IComment {
  comment: string;
  userId: string;
  date: number;
}


export interface IPhoto {
  caption: string;
  comments: IComment[];
  dateCreated: number;
  imageSrc: string;
  imagePath: string;
  likes: string[];
  userId: string;
}

export interface IPhotoDoc extends IPhoto {
  docId: string;
}

export type SearchPropsType = {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput: () => void;
};
