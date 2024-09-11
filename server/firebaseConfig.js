const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth"); // Client-side Auth
const admin = require("firebase-admin");      // Admin SDK for backend operations
require('dotenv').config();                   // Load environment variables

// Your web app's Firebase configuration (Client SDK)
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize the Firebase client SDK (for frontend)
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth for frontend
const auth = getAuth(app);

// Initialize Firebase Admin SDK (for backend)
const serviceAccount = require('./calypso-adminsdk-key'); // Update with your actual path to service account file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`, // Include database URL if using Firebase Realtime Database
});

// Export both client SDK and Admin SDK
module.exports = { app, auth, admin };
