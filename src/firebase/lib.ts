import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCu8nbwEAd8Z3IMndd1cRPatVt4Mvy_y2E",
  authDomain: "second-clone-instagram.firebaseapp.com",
  projectId: "second-clone-instagram",
  storageBucket: "second-clone-instagram.appspot.com",
  messagingSenderId: "284252354778",
  appId: "1:284252354778:web:953642e4b78243779b0de3"
};

const firebase = initializeApp(config);
const db = getFirestore(firebase)
export { firebase, db };

