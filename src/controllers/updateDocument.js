import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";


    const updateError = ref(null)
    //const router = useRouter()

    const update = async (collectionName, document, id) =>{
        // console.log("In updateDocument : ", collectionName, document)
        try {
            const docRef = doc( db, collectionName, id)
            const res = await updateDoc(docRef, document)
            // console.log("Udated doc : ", collectionName  )
            //router.push({name : "EnqueteList"})
        }
        catch (err) {
        updateError.value = err.message
        }
    }

const updateDocument = () =>{
    return { updateError, update}
}
export default updateDocument
