import { ref } from "vue";
import { db, error } from '../firebase/config'
import {  getDocs, collection, query, orderBy, limit, startAfter, onSnapshot } from 'firebase/firestore'

    const documents = ref ([])
    const collect = ref('')
    const pageSize = 5
    const getError = ref(null)
    const lastVisible = ref(null)
    const cond = ref(lastVisible.value ? ', startAfter(lastVisible.value)' :' ')
    const firstReqStr = ( docRef ) => {
        console.log("Conditionnnnnnnnn : ", cond.value)
        return query( docRef, orderBy("createdAt", "desc"))
    }
    const nextReqStr = ( docRef ) => {
        return query( docRef, orderBy("createdAt", "desc"), startAfter(lastVisible.value),  limit(pageSize))
    }
    const load = async (collectionName) =>{
        try {
            // await new Promise(resolve => {
            //     setTimeout(resolve, 3000);
            // })
            const docRef =  collection(db, collectionName) // docs to fetch in firebase
            // const q = query( docRef, orderBy("createdAt", "desc"), limit(pageSize))
            collect.value = collectionName
            const q = firstReqStr(docRef)
            const res = onSnapshot(q, ( snap ) =>{
            // console.log("Last visible : ", snap.docs[snap.docs.length-1])
            lastVisible.value =  snap.docs[snap.docs.length-1]
                documents.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
                })
            })
        }catch (err) {
            getError.value = err.message
            console.log(err);
        }
            // console.log("Form :", documents.value)
}
const nextPage = async () => {
    try {
        const docRef =  collection(db, collect.value) // docs to fetch in firebase
        console.log("Last visible : ", lastVisible.value)
        const fq = query( docRef, orderBy("createdAt", "desc"), limit(pageSize))

        const r = await getDocs(fq)
            console.log("docccccccccccssss : ", r.docs)
            const last = r.docs[r.docs.length - 1]
            console.log("Last docccccccccccssss : ", last)
            const next = query(docRef, orderBy("createdAt", "decs"), startAfter(last), limit(pageSize))
            const p = onSnapshot(next, (snap) => {

            })
            //console.log("Paginated : ", await getDocs(next));
            //const q = await getDocs(nextReqStr(docRef))
            // console.log("q valueeeee : ", q)
            // const res = await getDocs(q)
            // console.log("resssssssssss : ", res)
            // const res = onSnapshot(q, ( snap ) =>{
            // console.log("Next Last visible : ", snap.docs[snap.docs.length-1])
            // lastVisible.value = snap.docs[snap.docs.length-1]
            // //     documents.value = snap.docs.map(doc =>{
            // //         return {...doc.data(), id : doc.id}
            // //     })
            //  })
    } catch (err) {
        getError.value = err.message
        console.log(err)
    }
}
const getDocumentsWithPagination = () =>{
    return {documents, getError, load, nextPage}
}
export default getDocumentsWithPagination
