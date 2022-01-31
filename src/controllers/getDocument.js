import { ref } from "vue"
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'


    const document = ref (null)
    const getError = ref(null)
    const load  = async ( collectionName, id ) =>{
        try {
            const docRef = doc( db, collectionName, id)
            const res =  await getDoc(docRef)
                // console.log("REs data : ", res.data())
            if(res.exists()){
                document.value = {...res.data(), id: id}

            }
        }
        catch (err) {
            getError.value = err.message
            console.log("Error occured : ", getError.value)
        }
}
   const getDocument = () =>{
     return {document, getError, load}
    }
export default getDocument
