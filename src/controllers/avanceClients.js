import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, addDoc, setDoc, updateDoc, deleteDoc, getDoc, doc, increment,orderBy, onSnapshot, serverTimestamp, query } from "firebase/firestore";

const avance = ref()
const avnc = ref([])

const setAvanceClient = async (avance, id) => {
            const docRef = doc( db, "avancesClient", id)
            const res = await setDoc(docRef, {
                clientId: avance.clientId,
                boutiqueVente: avance.boutiqueVente,
                montantAvance: increment(avance.montantAvance),
                createdAt: serverTimestamp()
            }, {merge: true})
}

const updateAvanceClient = async (avance, id) => {
    const docRef = doc( db, "avancesClient", id)
    const res = await setDoc(docRef, {
        clientId: avance.clientId,
        boutiqueVente: avance.boutiqueVente,
        montantAvance: avance.montantAvance,
        updateddAt: serverTimestamp()
    }, {merge: true})
}

const getAvance = async (id) => {
    const docRef = doc(db,"avancesClient", id)
    const res = await getDoc(docRef)
    if(res.exists()) {
        avance.value = {...res.data(), id: res.id}
    }
}

const getAvances = async () => {

    const docRef =  collection(db, "avancesClient") // docs to fetch in firebase
    const q = query( docRef, orderBy("createdAt", "desc"))
    const res = onSnapshot(q, ( snap ) =>{
        avnc.value = snap.docs.map(doc =>{
            return {...doc.data(), id : doc.id}
        })
    })

}

const avancesClient = () => {
    return { setAvanceClient, updateAvanceClient, getAvance, avance, getAvances,avnc }
}

        export default avancesClient
