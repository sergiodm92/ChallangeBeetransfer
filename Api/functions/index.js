const functions = require('firebase-functions');


const server = require('./app.js');


exports.server =  functions.https.onRequest(server)
