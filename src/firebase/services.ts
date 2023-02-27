import {
  IComment,
  IPhoto,
  IUser,
  MyError,
  IUserProfile,
  IPhotoDoc,
} from './../types/types';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  QuerySnapshot,
  DocumentData,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './lib';

export async function doesUsernameExist(username: string): Promise<boolean> {
  const querySnapshot = await getQuerySnapshot('users', 'username', username);
  return querySnapshot.docs.length > 0;
}

export async function isFollowingUserProfile(
  loggedUserName: string | null | undefined,
  profileUserId: string
): Promise<boolean> {
  const usersColl = collection(db, 'users');
  const userQuery = query(usersColl, where('username', '==', loggedUserName));

  const newQuery = query(
    userQuery,
    where('following', 'array-contains', profileUserId)
  );

  const res = await getDocs(newQuery);

  return res.docs.length > 0;
}

async function updateLoggedUserFollowing(
  isFollowingProfile: boolean,
  loggedDocId: string,
  userId: string
): Promise<void> {
  const userColl = collection(db, 'users');
  const docRef = doc(userColl, loggedDocId);
  const querySnapshot = await getDoc(docRef);
  const { following } = querySnapshot.data() as IUser;

  if (!isFollowingProfile) {
    updateDoc(docRef, { following: [...following, userId] }).catch((err) =>
      console.log(err)
    );
  } else {
    const newArr = following.filter((val) => val != userId);
    updateDoc(docRef, { following: newArr }).catch((err) => console.log(err));
  }
}

export async function toggleFollow(
  isFollowingProfile: boolean,
  userId: string,
  docId: string,
  loggedUserId: string | undefined,
  loggedDocId: string | undefined
): Promise<void> {
  if (loggedUserId && loggedDocId) {
    await updateLoggedUserFollowing(isFollowingProfile, loggedDocId, userId);
    await updateFollowedUserFollowers(isFollowingProfile, docId, loggedUserId);
  }
}

export async function updateFollowedUserFollowers(
  isFollowingProfile: boolean,
  docId: string,
  loggedUserId: string
): Promise<void> {
  const userColl = collection(db, 'users');
  const docRef = doc(userColl, docId);
  const querySnapshot = await getDoc(docRef);
  const { followers } = querySnapshot.data() as IUser;

  if (!isFollowingProfile) {
    updateDoc(docRef, {
      followers: [...followers, loggedUserId],
    }).catch((err) => console.log(err));
  } else {
    const newArr = followers.filter((val) => val != loggedUserId);
    updateDoc(docRef, { followers: newArr }).catch((err) => console.log(err));
  }
}

export async function getUserByUserId(userId: string): Promise<IUserProfile> {
  const querySnapshot = await getQuerySnapshot('users', 'userId', userId);

  const [res] = querySnapshot.docs.map((item) => {
    const itemData = item.data() as IUser;
    return {
      ...itemData,
      docId: item.id,
    };
  });

  return res;
}

export async function setDataUsers(): Promise<IUserProfile[]> {
  const usersColection = collection(db, 'users');
  const usersData = await getDocs(usersColection);
  const users = usersData.docs.map((user) => {
    const data = user.data() as IUser;
    return { ...data, docId: user.id };
  });
  return users;
}

export async function getQuerySnapshot(
  collName: string,
  fieldPath: string,
  value: string
): Promise<QuerySnapshot<DocumentData>> {
  const coll = collection(db, collName);
  const userQuery = query(coll, where(fieldPath, '==', value));

  return await getDocs(userQuery);
}

export async function getUserByUsername(
  username: string
): Promise<IUserProfile> {
  const querySnapshot = await getQuerySnapshot('users', 'username', username);

  const res = querySnapshot.docs.map((item) => {
    const itemData = item.data() as IUser;
    return {
      ...itemData,
      docId: item.id,
    };
  });

  return res[0];
}

export async function setUserData(user: IUser): Promise<void> {
  const userColl = collection(db, 'users');
  const userRef = doc(userColl);

  setDoc(userRef, user);
}

export function getError(error: MyError): string {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'The email address is already in use';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/user-not-found':
      return 'User not found!'
    default:
      return error.message;
  }
}

export async function sendPhotoDataToFirestore(
  imageData: IPhoto,
  callback?: (data: string) => void
): Promise<void> {
  const photoColl = collection(db, 'photos');
  const photoRef = doc(photoColl);

  await setDoc(photoRef, imageData);

  if (callback) {
    callback(photoRef.id);
  }
}

export async function getPhotosByUserId(userId: string): Promise<IPhotoDoc[]> {
  const photosQuery = await getQuerySnapshot('photos', 'userId', userId);

  return photosQuery.docs.map((photo) => {
    const photoData = photo.data() as IPhoto;
    return {
      ...photoData,
      docId: photo.id,
    };
  });
}

export async function updateUserAvatar(
  url: string,
  imagePath: string,
  userName: string | null | undefined
): Promise<void> {
  if (userName) {
    const userColl = collection(db, 'users');
    const user = await getUserByUsername(userName);
    const docRef = doc(userColl, user.docId);

    const avatarData = {
      avatarSrc: url,
      imagePath: imagePath,
    };

    await updateDoc(docRef, { avatarData })
      .then()
      .catch((error) => {
        console.log(error);
      });
  }
}

export async function updateUserData(
  newUsername: string,
  newFullname: string,
  docId: string | undefined
): Promise<void> {
  if (docId) {
    const userColl = collection(db, 'users');
    const docRef = doc(userColl, docId);

    updateDoc(docRef, {
      username: newUsername,
      fullName: newFullname,
    }).catch((err) => console.log(err));
  }
}

export async function toggleLike(
  isLikedPhoto: boolean,
  docId: string,
  loggedUserId: string
): Promise<void> {
  const photoColl = collection(db, 'photos');
  const docRef = doc(photoColl, docId);
  const photoDoc = await getDoc(docRef);
  const { likes } = photoDoc.data() as IPhoto;

  if (!isLikedPhoto) {
    updateDoc(docRef, { likes: [...likes, loggedUserId] }).catch((e) =>
      console.log(e)
    );
  } else {
    const newArr = likes.filter((val) => val != loggedUserId);
    updateDoc(docRef, { likes: newArr }).catch((e) => console.log(e));
  }
}

export async function updateComments(
  data: IComment,
  docId: string
): Promise<IComment[]> {
  const photoColl = collection(db, 'photos');
  const docRef = doc(photoColl, docId);
  const photoDoc = await getDoc(docRef);
  const { comments } = photoDoc.data() as IPhoto;

  const newCommentsArr = [...comments, data];

  await updateDoc(docRef, { comments: newCommentsArr }).catch((e) =>
    console.log(e)
  );

  return newCommentsArr;
}

export async function deletePhotoFromFirestore(docId: string): Promise<void> {
  const docRef = doc(db, 'photos', docId);
  await deleteDoc(docRef)
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
}

export async function deleteComment(
  docId: string,
  date: number
): Promise<IComment[]> {
  const photoColl = collection(db, 'photos');
  const docRef = doc(photoColl, docId);
  const photoDoc = await getDoc(docRef);
  const { comments } = photoDoc.data() as IPhoto;

  const newCommentsArr = comments.filter((elem) => elem.date != date);

  await updateDoc(docRef, { comments: newCommentsArr }).catch((e) =>
    console.log(e)
  );
  return newCommentsArr;
}
