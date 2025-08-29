// Firebase configuration - use the centralized config
const admin = require('../config/config');

const db = admin.firestore();

module.exports = {
  admin,
  db
};