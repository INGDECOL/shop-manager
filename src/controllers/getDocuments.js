import { ref } from "vue";
import { db, error } from '../firebase/config'
import {  getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore'

    const documents = ref ([])
    const getError = ref(null)
    const load = async (collectionName) =>{
        try {
            // await new Promise(resolve => {
            //     setTimeout(resolve, 3000);
            // })
            const docRef =  collection(db, collectionName) // docs to fetch in firebase
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                documents.value = snap.docs.map(doc =>{
                    // console.log("Data : ", doc.data())
                    return {...doc.data(), id : doc.id}
                })
            })
        }catch (err) {
            getError.value = err.message
            console.log(err);
        }
            // console.log("Form :", documents.value)
}
const getDocuments = () =>{
    return {documents, getError, load}
}
export default getDocuments
