const admin = require("firebase-admin");

// Mock Firebase Admin for when credentials are not available
const createMockFirebaseAdmin = () => {
  return {
    auth: () => ({
      verifyIdToken: async () => ({ uid: 'mock-user', email: 'mock@example.com' }),
      createUser: async () => ({ uid: 'mock-user' }),
      updateUser: async () => ({ uid: 'mock-user' }),
      deleteUser: async () => ({ uid: 'mock-user' })
    }),
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async () => ({}),
          update: async () => ({}),
          delete: async () => ({})
        }),
        add: async () => ({ id: 'mock-doc' }),
        get: async () => ({ docs: [] })
      })
    }),
    database: () => ({
      ref: () => ({
        push: async () => ({ key: 'mock-key' }),
        set: async () => ({}),
        once: async () => ({ val: () => null })
      })
    })
  };
};

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  try {
    // Skip Firebase initialization in production if no credentials
    if (process.env.NODE_ENV === 'production' && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.log("Firebase credentials not found in production, using mock Firebase");
      // Don't initialize Firebase at all, routes will handle gracefully
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Initialize with service account key
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://farm-connect-3151c.firebaseio.com"
      });
      console.log("Firebase Admin initialized with service account");
    } else {
      // Development: Try local file
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
        console.log("No Firebase credentials found, using mock Firebase for development");
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    console.log("Continuing without Firebase authentication");
  }
}

module.exports = admin;
