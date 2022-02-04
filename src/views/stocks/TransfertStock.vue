<template>
      <div class="mx-1.5 " @click="hideModal">
        <div class=" active p0">
            <form class="produit p0"  @submit.prevent="handleSubmit">
                <div class="flex justify-end -mr-5  ml-auto">
                    <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
                </div>
                <h2 class="mb-6 font-bold text-center text-base">LIVRAISON D'ARTICLES</h2>
                    <div class="border rounded my-2 px-1">
                        <div class="flex justify-between  gap-1  my-2 px-1">
                            <!-- Stock principal -->
                        <div class="border rounded p-2 m-1 overflow-auto h-97">
                            <div >
                                <div class="flex justify-between items-center gap-2 ">
                                    <div class="input-field searchbar mx-1 mt-0  flex justify-start w-2/4">
                                        <input id="searchInput" type="text"  placeholder="Rechercher"  v-model="searchQuery">
                                        <span class="material-icons  -mx-9 p-4">
                                            search
                                        </span>
                                    </div>
                                    <div class="w-2/4 mx-1 mt-0">
                                        <select name="magasin" class="mt-0"  id="magasin" v-model="boutiqueReception" required>
                                            <option value="">Selectionner la boutique</option>
                                            <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="overflow-auto ">
                                <table class="table-auto overflow-auto bg-white divider-y divide-gray-400">
                                    <thead class="bg-gray-800 text-white">
                                        <tr>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Désignation</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">code famille</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">pvu</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Qté Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-gray-700">
                                        <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(article, n) in filteredArticles" :key="article.id">
                                            <td class="text-left  py-3 px-4 font-semibold uppercase text-xs underline hover:text-blue-400 cursor-pointer" @click="selectedArticle(article)">{{ article.designation}}</td>
                                            <td class="text-center  py-3 px-4 font-semibold uppercase text-xs">{{ article.codeFamille }}</td>
                                            <td class="text-left  py-3 px-4 font-semibold uppercase text-xs">{{ article.pvu}}</td>
                                            <td class="text-center  py-3 px-4 font-bold  text-xs ">{{boutiqueReception ? bringStock(article.id) : 0 }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <!-- Stock destination -->
                        <div class="border rounded p-2 m-1   overflow-auto">
                            <h2 class="my-4 font-bold text-center text-base">ARTICLE A LIVRER</h2>
                            <div class="border rounded p-2 m-1" >
                                <div class="flex justify-between items-center gap-2">
                                    <label for="designation" class="w-1/3">Article</label>
                                    <input type="text" name="designation" id="designation"  class="uppercase text-xs font-bold w-full text-center" placeholder="Désignation de l'article" required disabled v-model="designation" >
                                </div>
                                <div class="flex justify-between items-center gap-2">
                                    <label for="Famille" class="w-1/3">Code Famille</label>
                                <input type="text" placeholder="Famille" id="Famille" class="uppercase text-xs text-center" v-model="codeFamille" disabled >
                                </div>
                                <div class="flex justify-between items-center gap-2">
                                    <label for="qteStock" class="w-1/3">Stock</label>
                                    <input type="text" name="qteStock" id="qteStock" class="uppercase text-xs text-center font-bold"  placeholder="Quantité en stock"  v-model="quantiteStock" disabled>
                                </div>
                                <div class="flex justify-between items-center gap-2">
                                    <label for="qteStock" class="w-1/3">Stock restant</label>
                                    <input type="text" name="qteStock" id="qteStock" class="uppercase text-xs text-center font-bold"  placeholder="Stock restant"  v-model="quantiteStockRestant" disabled>
                                </div>
                                <div class="flex justify-between items-center gap-2">
                                    <label for="qtedesintegre" class="w-1/3">Qté à transferer</label>
                                    <input type="text" id="qtedesintegre" class="uppercase text-xs text-center " :class="{ 'border-red-400 error': calcError}" placeholder="Qté à transferer"  v-model="quantiteTransfert"  @input="operation">
                                </div>
                                <div class="error">{{ calcError }}</div>
                            </div>
                            <button class="bg-green-500 hover:bg-green-600 hover:text-gray-700 py-1 px-5" @click.prevent="transferer">Ajouter</button>
                            <h2 class="my-4 font-bold text-center text-base">MAGASIN DE DESTINATION</h2>
                            <div class="border rounded p-2 m-1" >
                                <div class="mx-1 mt-0">
                                    <select name="magasin" class="mt-0"  id="magasin" v-model="boutiqueDestination" required>
                                        <option value="">Selectionner la boutique</option>
                                        <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                                    </select>
                                </div>
                            </div>
                            <button>Enregistrer</button>
                            <p class="error">{{ receptionError }}</p>
                            <p class="error">{{ getError }}</p>
                        </div>
                        </div>
                        <!-- A imprimer -->
                        <div class="overflow-auto border flex justify-center m-2">
                            <table class="table-auto overflow-auto bg-white divider-y divide-gray-400" id="livraison">
                                <thead class="bg-gray-800 text-white">
                                    <tr>
                                        <th class="text-left py-3 px-4 uppercase font-semibold text-xs">#</th>
                                        <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Désignation</th>
                                        <th class="text-left py-3 px-4 uppercase font-semibold text-xs">code famille</th>
                                        <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Qte à Livrer</th>
                                    </tr>
                                </thead>
                                <tbody class="text-gray-700">
                                    <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(article, n) in transferedArticles" :key="article.id">
                                        <td class="text-left  py-3 px-4 font-semibold uppercase text-xs underline hover:text-blue-400 cursor-pointer">{{ n+1}}</td>
                                        <td class="text-left  py-3 px-4 font-semibold uppercase text-xs underline hover:text-blue-400 cursor-pointer" @click="selectedArticle(article)">{{ article.designation}}</td>
                                        <td class="text-center  py-3 px-4 font-semibold uppercase text-xs">{{ article.codeFamille }}</td>
                                        <td class="text-left  py-3 px-4 font-semibold uppercase text-xs">{{ article.quantiteTransfert}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import receptionArticles from "../../controllers/receptionArticles"
import getDocuments from "../../controllers/getDocuments"
import { onMounted, onUnmounted, watch } from '@vue/runtime-core'
import { collection, getDoc, getDocs, onSnapshot, serverTimestamp, doc } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '../../firebase/config'
import updateDocument from '../../controllers/updateDocument'
import createDocument from '../../controllers/createDocument'
import genererPDF from '../../controllers/genererPDF'
export default {
    // props: [ 'editFournisseurId'],
    setup(props) {

        const listeBoutiques = ref(null)
        const listeArticles = ref(null)
        const id = ref('')
        const dateReception = ref('')
        const boutiqueReception = ref('')
        const idBoutiqueReception = ref("0FCmjkQYJlKDIQGidGEM")
        const idBoutiqueDestination = ref("qT2MsHMTZZQRsDv3qKyE")
        const boutiqueDestination = ref('')
        const designation = ref('')
        const pau = ref('')
        const newpau = ref('')
        const pvu = ref('')
        const newpvu = ref('')
        const codeFamille = ref('')
        const fournisseurId = ref('')
        const expiration = ref('')
        const seuil = ref('')
        const quantiteRecu = ref('')
        const newdesignation = ref('')
        const newquantiteStock = ref('')
        const quantiteStockRestant = ref('')
        const quantiteTransfert = ref('')
        const quantiteStock = ref('')
        const calcError = ref(null)
        const saisiepauError = ref(null)
        const saisiepvuError = ref(null)
        const saisieqteError = ref(null)
        const searchQuery = ref('')
        const fournisseurs = ref(null)
        const router = useRouter()
        const route = useRoute()
        const getError = ref(null)
        const articleRecu = ref([])
        const transferedArticles = ref([])
        const { receptionError,stock, getStock, reception, updateStock } = receptionArticles()
        const {updateError, update } = updateDocument()
        const { makeLivraison } = genererPDF()

        const getBoutiques = async () => {
            const docRef = collection(db, "boutiques")
            const res = onSnapshot(docRef, (snap)=>{
                listeBoutiques.value = snap.docs.map(doc => {
                        //console.log("verification : ", doc.data().gerantBoutique)
                        return {...doc.data(), id: doc.id}
                })
            })

        }
        watch(boutiqueReception, async()=>{
            if(boutiqueReception.value =='') {
                return
            }
            // console.log(boutiqueReception.value)
            await getStock(boutiqueReception.value)
        })

        watch(boutiqueDestination, async()=>{
            if(boutiqueDestination.value ==boutiqueReception.value) {
                alert("La boutique de depart et la boutique de destination sont identiques !")
                boutiqueDestination.value = "Selectionner une autre"
            }

        })

        const getArticles = async () => {
            const docRef = collection(db, "produits")
            const res = onSnapshot(docRef, (snap)=>{
                listeArticles.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })
        }
        const pullStock =  ( id) => {
            if(stock.value ) {
            // console.log("in pullStock : ", stock.value)
            for(let element in stock.value) {
            //   console.log(element.toString() , "=>", id, element.toString()==id)
              if(element.toString() == id){
                // console.log("stock : ", stock.value[element].quantiteStock)
                return stock.value[element].quantiteStock
              }
            }
            }

            // return stock
        }
        const bringStock = (id) => {
             return pullStock( id) ? pullStock( id) : 0

        }
        const filteredBoutiques = computed(()=>{
            return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
                // return boutique.gerantBoutique == auth.currentUser.email || boutique.designationBoutique == "Boutique principale"
                return boutique.gerantBoutique.includes( auth.currentUser.email) || boutique.designationBoutique == "Stock principal"
            })
        })

        const filteredArticles = computed(()=>{
            return listeArticles.value && listeArticles.value.filter((article)=>{
                return article.designation.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
            })
        })

        const getFournisseurs = async () => {
            const docRef = collection(db, "fournisseurs")
            const res = onSnapshot(docRef, (snap)=>{
                fournisseurs.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })

        }
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const showPop = () =>{
            document.querySelector(" .dropdown-popover").classList.toggle("active")
        }
        const selectedArticle = (article) => {
            //console.log("selectedArticle : ", article)
            id.value = article.id
            designation.value = article.designation
            codeFamille.value = article.codeFamille
            quantiteStock.value = bringStock(article.id)
            quantiteStockRestant.value = quantiteStock.value
            newdesignation.value = designation.value + "_detail"
            expiration.value = article.expiration
            fournisseurId.value = article.fournisseurId
            pau.value = article.pau
            pvu.value = article.pvu
            seuil.value = article.seuil

        }
        onMounted( async () => {
            boutiqueReception.value = idBoutiqueReception.value
            boutiqueDestination.value = idBoutiqueDestination.value
            getBoutiques()
            getArticles()
        })

        const transferer = () => {
            const aTransferer = {
                articleId : id.value,
                designation : designation.value,
                codeFamille : codeFamille.value,
                quantiteTransfert : Number(quantiteTransfert.value),
                quantiteStockRestant : Number(quantiteStockRestant.value),
            }
            transferedArticles.value.push(aTransferer)
            designation.value =''
            newdesignation.value =''
            pau.value = ''
            pvu.value = ''
            fournisseurId.value = ''
            codeFamille.value = ''
            expiration.value = ''
            seuil.value = ''
            quantiteRecu.value = ''
            quantiteStock.value = ''
            quantiteStockRestant.value = ''
            quantiteTransfert.value = ''
            newdesignation.value = ''
            newquantiteStock.value = ''
            newpau.value = ''
            newpvu.value = ''
        }

        const makePDF = () => {
            /// Generate facture in pdf
                 let day = new Date().getDate()
                let month = new Date().getMonth() < 10 ? new Date().getMonth() < 1 ? "01": "0" + new Date().getMonth() : new Date().getMonth()
                let year = new Date().getYear()
                const factureId =  month + year + new Date().getMinutes()+  new Date().getSeconds()
                const demandeur = prompt("Qui prend ? : ", "Nom et Prenom")
                let options = {
                    client: demandeur ? demandeur  : "Au porteur",
                    gerant: auth.currentUser.displayName
                }
                makeLivraison({title : 'Bon de Livraison N° ' + factureId, orientation : "p", format : "a4",data : [], id : 'livraison', option: options})

            /// End of Generate facture in pdf
        }

        const handleSubmit = async () => {
            const { createError, create } = createDocument()
            if(!boutiqueDestination.value) {
                alert("Selectionnez la boutique de destination ! ")
                return
            }
            transferedArticles.value.forEach(async article => {
                const stock = {
                    //boutiqueReception : boutiqueReception.value,
                    articleId : article.articleId,
                    quantiteStock : Number(article.quantiteTransfert),
                    updatedAt: serverTimestamp()
                }
                await reception(stock, boutiqueDestination.value )

                const oldStok = {
                    articleId : article.articleId,
                    quantiteStock : Number(article.quantiteStockRestant),
                    updatedAt: serverTimestamp()
                }
                await updateStock(oldStok, boutiqueReception.value)
            })
            makePDF()



            if(!receptionError.value){
                designation.value =''
                newdesignation.value =''
                pau.value = ''
                pvu.value = ''
                fournisseurId.value = ''
                codeFamille.value = ''
                expiration.value = ''
                seuil.value = ''
                quantiteRecu.value = ''
                quantiteStock.value = ''
                quantiteStockRestant.value = ''
                quantiteTransfert.value = ''
                newdesignation.value = ''
                newquantiteStock.value = ''
                newpau.value = ''
                newpvu.value = ''

            }
        }


        const saisiepau = () => {
            try {
                if(newpau.value !=''){
                    if(isNaN(newpau.value)) {
                        throw Error("Saisie invalid")
                    }else saisiepauError.value = ''
                }else saisiepauError.value = ''
            } catch (error) {
                saisiepauError.value = error.message
            }
        }
        const saisiepvu = () => {
            try {
                if(newpvu.value !=''){
                    if(isNaN(newpvu.value)) {
                        throw Error("Saisie invalid")
                    }else saisiepvuError.value = ''
                }else saisiepvuError.value = ''
            } catch (error) {
                saisiepvuError.value = error.message
            }
        }
        const saisieqte = () => {
            try {
                if(newquantiteStock.value !=''){
                    if(isNaN(newquantiteStock.value)) {
                        throw Error("Saisie invalid")
                    }else saisieqteError.value = ''
                }else saisieqteError.value = ''
            } catch (error) {
                saisieqteError.value = error.message
            }
        }

        const operation = (e) => {
            calcError.value = null
            try {
                if(quantiteTransfert.value !='' || !quantiteTransfert.value ==null) {
                    quantiteStockRestant.value = Number(quantiteStock.value) - Number(quantiteTransfert.value)
                    // console.log("Qt : ", isNaN(quantiteStockRestant.value), quantiteStockRestant.value)
                    if(isNaN(quantiteStockRestant.value) || quantiteStockRestant.value < 0) {
                        throw Error("Saisie invalid")
                    }
                }

            } catch (error) {
                calcError.value = error.message
            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            transferer,
            dateReception,
            boutiqueReception,
            boutiqueDestination,
            bringStock,
            pullStock,
            listeArticles,
            selectedArticle,
            articleRecu,
            id,
            listeBoutiques,
            filteredBoutiques,
            filteredArticles,
            designation,
            pau,
            pvu,
            newpau,
            newpvu,
            codeFamille,
            quantiteRecu,
            transferedArticles,
            newdesignation,
            newquantiteStock,
            quantiteStock,
            quantiteStockRestant,
            quantiteTransfert,
            operation,
            calcError,
            saisiepauError,
            saisiepvuError,
            saisieqteError,
            saisieqte,
            fournisseurs,
            searchQuery,
            showPop,
            hideModal,
            receptionError,
            getError,
            goBack,
            saisiepau,
            saisiepvu,

        }
    }
}
</script>

<style>

</style>
