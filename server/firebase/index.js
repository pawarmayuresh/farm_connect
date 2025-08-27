// Firebase configuration
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

// Initialize Firebase with a unique app name
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  }, 'farmconnect-app');
} catch (error) {
  // App already exists, use the existing one
  console.log('Firebase app already initialized');
}

const db = admin.firestore();

module.exports = {
  admin,
  db
};