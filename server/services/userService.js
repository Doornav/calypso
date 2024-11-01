const { signInWithEmailAndPassword } = require('firebase/auth');
const { auth } = require('../firebaseConfig');
const pool = require('../db');

//create a user
async function addUser(uid, email, name) {
  const query = 'INSERT INTO user_acc (uid, email, username) VALUES ($1, $2, $3) RETURNING *';
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
async function insertAccessToken(uid, accessToken, itemId, institutionName) {
  const query = `
    INSERT INTO access_tokens (uid, access_token, item_id, institution_name)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (item_id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      institution_name = EXCLUDED.institution_name,
      added_at = CURRENT_TIMESTAMP;
  `;
  const values = [uid, accessToken, itemId, institutionName];

  try {
    const res = await pool.query(query, values);
    return res;
  } catch (err) {
    throw err;
  }
}

async function updateName(uid, newName) {
  const query = 'UPDATE user_acc SET name = $1 WHERE uid = $2 RETURNING *';
  const values = [newName, uid];

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    const res = await pool.query(query, values);
    return res.rows[0];
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
  const query = `
    SELECT
      ua.uid,
      ua.email,
      ua.username,
      ua.created_at,
      COALESCE(json_agg(
        json_build_object(
          'token_id', at.token_id,
          'access_token', at.access_token,
          'item_id', at.item_id,
          'institution_name', at.institution_name,
          'added_at', at.added_at
        )
      ) FILTER (WHERE at.token_id IS NOT NULL), '[]') AS access_tokens
    FROM
      user_acc ua
    LEFT JOIN
      access_tokens at ON ua.uid = at.uid
    WHERE
      ua.uid = $1
    GROUP BY
      ua.uid, ua.email, ua.username, ua.created_at;
  `;
  const values = [uid];

  try {
    const res = await pool.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('User not found');
    }
    return res.rows[0]; // Return the user information along with access tokens
  } catch (err) {
    console.error('Error fetching user and access tokens:', err);
    throw err;
  }
}



module.exports = { addUser, loginUser, getUserByUid, insertAccessToken, updateName };