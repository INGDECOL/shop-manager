import { ref } from "vue"
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
const user = ref (null)
const error = ref(null)

const findUser = async (id) =>{
        try {
            const docRef = doc( db, 'users', id)
            const res = await getDoc(docRef)
            if(res.exists()) {
                user.value = {...res.data(), id: id}
            } else {
                throw Error("Impossible de retrouver cet utilisateur ")
            }
        }
        catch (err) {
        error.value = err.message
        }
        // console.log("User from getUser : ", user.value.fonction)
}
const getUser = () =>{
    return {findUser, error, user}
}
export default getUser
