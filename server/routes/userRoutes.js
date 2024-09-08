// /server/routes/userRoutes.js
const express = require('express');
const { addUser, loginUser, getUserByUid } = require('../services/userService');
const { auth } = require('../firebaseConfig'); // Import Firebase Auth from JS file
const { createUserWithEmailAndPassword } = require('firebase/auth');
const plaid = require('plaid');
require('dotenv').config();


const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
    console.log(name);
  try {
    // Create user with Firebase
  
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Add user to PostgreSQL
    const user = await addUser(uid, email, name);

    // Get user information from PostgreSQL using the Firebase UID
    const userInfo = await getUserByUid(user.uid);

    res.status(201).json({ message: 'User created successfully', user:userInfo });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Authenticate the user with Firebase
      const user = await loginUser(email, password);
      
      // Get user information from PostgreSQL using the Firebase UID
      const userInfo = await getUserByUid(user.uid);
      
      res.status(200).json({ message: 'Login successful', user: userInfo });
    } catch (error) {
      console.error('Login failed:', error);
      res.status(401).json({ error: 'Login failed. Invalid credentials or user not found.' });
    }
  });


  //PLAID LINK TOKEN

  const config = new plaid.Configuration({
    basePath: plaid.PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });
  
  const client = new plaid.PlaidApi(config);

  
  router.post('/create_link_token', async (req, res) => {
    try {
      const response = await client.linkTokenCreate({
        user: {
          client_user_id: 'liz', // A unique identifier for the current user
        },
        client_name: 'calypso',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
      });
  
      // Log the full response from Plaid
      console.log('Plaid API response:', response);
  
      if (response && response.data) {
        res.json({ link_token: response.data.link_token });
      } else {
        res.status(500).json({ error: 'No link token returned from Plaid' });
      }
    } catch (error) {
      console.error('Error creating link token:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to create Plaid link token' });
    }
  });
  
module.exports = router;