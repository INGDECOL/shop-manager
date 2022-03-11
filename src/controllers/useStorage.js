import { storage } from "../firebase/config"
import {  uploadBytesResumable, getDownloadURL } from "@firebase/storage"
import { ref } from "vue"
import uploadVars from "./uploadVars"
const useStorage = () => {
    const storageError = ref(null)
    const downloadUrl = ref(null)
    const filepath = ref(null)
    const progress = ref(0)


    const uploadImage = async (file) => {

        filepath.value = `images/logos/logo.png`
        const { storageRef } = uploadVars(filepath.value)
        // console.log("storageRef : ", storageRef)

        try {
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on("state_changed", (snapshot)=> {
                const progressBar = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                progress.value = progressBar
            },
            (err) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        // console.log("downloadUrl : ", url)
                        downloadUrl.value = url
                    })
            }
            )
            // const res = await storageRef.put(file)
            // url.value = res.ref.getDownloadURL()
        } catch (err) {
            console.log(err.message)
            storageError.value = err.message
        }
    }
    return {
        downloadUrl,
        uploadImage,
        filepath,
        storageError,
        progress
    }

}
export default useStorage
