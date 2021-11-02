import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, setDoc, doc } from "firebase/firestore";

    const setError = ref(null)
    const insert = async (collectionName, document, id) =>{
        try {
            // using firebase
            const docRef = doc( db, collectionName, id)
            const res = await setDoc(docRef, document)

        }catch (err) {
            setError.value = err.message
        }
    }

const setDocument = () =>{
    return { setError, insert }
}
export default setDocument
