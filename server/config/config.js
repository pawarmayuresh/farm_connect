const admin = require("firebase-admin");

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    // Try to initialize with environment variables first (for production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
      });
      console.log("Firebase Admin initialized with environment variables");
    } else {
      // Fallback for development - try to load local file
      try {
        const path = require("path");
        const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
        });
        console.log("Firebase Admin initialized with local service account");
      } catch (localError) {
        console.warn("No local service account found, initializing without credentials");
        // Initialize without credentials for basic functionality
        admin.initializeApp({
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
        });
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

module.exports = admin;
