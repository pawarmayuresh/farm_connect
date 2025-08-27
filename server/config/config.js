const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    // Load the service account key
    const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
    
    // Initialize Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
    });
    
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback initialization without service account
    admin.initializeApp({
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
    });
  }
}

module.exports = admin;
