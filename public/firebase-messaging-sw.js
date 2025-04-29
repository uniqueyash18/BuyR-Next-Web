 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
  apiKey: "AIzaSyBWXI9A_rFIrG1IcYTGH9PlhGg93WNYrLA",
  authDomain: "roash-deals.firebaseapp.com",
  projectId: "roash-deals",
  storageBucket: "roash-deals.firebasestorage.app",
  messagingSenderId: "445125567251",
  appId: "1:445125567251:web:62102c6b8fce6ea3bb70e6",
  measurementId: "G-ZMNN74WPC7"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });