import { auth, db } from "../firebase/config"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { ref } from 'vue'
// import { useRouter } from "vue-router";

// const router = useRouter()
//const auth = getAuth()
const signError = ref(null)
const signIn = async (email, password) => {
    signError.value = null
    try {
        // console.log(email,password)
        const res = await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user
                signError.value = null
               // router.push( { name: 'EnqueteList'})
                return user
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.log("errorCode : ",errorCode, "error msg : ", error.message)
                signError.value = "Email et Mot de passe invalide !"
            })
    } catch (err) {
        console.log(err.message)
        signError.value = "Informations de connexion non valide !"
    }


}
const useSignIn = () => {
    return { auth, signIn, signError}
}
export default useSignIn
