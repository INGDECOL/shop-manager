import {  uploadBytesResumable , ref} from "@firebase/storage"
import { storage } from "../firebase/config"

const uploadVars = (filepath) => {
    // filepath.value = `logos/entete/${file.name}`
    const storageRef =  ref(storage, filepath)
    return { storageRef }
}
export default uploadVars
