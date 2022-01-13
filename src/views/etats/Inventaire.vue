<template>
      <div class="mx-1.5 w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
                <div class="flex justify-end -mr-5  ml-auto">
                    <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
                </div>
                <h2 class="mb-6 font-bold text-center text-base">INVENTAIRE GLOBAL DES ARTICLES PAR BOUTIQUE</h2>
                    <div class="flex justify-center items-center  gap-2  my-2 px-1">
                      <div class="border rounded p-2 m-1 ">
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
                        <table class="min-w-full bg-white divider-y divide-gray-400">
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
                                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs underline hover:text-blue-400 cursor-pointer" @click="selectedArticle(article)">{{ article.designation}}</td>
                                    <td class="text-center py-3 px-4 font-semibold uppercase text-xs">{{ article.codeFamille }}</td>
                                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ article.pvu}}</td>
                                    <td class="text-center py-3 px-4 font-bold  text-xs ">{{boutiqueReception ? bringStock(article.id) : 0 }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button>Imprimer</button>
                        <p class="error">{{ receptionError }}</p>
                        <p class="error">{{ getError }}</p>
                      </div>
                      <!-- <div class=" w-2/4 pt-1 -mt-3">
                            <h2 class="my-4 font-bold text-center text-base">ARTICLE A DESINTEGRER</h2>
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
                                <label for="qtedesintegre" class="w-1/3">Qté à désintegrer</label>
                                <input type="text" id="qtedesintegre" class="uppercase text-xs text-center " :class="{ 'border-red-400 error': calcError}" placeholder="Qté à desintegrer"  v-model="quantiteDesintegrer" required @input="operation">
                            </div>
                            <div class="error">{{ calcError }}</div>
                        </div>
                        <h2 class="my-4 font-bold text-center text-base">NOUVEL ARTICLE CORRESPONDANT</h2>
                        <div class="border rounded p-2 m-1" >
                            <div class="flex justify-between items-center gap-2">
                                <label for="designation" class="w-1/3">Nouvel Article</label>
                                <input type="text" name="designation" id="designation"  class="uppercase text-xs font-bold w-full text-center" placeholder="Désignation de l'article" required  v-model="newdesignation" >
                            </div>
                            <div class="flex justify-between items-center gap-2">
                                <label for="Famille" class="w-1/3">Code Famille</label>
                            <input type="text" placeholder="Famille" id="Famille" class="uppercase text-xs text-center" v-model="codeFamille" disabled >
                            </div>
                            <div class="flex justify-between items-center gap-2">
                                <label for="qteStock" class="w-1/3">Stock correspondant</label>
                                <input type="text" name="qteStock" id="qteStock" class="uppercase text-xs text-center font-bold" :class="{ 'border-red-400 error': saisieqteError}" placeholder="Quantite correspondante"  v-model="newquantiteStock" @input="saisieqte">
                            </div>
                            <div class="error">{{ saisieqteError}}</div>
                            <div class="flex justify-between items-center gap-2">
                                <label for="qteStock" class="w-1/3">Prix d'achat</label>
                                <input type="text" name="qteStock" id="qteStock" class="uppercase text-xs text-center font-bold" :class="{ 'border-red-400 error': saisiepauError}"  placeholder="Prix d'achat"  v-model="newpau" @input="saisiepau">
                            </div>
                            <div class="error">{{ saisiepauError}}</div>
                            <div class="flex justify-between items-center gap-2">
                                <label for="qteStock" class="w-1/3">Prix de vente</label>
                                <input type="text" name="qteStock" id="qteStock" class="uppercase text-xs text-center font-bold"  :class="{ 'border-red-400 error': saisiepvuError}" placeholder="Prix de vente"  v-model="newpvu" @input="saisiepvu">
                            </div>
                            <div class="error">{{ saisiepvuError}}</div>

                        </div>

                      </div> -->
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
import getUser from '../../controllers/getUser'
export default {
    // props: [ 'editFournisseurId'],
    setup(props) {

        const listeBoutiques = ref(null)
        const listeArticles = ref(null)
        const id = ref('')
        const dateReception = ref('')
        const boutiqueReception = ref('')
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
        const quantiteDesintegrer = ref('')
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
        const { receptionError,stock, getStock, reception, updateStock } = receptionArticles()
        const {updateError, update } = updateDocument()

        const isAdmin = ref(async () =>{
            const { findUser, error, user } = getUser()
            let _user = auth.currentUser
            if(_user) {
                await findUser(_user.uid)
                if(user.value.fonction !== 'Administrateur'){
                    return false

                } else {
                    return true
                }
                }else {
                router.push({ name: "Home"})
                }
        })


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
            await getStock(boutiqueReception.value)
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
        if(isAdmin){
          return boutique //.gerantBoutique == auth.currentUser.email
        }else {
          return boutique.gerantBoutique == auth.currentUser.email

        }
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
            getBoutiques()
            getArticles()
            //getFournisseurs()
            //console.log("boutiquessssssss : ", listeBoutiques.value, auth.currentUser.email)
        })

        const handleSubmit = async () => {
            const { createError, create } = createDocument()
            const newArticle = {
                designation: newdesignation.value.toUpperCase(),
                pau: Number(newpau.value),
                pvu: Number(newpvu.value),
                fournisseurId: fournisseurId.value,
                codeFamille: codeFamille.value,
                expiration: expiration.value,
                seuil: Number(seuil.value),
                createdAt: serverTimestamp()
            }
            // console.log("produit : ", newArticle);
            //  const res = await create("produits", newArticle)
             if(createError.value){
                 getError.value = createError.value
                 return
             }
            //  id.value = res.id
            //  console.log("idddd : ", id.value)

            //   if(res.id =='' || res.id == null) {
            //       receptionError.value = "L'article est enregistré mais impossible de mettre à jour le stock, essayer avec le formulaire de reception"
            //     return
            //  }

            // const stock = {
            //     //boutiqueReception : boutiqueReception.value,
            //     articleId : res.id,
            //     quantiteStock : Number(newquantiteStock.value),
            //     updatedAt: serverTimestamp()
            // }
            // console.log("fournisseur : ", fournisseur)
            // await reception(stock, boutiqueReception.value )

            const oldStok = {
                articleId : id.value,
                quantiteStock : Number(quantiteStockRestant.value),
                updatedAt: serverTimestamp()
            }
            // await updateStock(oldStok, boutiqueReception.value)


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
                quantiteDesintegrer.value = ''
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
                if(quantiteDesintegrer.value !='' || !quantiteDesintegrer.value ==null) {
                quantiteStockRestant.value = Number(quantiteStock.value) - Number(quantiteDesintegrer.value)
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
            dateReception,
            boutiqueReception,
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
            newdesignation,
            newquantiteStock,
            quantiteStock,
            quantiteStockRestant,
            quantiteDesintegrer,
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
