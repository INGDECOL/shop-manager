import { db,auth } from "../firebase/config"
import { getAuth, updateProfile, updatePhoneNumber, createUserWithEmailAndPassword, } from "firebase/auth";
import {  doc,setDoc, collection, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref } from "vue"
// import { useRouter } from "vue-router"

// const router = useRouter()
const signUpError = ref(null)
const signUp  = async (data) => {
    //const auth = getAuth();
    signUpError.value = null
    const res = await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (userCredential) => {
        // Signed in
        const user = auth.currentUser
        console.log("phoneNumber : ", data.phoneNumber, "userCredential : ", userCredential)
        updateProfile(user,{
            displayName: data.displayName,
            phoneNumber: data.phoneNumber
            })
            //auth.currentUser.updatePhoneNumber(data.phoneNumber)
            // updatePhoneNumberCredential(user, data.phoneNumber)
            //updatePhoneNumber(user, data.phoneNumber)
        const userRef = doc(db, "users", user.uid)
        await setDoc(userRef, {
                fonction: data.fonction,
                phoneNumber: data.phoneNumber,
                createdAt: serverTimestamp()
            })
        const sendMail = () =>{
            console.log("Email sent to : ", user.email)
            }

        console.log(" user signedUp: ", user)
        //router.push({ name: 'Home'})
        return user
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        signUpError.value = error.message
        if(error.message.includes('Password')){
            signUpError.value = "Le mot de passe doit contenir au moins 6 caractères "
        }else if( error.message.includes('auth/email')){
            signUpError.value = "Cet adresse mail n'est pas disponible ou à déjà été utilisé "
        }
        console.log("Signup : ", signUpError.value);
        // ..
    })

}
const useSignUp = () => {
    return { signUp, signUpError }
}
export default useSignUp
