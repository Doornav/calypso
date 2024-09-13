// /server/routes/userRoutes.js
const express = require('express');
const { addUser, loginUser, getUserByUid, updateAccessToken } = require('../services/userService');
const { auth, admin } = require('../firebaseConfig'); // Import Firebase Auth from JS file
const { createUserWithEmailAndPassword, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification, getUserByEmail } = require('firebase/auth');
const {Configuration, PlaidApi, PlaidEnvironments} = require('plaid');
const { updateName } = require("../services/userService");
const  {getAuth} = require('firebase-admin/auth')
require('dotenv').config();


const router = express.Router();

//forgotpassword route

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Request body:', req.body);
  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      // Initialize Firebase Auth
    

      // Send password reset email
      await sendPasswordResetEmail(auth, email); // Pass email directly, not as JSON string
      res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
      console.error('Error sending password reset email:', error.message);
      res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

//change password route
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword, email } = req.body;
  const authToken = req.headers.authorization?.split('Bearer ')[1];
  console.log(authToken);
  if (!authToken) {
      return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
      // Verify the Firebase authentication token
      const decodedToken = await admin.auth().verifyIdToken(authToken);
      const uidFromToken = decodedToken.uid;

      // Ensure that the user making the request is the same user whose password is being changed
      if (uidFromToken !== userId) {
          return res.status(403).json({ error: 'Unauthorized: User ID does not match the token' });
      }

      const user = auth.currentUser;
      console.log("hereheeeeisisis: " + user);
      const credential = EmailAuthProvider.credential(
        email, 
        currentPassword // User's current password
    );

    try {
        // Reauthenticate the user with their current password
        await reauthenticateWithCredential(user, credential);

        // If reauthentication is successful, update the password
        await admin.auth().updateUser(userId, {
          password: newPassword,
      });
    } catch (error) {
        console.error("Error changing password:", error);
        alert("Error changing password: " + error.message);
    }
      // Now change the user's password using Firebase Admin SDK
      
      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password' });
  }
});


// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  console.log(name);

  try {
    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Send email verification to the user
    await sendEmailVerification(userCredential.user);

    // Add user to PostgreSQL
    const user = await addUser(uid, email, name);

    // Get user information from PostgreSQL using the Firebase UID
    const userInfo = await getUserByUid(user.uid);
    const authToken = await userCredential.user.getIdToken();

    // Respond with user info and authentication token
    res.status(201).json({
      message: 'User created successfully. Verification email sent.',
      user: userInfo,
      authToken: authToken
    });
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
      const userCredential = await loginUser(email, password);
      
      // Get user information from PostgreSQL using the Firebase UID
      const userInfo = await getUserByUid(userCredential.uid);
      
      const authToken = await userCredential.getIdToken();

      res.status(200).json({ message: 'Login successful', user: userInfo, authToken: authToken  });
    } catch (error) {
      console.error('Login failed:', error);
      res.status(401).json({ error: 'Login failed. Invalid credentials or user not found.' });
    }
  });

  router.post('/resend-verification-email', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Fetch the user by email using the Admin SDK
      const userRecord = await getAuth().getUserByEmail(email);
  
      if (userRecord.emailVerified) {
        return res.status(400).json({ message: "Email is already verified." });
      }
  
      // Send the email verification link
      const link = await getAuth().generateEmailVerificationLink(email);
  
      // Send the link via email - you may need to implement your email logic here or just log the link
      console.log(`Verification link sent to ${email}: ${link}`);
      
      res.status(200).json({ message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: 'Failed to send verification email.' });
    }
  });

  router.get('/check-verification-status', async (req, res) => {
    const { email } = req.query;
  
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
  
      if (userRecord.emailVerified) {
        return res.status(200).json({ message: 'User is verified', verified: true });
      } else {
        return res.status(200).json({ message: 'User is not verified', verified: false });
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      return res.status(500).json({ error: 'Failed to check verification status' });
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


  //CHANGE NAME ROUTE
  router.post('/change-name', async (req, res) => {
    const { userId, newName } = req.body;
    const authToken = req.headers.authorization?.split('Bearer ')[1]; // Extract token

    if (!authToken) {
        return res.status(401).json({ error: 'No authorization token provided' });
    }

    try {
        // Verify Firebase authentication token (you can modify this if using other auth systems)
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        const uidFromToken = decodedToken.uid;

        // Ensure the token matches the user trying to change the name
        if (uidFromToken !== userId) {
            return res.status(403).json({ error: 'Unauthorized: User ID does not match the token' });
        }

        // **Insert your logic to update the user's name in the database here**
        // Example with Firebase:
        await updateName(userId, newName);

        // Respond with success
        res.status(200).json({ message: 'Name changed successfully' });
    } catch (error) {
        console.error('Error changing name:', error);
        res.status(500).json({ error: 'Failed to change name' });
    }
});

  router.post('/change-name', async (req, res) => {
    const { userId, newName } = req.body;
    const authToken = req.headers.authorization?.split('Bearer ')[1]; // Extract token

    if (!authToken) {
        return res.status(401).json({ error: 'No authorization token provided' });
    }

    try {
        // Verify Firebase authentication token (you can modify this if using other auth systems)
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        const uidFromToken = decodedToken.uid;

        // Ensure the token matches the user trying to change the name
        if (uidFromToken !== userId) {
            return res.status(403).json({ error: 'Unauthorized: User ID does not match the token' });
        }

        // **Insert your logic to update the user's name in the database here**
        // Example with Firebase:
        await updateName(userId, newName);

        // Respond with success
        res.status(200).json({ message: 'Name changed successfully' });
    } catch (error) {
        console.error('Error changing name:', error);
        res.status(500).json({ error: 'Failed to change name' });
    }
});

router.post('/balance', async (req, res) => {
  const { access_token } = req.body;  // Ensure that you're extracting the access_token correctly

  // Log the extracted token to check
  console.log('Access token:', access_token);

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    // Call Plaid API with the extracted access_token
    const balanceResponse = await client.accountsBalanceGet({ access_token });
    res.json({
      Balance: balanceResponse.data,
    });
  } catch (error) {
    console.error('Error fetching balance:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});



  
module.exports = router;