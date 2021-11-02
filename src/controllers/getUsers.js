// import { db, auth } from "../firebase/config";
// import { getAuth } from "firebase/auth";

// const listAllUsers = (nextPageToken) => {
//   // List batch of users, 1000 at a time.
//   getAuth()
//     .listUsers()
//     .then((listUsersResult) => {
//       listUsersResult.users.forEach((userRecord) => {
//         console.log('users record : ', userRecord.toJSON());
//       });
//       if (listUsersResult.pageToken) {
//         // List next batch of users.
//         listAllUsers(listUsersResult.pageToken);
//       }
//     })
//     .catch((error) => {
//       console.log('Error listing users:', error);
//     });
// };
// // Start listing users from the beginning, 1000 at a time.
// const getUsers = () => {
//   return { listAllUsers }
// }
// export default getUsers

const fonctions = require( "firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()

const express = require('express')
const app = express()

// app.get('/users', async (req, res) => {
//     try {
//         const listUsers = await admin.auth().listUsers()
//         console.log("users : ", listUsers);
//         return res.status(200).send({ listUsers })
//     } catch (err) {
//         return handleError(res, err)
//     }
// })

// exports.api = functions.https.onRequest(app)

exports.getAllUsers = async (req, res) => {
    var allUsers = [];
    return admin.auth().listUsers()
        .then(function (listUsersResult) {
            listUsersResult.users.forEach(function (userRecord) {
                // For each user
                var userData = userRecord.toJSON();
                allUsers.push(userData);
                console.log("user data : ", userData);
            });
            res.status(200).send(JSON.stringify(allUsers));
        })
        .catch(function (error) {
            console.log("Error listing users:", error);
            res.status(500).send(error);
        });
}
