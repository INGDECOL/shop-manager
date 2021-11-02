import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, deleteDoc, doc } from "firebase/firestore";

    const error = ref(null)
    //const router = useRouter()

    const destroy = async ( collection, id ) =>{
        try {
            await deleteDoc(doc(db, collection, id))
            // router.push({ name: "EnqueteList"})
        } catch (err) {
            error.value = err.message
            console.log(" delete error : ", err.message)
        }

    }
const destroyDocument = () =>{
    return { destroy, error }
}
export default destroyDocument
