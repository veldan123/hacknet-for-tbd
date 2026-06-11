// Firebase Cloud Messaging Service Worker
// This file must stay at the root of your site for push notifications to work

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Must match the config in index.html
firebase.initializeApp({
  apiKey:            "AIzaSyC8mDEsjII_rg_cuRIlcQZ5nzX3Q3C8Ub4",
  authDomain:        "hacknet-ade86.firebaseapp.com",
  databaseURL:       "https://hacknet-ade86-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "hacknet-ade86",
  storageBucket:     "hacknet-ade86.firebasestorage.app",
  messagingSenderId: "133895738147",
  appId:             "1:133895738147:web:5b82a470e4bec217437296"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || '⚠ HACKNET ALERT', {
    body:    body || 'Someone is in your account!',
    icon:    '/hacknet-icon.png',
    badge:   '/hacknet-icon.png',
    tag:     'hacknet-alert',
    vibrate: [200, 100, 200, 100, 200],
    data:    payload.data,
  });
});
