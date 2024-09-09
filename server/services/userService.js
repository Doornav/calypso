const { signInWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('../firebaseConfig');
const pool = require('../db');

//create a user
async function addUser(uid, email, name) {
  const query = 'INSERT INTO user_acc (uid, email, name) VALUES ($1, $2, $3) RETURNING *';
  const values = [uid, email, name];

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
}

//store access token
async function updateAccessToken(uid, accessToken) {
  const query = 'UPDATE user_acc SET access_token = $1 WHERE uid = $2 RETURNING *';
  const values = [accessToken, uid];

  try {
    const res = await pool.query(query, values);
    return res.rows[0]; // Return the updated row
  } catch (err) {
    console.error('Error updating access token:', err);
    throw err;
  }
}

//login to existing user
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object if successful
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

// Function to get user information by UID
async function getUserByUid(uid) {
  const query = 'SELECT uid, email, name, created_at FROM user_acc WHERE uid = $1';
  const values = [uid];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
    return res.rows[0]; // Return the user information
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
}


module.exports = { addUser, loginUser, getUserByUid, updateAccessToken };