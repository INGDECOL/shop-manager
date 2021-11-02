import { ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence  }
from 'firebase/firestore'
import { getAuth } from "firebase/auth";
const error = ref('')


const firebaseConfig = {
  apiKey: "AIzaSyCOneTFOrNBPRBS6wDvIuurKg1ZJpaciZg",
  authDomain: "shop-manager-7731e.firebaseapp.com",
  projectId: "shop-manager-7731e",
  storageBucket: "shop-manager-7731e.appspot.com",
  messagingSenderId: "642025619283",
  appId: "1:642025619283:web:6889bbf0940f2f7f2aeba6"
};
// init firebase
const firebase = initializeApp(firebaseConfig)
//init firestore
const db = getFirestore(firebase)
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          error.value = "Le mode offline n'est pas prise encharge avec multiple onglets ouvert de l'application, fermer les autres onglet sur lesquels l'application est ouverte !"
          alert(error.value)
          console.log(error.value)
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          error.value = "Votre navigateur ne supporte pas le mode offline, utilisé plutôt Firefox, Chrome ou Safari"
          alert(error.value)
          console.log(error.value)
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  })
const auth = getAuth()

export  { db, auth }
