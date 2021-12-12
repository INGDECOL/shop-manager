import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, addDoc, doc } from "firebase/firestore";

    const createError = ref(null)
    const create = async (collectionName, document, id=null) =>{
        try {
            // using firebase
            let docRef
            if(id) {
                docRef = doc( db, collectionName, id)
            }else {
                docRef = collection(db, collectionName)
            }

           const res = await addDoc(docRef, document)


            if(!res.id) {
                throw Error("There is an error on submitting data to the server")
            }
            return res
        }catch (err) {
            createError.value = err.message
            console.log("Creating error : ", err.message)
        }
    }

const createDocument = () =>{
    return { createError, create }
}
export default createDocument
