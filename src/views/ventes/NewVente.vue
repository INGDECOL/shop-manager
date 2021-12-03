<template>
      <div class="mx-auto w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>

            <div class="flex justify-center items-center border rounded-md py-1.5 ">
              <!-- Date du jour -->
              <span class="flex justify-between items-center bg-blue-100 text-blue-600 text-sm font-bold mr-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-blue-200" title="Aujourd'hui">
                <span class="material-icons mr-1">date_range</span>
                {{dateDuJour}}

              </span>
              <!-- Vendeur -->
              <span class="flex justify-between items-center bg-green-100 text-green-600 text-sm font-bold mr-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-green-200" title="Vendeur">
                <span class="material-icons mr-1">people</span>
                {{vendeur.displayName}}

              </span>
              <!-- Boutique -->
              <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div>
              <!-- CLIENT -->
              <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="clientVenteId" class=" font-bold  cursor-pointer"  title="Client">
                      <option value="">CltDiv</option>
                      <option v-for="client in filteredClients" :key="client.id" :value="client.id">{{client.nom +" "+client.prenom }}</option>
                  </select>
              </div>
            </div>
            <div class="error">{{ receptionError }}</div>
            <div class="produit border flex justify-center  gap-0.5 mt-0">
                  <!-- cote gauche -->
                  <div class="rounded border mb-2 px-1 mx-1 w-full ">
                    <!-- Rechercher -->
                    <div class="flex justify-center items-center">
                        <div class="border flex justify-center items-center w-full m-1">
                            <span class="flex justify-between items-center bg-green-100 text-green-600 text-sm font-bold mx-2 px-2 py-1 rounded-md cursor-pointer hover:bg-green-200" title="Qté en Stock">{{ quantiteStock ? quantiteStock : "0000"}}</span>
                            <div class="input-field searchbar mx-1 mt-0  flex justify-start     w-full">
                                <input id="searchInput" type="text"  placeholder="Rechercher" @click="showPop" v-model="searchQuery">
                                <span class="material-icons  -mx-9 p-4">
                                    search
                                </span>
                            </div>
                            <!-- searchbar -->
                            <div class="dropdown-popover  searchList mt-36">
                                <div class="options w-full ">
                                    <ul>
                                        <li v-for="article in filteredArticles" :key="article.id" @click="selectedArticle(article)">{{ article.designation }} {{ article.codeFamille}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border m-1 flex flex-col gap-1 p-1">
                        <input type="text" name="designation"   class="uppercase m-1 ml-0" placeholder="Désignation de l'article" required disabled v-model="designation" >
                        <input type="text" name="codeFamille"
                        placeholder="Famille article " v-model="codeFamille" required disabled>
                        <input type="text" name="pvu"  placeholder="Prix Unitaire"  v-model="pvu" required disabled>
                        <input type="number" name="qtecmd" id="qtecmd" min="1" v-model="qtecmd">
                    </div>
                    <button class="mb-1" @click.prevent="addCommande">Valider</button>
                  </div>
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 w-full">
                        <div class="border m-1 p-1 max-h-48 min-h-48 overflow-y-scroll">
                            <table class="min-w-full bg-white divider-y divide-gray-400 ">
                                <thead class="bg-gray-800 text-white">
                                        <tr>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Désignation</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">P. Unitaire</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Qté</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Total</th>
                                        </tr>
                                </thead>
                                <tbody class="text-gray-700 ">
                                    <tr class="border-b border-gray-400 " :class="{ striped : n % 2 ===0}" v-for="(cmd,n) in commandes" :key="cmd.id">
                                        <td class="text-left py-3 px-4 font-semibold uppercase"><span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne">x</span></td>
                                        <td class="text-left py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.designation }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pvu}}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pvu * cmd.qtecmd }}</td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <!-- Mode reglement et validation -->
                        <div class="border m-1">
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label for="">Règlement </label>
                                <select name="modeReglement" id="modeReglement" required class="h-6 text-xs py-0">
                                    <option value="Espece">Espèce</option>
                                    <option value="Virement">Virement</option>
                                </select>

                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total TTC </label>
                                <input type="text" name="montanttotalttc" id="montanttotalttc" class="h-1" disabled>

                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total Règlé </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="h-1">

                            </div>
                        </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Enregistrer</button>
                        <p class="error">{{ createError }}</p>

                    </div>
                </div>

            </form>
            <div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import createDocument from '../../controllers/createDocument'
import { collection, onSnapshot, serverTimestamp } from '@firebase/firestore'
import { onMounted, watch } from '@vue/runtime-core'
import { db, auth } from '../../firebase/config'
import { getAuth } from '@firebase/auth'
import receptionArticles from '../../controllers/receptionArticles'

export default {
  setup () {
        const id = ref('')
        const designation = ref('')
        const boutiqueVente = ref('')
        const listeBoutiques = ref(null)
        const listeClients = ref(null)
        const listeArticles = ref(null)
        const searchQuery = ref('')
        const pau = ref('')
        const pvu = ref('')
        const expiration = ref('')
        const codeFamille = ref('')
        const quantiteStock = ref('')
        const qtecmd = ref('')
        const commandes = ref([])
        const clientVenteId = ref('')
        const seuil = ref('')
        // const nomFournisseur = ref('')
        // const prenomFournisseur = ref('')
        // const contactFournisseur = ref('')
        // const familles = ref(null)
        // const fournisseurs = ref(null)
        const vendeur = ref(getAuth().currentUser)
        const router = useRouter()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
         const { receptionError,stock, getStock, reception, updateStock } = receptionArticles()
          const  dateDuJour = new Date().toLocaleDateString(undefined, options)

        const { createError, create } = createDocument()

        const showPop = () =>{
          document.querySelector(" .searchList").classList.toggle("active")
        }
        const selectedArticle = (article) => {
            if(!boutiqueVente.value) {
                alert("Veuillez Selectionner une boutique ! ")
                showPop()
                return
            }
            id.value = article.id
            designation.value = article.designation
            codeFamille.value = article.codeFamille
            pau.value = article.pau
            pvu.value = article.pvu
            quantiteStock.value = 0
            qtecmd.value = 1
            searchQuery.value = article.designation
            console.log("selectedArticle : ", article, qtecmd.value)
            bringStock(article.id)
            showPop()
        }

        // const getFamilles = async () => {
        //     const docRef = collection(db, "familles")
        //     const res = onSnapshot(docRef, (snap)=>{
        //         familles.value = snap.docs.map(doc => {
        //             // console.log("snap doc : ", doc.data());
        //             return {...doc.data(), id: doc.id}
        //         })
        //     })

        // }
        // const getFournisseurs = async () => {
        //     const docRef = collection(db, "fournisseurs")
        //     const res = onSnapshot(docRef, (snap)=>{
        //         fournisseurs.value = snap.docs.map(doc => {
        //             // console.log("snap doc : ", doc.data());
        //             return {...doc.data(), id: doc.id}
        //         })
        //     })

        // }
        const getArticles = async () => {
            const docRef = collection(db, "produits")
            const res = onSnapshot(docRef, (snap)=>{
                listeArticles.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })
        }
        const getClients = async () => {
            const docRef = collection(db, "clients")
            const res = onSnapshot(docRef, (snap)=>{
                listeClients.value = snap.docs.map(doc => {
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
        const getBoutiques = async () => {
          const docRef = collection(db, "boutiques")
          const res = onSnapshot(docRef, (snap)=>{
              listeBoutiques.value = snap.docs.map(doc => {
                  return {...doc.data(), id: doc.id}
              })
          })

        }
        const filteredBoutiques = computed(()=>{
          return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
              return boutique.gerantBoutique == auth.currentUser.email
          })
        })

        const filteredClients = computed(()=>{
          return listeClients.value && listeClients.value.filter((client)=>{
              return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          })
        })

        watch(boutiqueVente, async()=>{
            if(boutiqueVente.value =='') {
                return
            }
            await getStock(boutiqueVente.value)
        })

        const filteredArticles = computed(()=>{
            return listeArticles.value && listeArticles.value.filter((article)=>{
                return article.designation.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
            })
        })

        const pullStock =  ( id) => {
            if(stock.value ) {
            // console.log("in pullStock : ", stock.value)
            for(let element in stock.value) {
              if(element.toString() == id){
                // console.log("stock : ", stock.value[element].quantiteStock)
                return stock.value[element].quantiteStock
              }
            }

            }

            // return stock
        }
        const bringStock = (id) => {
             quantiteStock.value =  pullStock( id) ? pullStock( id) : 0

        }
        const addCommande = () => {
            if(qtecmd.value > quantiteStock.value) {
                alert("La quantité demandée est supérieur au stock disponible !")
                return
            }
            let commande = {
                id : id.value,
                designation : designation.value,
                pvu : pvu.value,
                qtecmd : qtecmd.value,
            }
            commandes.value.push(commande)
            console.log("liste commande : ", commandes.value)
            designation.value=""
            id.value=""
            pvu.value=""
            qtecmd.value=1
            codeFamille.value=""

        }

        onMounted( async () => {
            // getFamilles()
            // getFournisseurs()
            getBoutiques()
            getArticles()
            getClients()
        })

        const handleSubmit = async () => {

            const produit = {
                designation: designation.value.toUpperCase(),
                pau: Number(pau.value),
                pvu: Number(pvu.value),
                fournisseurId: fournisseurId.value,
                codeFamille: codeFamille.value,
                expiration: expiration.value,
                seuil: Number(seuil.value),
                createdAt: serverTimestamp()
            }
            // console.log("fournisseur : ", fournisseur)
            await create("produits", produit)
            if(!createError.value){
                document.querySelector(".active form").reset()
                designation.value=''
                pau.value = ''
                pvu.value=''
                seuil.value=''
                fournisseurId.value=''
                codeFamille.value= ''
            }
        }
        const goBack = () => {
            router.back()
        }
        return {
            dateDuJour,
            receptionError,
            vendeur,
            showPop,
            selectedArticle,
            filteredArticles,
            boutiqueVente,
            filteredBoutiques,
            filteredClients,
            searchQuery,
            handleSubmit,
            id,
            designation,
            pau,
            pvu,
            codeFamille,
            clientVenteId,
            expiration,
            seuil,
            quantiteStock,
            bringStock,
            qtecmd,
            hideModal,
            addCommande,
            commandes,
            createError,
            goBack,

        }
  }

}
</script>

<style>

</style>
