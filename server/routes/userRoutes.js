// /server/routes/userRoutes.js
const express = require('express');
const { addUser, loginUser, getUserByUid, updateAccessToken } = require('../services/userService');
const { auth } = require('../firebaseConfig'); // Import Firebase Auth from JS file
const { createUserWithEmailAndPassword } = require('firebase/auth');
const {Configuration, PlaidApi, PlaidEnvironments} = require('plaid');
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
  const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  });
  
  const client = new PlaidApi(config);

  
  router.post('/create_link_token', async (req, res) => {
    try {
      const response = await client.linkTokenCreate({
        user: {
          client_user_id: 'liz', // A unique identifier for the current user
        },
        client_name: 'calypso',
        language: 'en',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        redirect_uri: 'https://cdn-testing.plaid.com/link/v2/stable/sandbox-oauth-a2a-react-native-redirect.html',
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

  router.post('/exchange_public_token', async (req, res) => {
    const { uid, public_token } = req.body; // The public token from the frontend

    if (!uid || !public_token) {
      return res.status(400).json({ error: 'Missing uid or public_token' });
    }

    try {
      // Exchange the public token for an access token
      const response = await client.itemPublicTokenExchange({
        public_token: public_token,
      });
  
      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;
      
      try{
        const result = await updateAccessToken(uid, accessToken);
        console.log(result)
      } catch (error){
        console.error('Error updating database with access token', error)
      }
      // Respond with the access token and item ID
      res.json({ access_token: accessToken, item_id: itemId });
    } catch (error) {
      console.error('Error exchanging public token:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to exchange public token' });
    }
  });
  
module.exports = router;