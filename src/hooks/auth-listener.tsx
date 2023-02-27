import React, { useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import FirebaseContext, { IFirebase } from '../context/firebase-context';

export default function authListener() {
  const storageData = localStorage.getItem('auth-user') || '{}';
  const [user, setUser] = useState<User | null>(JSON.parse(storageData));
  const { firebase } = useContext(FirebaseContext) as IFirebase;
  
  
  useEffect(() => {
    const auth = getAuth(firebase);
    const listener = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        localStorage.setItem('auth-user', JSON.stringify(user));
        setUser(user);
      } else {
        localStorage.removeItem('auth-user');
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  return { user, setUser };
}
