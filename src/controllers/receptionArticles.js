import { ref } from "vue";
//import { useRouter } from 'vue-router'
import { db } from "../firebase/config"
import { collection, addDoc, setDoc, updateDoc, deleteDoc, getDoc, doc, increment,decrement, serverTimestamp, arrayUnion } from "firebase/firestore";


    const receptionError = ref(null)
    const stock = ref(null)
    //const router = useRouter()

    const reception = async ( stock, id) =>{
        // console.log("In updatestock : ",  stock, id)
        try {
            // const docRef = doc( db, "boutiques" , id)
            const docRef = doc( db, "boutiques", id)
            const docId = stock.articleId.toString()
            const res = await setDoc(docRef, {
                [docId]: {articleId: stock.articleId, quantiteStock: increment(stock.quantiteStock), updatedAt: stock.updatedAt}
            }, {merge: true})
        }
        catch (err) {
        receptionError.value = err.message
        }
    }
    const venteStock = async ( stock, id) =>{
        console.log("In venteStock : ",  stock, id)
        try {
            // const docRef = doc( db, "boutiques" , id)
            const docRef = doc( db, "boutiques", id)
            const docId = stock.articleId.toString()
            const res = await setDoc(docRef, {
                [docId]: {articleId: stock.articleId, quantiteStock: stock.quantiteStock, updatedAt: stock.updatedAt}
            }, {merge: true})
            console.log("vente stock : ", stock.quantiteStock, stock.articleId)
        }
        catch (err) {
        receptionError.value = "stock vente " + err.message
        }
    }
    const updateStock = async ( stock, id) =>{
        // console.log("In updatestock : ",  stock, id)
        try {
            // const docRef = doc( db, "boutiques" , id)
            const docRef = doc( db, "boutiques", id)
            const docId = stock.articleId.toString()
            const res = await setDoc(docRef, {
                [docId]: {articleId: stock.articleId, quantiteStock: stock.quantiteStock, updatedAt: stock.updatedAt}
            }, {merge: true})
        }
        catch (err) {
        receptionError.value = err.message
        }
    }

    const getStock =async  (stockId) => {
        const docRef = doc(db,"boutiques", stockId)
            const res = await getDoc(docRef)
        if(res.exists()) {
            stock.value = {...res.data(), id: res.id}
        }
    }

const receptionArticles = () =>{
    return { receptionError,stock, getStock, reception, updateStock, venteStock}
}
export default receptionArticles
