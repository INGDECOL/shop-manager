<template>
      <div class="mx-1.5 w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="mb-6 font-bold text-center text-base">RECEPTION D'ARTICLES</h2>
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <!-- <div class="produit "> -->
                    <div class="border rounded mb-2 px-1">
                      <div class="flex justify-between items-center">
                        <!-- Date reception  -->
                          <div>
                            <label for="dateReception" class="-mb-5" >Date Reception</label>
                            <input type="date" name="dateReception" id="dateReception" class="mt-0" required v-model="dateReception">
                          </div>
                          <!-- Boutique Reception -->
                          <div>
                              <label for="magasin" class="-mb-5">Boutique</label>
                              <select name="magasin" class="mt-0"  id="magasin" v-model="boutiqueReception" required>
                                  <option value="">Selectionner la boutique</option>
                                  <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                              </select>
                          </div>
                          <!-- Rechercher -->
                          <div class="w-1/3">
                              <label for="searchInput" class="-mb-5">Article</label>
                              <div class="input-field searchbar mx-1 mt-0  flex justify-start">
                                <input id="searchInput" type="text"  placeholder="Rechercher" @click="showPop" v-model="searchQuery">
                                <span class="material-icons  -mx-9 p-4">
                                    search
                                </span>
                               </div>
                              <div class="dropdown-popover searchList">
                                  <div class="options w-full">
                                      <ul>
                                          <li v-for="article in filteredArticles" :key="article.id" @click="selectedArticle(article)">{{ article.designation }} {{ article.codeFamille}}</li>
                                      </ul>
                                  </div>

                              </div>
                          </div>
                      </div>
                      <hr>
                      <div class="flex justify-around items-center my-4 gap-0.5">
                        <input type="text" name="designation"   class="uppercase text-xs" placeholder="Désignation de l'article" required v-model="designation" disabled>
                        <input type="text" placeholder="Famille" class="uppercase text-xs" v-model="codeFamille" disabled >
                        <input type="text" name="pvu" class="uppercase text-xs text-center"  placeholder="Prix de vente"  v-model="pvu" disabled>
                      <input type="text" name="seuil" class="uppercase text-xs text-center" placeholder="reçue"  v-model="quantiteRecu" required @keypress.enter.prevent="handleSubmit">

                      </div>
                      <div >
                        <hr class="mb-1 border-gray-700">
                        <table class="min-w-full bg-white divider-y divide-gray-400">
                            <thead class="bg-gray-800 text-white">
                                <tr>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Désignation</th>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">code famille</th>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">pvu</th>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Qté Réçue</th>
                                </tr>
                            </thead>
                            <tbody class="text-gray-700">
                                <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(produit, n) in articleRecu" :key="produit.id">
                                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ produit.designation}}</td>
                                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ produit.codeFamille }}</td>
                                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ produit.pvu}}</td>
                                    <td class="text-center py-3 px-4 font-semibold uppercase ">{{ produit.quantiteRecu}}</td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    </div>

                <button>Enregistrer</button>
                <p class="error">{{ receptionError }}</p>
                <p class="error">{{ getError }}</p>
            </form>
            <div>
            </div>
        </div>
    </div>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import receptionArticles from "../../controllers/receptionArticles"
import getDocuments from "../../controllers/getDocuments"
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { collection, getDocs, onSnapshot, serverTimestamp } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { db, auth } from '../../firebase/config'
import getDocument from '../../controllers/getDocument'
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
        const pvu = ref('')
        const codeFamille = ref('')
        const quantiteRecu = ref('')
        const quantiteStock = ref('')
        const fournisseurs = ref(null)
        const searchQuery = ref('')
        const router = useRouter()
        const route = useRoute()
        const getError = ref(null)
        const articleRecu = ref([])
        const { receptionError, reception } = receptionArticles()

        const getBoutiques = async () => {
            const docRef = collection(db, "boutiques")
            const res = onSnapshot(docRef, (snap)=>{
                listeBoutiques.value = snap.docs.map(doc => {
                        //console.log("verification : ", doc.data().gerantBoutique)
                        return {...doc.data(), id: doc.id}
                })
            })

        }
        const getArticles = async () => {
            const docRef = collection(db, "produits")
            const res = onSnapshot(docRef, (snap)=>{
                listeArticles.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })
        }
        const filteredBoutiques = computed(()=>{
            return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
                return boutique.gerantBoutique == auth.currentUser.email
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
            document.querySelector(" .searchList").classList.toggle("active")
        }
        const selectedArticle = (article) => {
            console.log("selectedArticle : ", article)
            id.value = article.id
            designation.value = article.designation
            codeFamille.value = article.codeFamille
            pau.value = article.pau
            pvu.value = article.pvu
            quantiteStock.value = 0
            showPop()
        }
        onMounted( async () => {
            getBoutiques()
            getArticles()
            receptionError.value = null
            //console.log("boutiquessssssss : ", listeBoutiques.value, auth.currentUser.email)
        })

        const handleSubmit = async () => {
            receptionError.value = null
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            const receptionDate = new Date().toLocaleDateString(undefined, options)
            //console.log("date : ", receptionDate)
            if(id.value =='' || quantiteRecu.value=='' || boutiqueReception.value =='') {
                receptionError.value = "Saisie incomplète, choisissez un produit, un magasin ou entrez une quantité correcte !"
                return
            }
            const stock = {
                //boutiqueReception : boutiqueReception.value,
                articleId : id.value,
                quantiteStock : Number(quantiteRecu.value),
                updatedAt: serverTimestamp()
            }
            // console.log("fournisseur : ", fournisseur)
            await reception(stock, boutiqueReception.value )
            if(!receptionError.value){
                let data= {
                    designation: designation.value,
                    codeFamille: codeFamille.value,
                    pvu: pvu.value,
                    quantiteRecu: quantiteRecu.value
                }
                articleRecu.value.push(data)
                designation.value=''
                pau.value = ''
                pvu.value=''
                quantiteRecu.value=''
                codeFamille.value= ''
                console.log("listeArticles : ", articleRecu.value)
                // goBack()
            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            dateReception,
            boutiqueReception,
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
            codeFamille,
            quantiteRecu,
            fournisseurs,
            searchQuery,
            showPop,
            hideModal,
            receptionError,
            getError,
            goBack,

        }
    }
}
</script>

<style>

</style>
