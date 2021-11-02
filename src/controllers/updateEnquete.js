import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";


    const error = ref(null)
    //const router = useRouter()

    const update = async (enquete) =>{
        try {
            const docRef = doc( db, 'enquetes', enquete.id)
            const res = await updateDoc(docRef, enquete)
            // router.push({name : "EnqueteList"})
        }
        catch (err) {
        error.value = err.message
        }
    }

const updateEnquete = () =>{
    return { error, update}
}
export default updateEnquete
