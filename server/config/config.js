const admin = require("firebase-admin");

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    // Check if we're in production environment
    if (process.env.NODE_ENV === 'production') {
      // Production: Use environment variables
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
        });
        console.log("Firebase Admin initialized with environment variables");
      } else {
        console.warn("Firebase service account key not found in environment variables");
        // Initialize with minimal config for deployment
        admin.initializeApp({
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
        });
        console.log("Firebase Admin initialized with minimal config");
      }
    } else {
      // Development: Try local file first, then fallback
      const path = require("path");
      const fs = require("fs");
      const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
        });
        console.log("Firebase Admin initialized with local service account");
      } else {
        console.warn("Local service account file not found, using environment variables or minimal config");
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
          });
        } else {
          admin.initializeApp({
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
          });
        }
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Don't throw error in production, just log it
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

module.exports = admin;
