require('dotenv').config();
var admin = require("firebase-admin");
const {getFirestore} = require('firebase-admin/firestore')

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = getFirestore()


module.exports = {
    db,
  };