import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FirebaseContext from './context/firebase-context';
import {firebase, db } from './firebase/lib';
import './main.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement
);

root.render(
  <FirebaseContext.Provider value={{ firebase, db }}>
    <App />
  </FirebaseContext.Provider>
);

// client side render app: react
// database (Firebase)
// react-loading-skeleton
// tailwind

// Folder structure
// src
// components,
// constants,
// helpers,
// hooks,
// pages,
// firebase (lib, services, storage),

