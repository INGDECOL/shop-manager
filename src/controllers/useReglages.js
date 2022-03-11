import { ref } from "vue"
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

let titre =''
let numeros = ''
let email = ''
let adresse = ''
let imgUrl =''

const document = ref (null)
const getError = ref(null)
const collectionName = "reglages"
const id = "NzMRN91Wh7NY82JauZk7M9ILV1D2"
const load  = async ( collectionName, id ) =>{
    try {
        const docRef = doc( db, collectionName, id)
        const res =  await getDoc(docRef)
            // console.log("REs data : ", res.data())
            // console.log("REs data : ", res.data())
        if(res.exists()){
            document.value = {...res.data(), id: id}
            // console.log("docs : ", document.value)
            titre = document.value.titre
            numeros = document.value.numeros
            imgUrl = document.value.imgUrl
            email = document.value.email
            adresse = document.value.adresse

        }
    }
    catch (err) {
        getError.value = err.message
        console.log("Error occured : ", getError.value)
    }
}
const getTitre = ()=>{
     load(collectionName, id)
     console.log("titre : ", titre.value)
}

const useReglages = async() => {
    await load(collectionName, id)
    //  console.log("reglages : ", document.value, collectionName, id )
    return { getTitre, titre, imgUrl, numeros, email, adresse }
}

export default useReglages
