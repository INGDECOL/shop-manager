<template>
      <div class="mx-auto " @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <!-- INFO DATE Vendeur CLIENT -->
            <div class="flex justify-center items-center border rounded-md py-1.5 ">
              <!-- Date du jour -->
              <span class="flex justify-between items-center bg-blue-100 text-blue-600 text-xs  mx-1 pr-2 py-0.5 rounded-md cursor-pointer  hover:bg-blue-200 md:font-bold md:mx-2 md:pr-2.5 md:text-sm"  title="Aujourd'hui">
                <span class=" material-icons mr-1 ">date_range</span>
                {{dateDuJour}}

              </span>
              <!-- Vendeur -->
              <span class="text-xs flex justify-between items-center bg-green-100 text-green-600 md:text-sm md:font-bold mr-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-green-200" title="Vendeur">
                <span class="material-icons mr-1">people</span>
                {{vendeur.displayName}}

              </span>
              <!-- Boutique -->
              <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" md:font-bold md:text-sm text-xs mr-2 pr-2.5 cursor-pointer"  required title="Magasin" disabled>
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div>
              <!-- CLIENT -->
              <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="clientVenteId" class="text-xs md:font-bold md:text-sm  cursor-pointer"  title="Client" @change="changedClient">
                      <option value="">CltDiv</option>
                      <option v-for="client in filteredClients" :key="client.id" :value="client.id +'_'+client.prenom" @click="selectedClient(client)">{{client.nom +" "+client.prenom }}</option>
                  </select>
              </div>
            </div>
            <div class="error">{{ receptionError }}</div>
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
                <!-- Total de la facture -->
                <div class="flex justify-end " :class="{'flex justify-between gap-2': (avance)}">
                    <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base md:font-bold ml-8  rounded-md cursor-pointer hover:bg-green-200" v-if="avance">
                       <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4"> Avance </span>
                        <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4">{{formatedNumber( montantRegle ? (avance.montantAvance - montantRegle)>=0 ? (avance.montantAvance - montantRegle): 0  : avance.montantAvance) }}</span>
                    </span>
                    <span class="flex justify-center gap-4 bg-green-300 text-gray-600 md:text-base md:font-bold mr-8  rounded-md cursor-pointer hover:bg-green-200">
                       <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4"> Montant TTC</span>
                        <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4">{{formatedNumber( totalTTC ? totalTTC  : 0) }}</span>
                    </span>
                </div>
                <div class="produit  md:flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote gauche -->
                  <div class="rounded border mb-2 px-1 mx-1 md:w-full ">
                    <!-- Rechercher -->
                    <div class="flex justify-center items-center">
                        <div class="border flex justify-center items-center w-full m-1">
                            <span class="flex justify-between items-center bg-green-100 text-green-600 md:text-sm font-bold mx-2 px-2 py-1 rounded-md cursor-pointer hover:bg-green-200" title="Qté en Stock">{{ quantiteStock ? quantiteStock : "0000"}}</span>
                            <div class="input-field searchbar mx-1 mt-0  flex justify-start   w-full">
                                <input id="searchInput" type="text"  placeholder="Rechercher" @click="showPop" v-model="searchQuery">
                                <span class=" material-icons  -mx-9 p-4">
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
                        <input type="text" name="pvu"  placeholder="Prix Unitaire"  v-model="pvu">
                        <input type="number" name="qtecmd" id="qtecmd" min="1" v-model="qtecmd">
                    </div>
                    <!-- <button class="mb-1" @click.prevent="addCommande">Valider</button> -->
                    <div class="mt-5 mb-2">
                    <span class="mb-2 font-bold bg-yellow-400 rounded-lg p-2.5 cursor-pointer hover:text-gray-600 hover:bg-yellow-300" @click="addCommande">Valider</span>

                    </div>
                  </div>
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full" id="cmd">
                        <div class="border m-1 p-1 max-h-48 overflow-y-scroll overflow-x-scroll">
                            <table class="min-w-full bg-white divider-y divide-gray-400 " id="commande1">
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
                                        <td class="text-left py-3 px-4 font-semibold uppercase">
                                            <span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne" @click="removeCommande(cmd)">x</span>
                                        </td>
                                        <td class="text-left py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.designation }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ (cmd.pvu)}}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ (cmd.pvu * cmd.qtecmd) }}</td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <!-- Mode reglement et validation -->
                        <div class="border m-1">
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label for="">Règlement </label>
                                <select name="modeReglement" id="modeReglement" v-model="modeReglement" required class="h-6 text-xs py-0">
                                    <option value="Espece" selected>Espèce</option>
                                    <option value="Virement">Virement</option>
                                </select>

                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total TTC </label>
                                <input type="text" name="montanttotalttc" id="montanttotalttc" class="h-1" v-model="totalTTC" disabled>
                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total Règlé </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="h-1" v-model="montantRegle">

                            </div>
                        </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Enregistrer</button>
                        <p class="error">{{ createError }}</p>
                        <!-- Montant restant ou Montant à rendre -->
                        <div class="flex justify-center ">
                            <span class="flex justify-center gap-4 bg-green-300 text-red-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : ((totalTTC -  montantRegle) > 0) }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalTTC - montantRegle)>=0 ? "Reste dû " : "Avance" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{formatedNumber(montantRegle ? (reste()) :0) }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Facture à imprimer -->
                <div class="border m-1 p-1 max-h-48 overflow-y-scroll overflow-x-scroll hidden">
                    <table class="min-w-full bg-white border-collapse " id="commande">
                        <thead class="bg-gray-800 text-white">
                                <tr>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Désignation</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">P. Unitaire</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Qté</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Total</th>
                                </tr>
                        </thead>
                        <tbody class="text-gray-700 ">
                            <tr class="border-b border-gray-400 " :class="{ striped : n % 2 ===0}" v-for="(cmd,n) in commandes" :key="cmd.id">
                                <td class="text-left py-3 px-4 text-sm font-semibold uppercase">
                                    <span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne" @click="removeCommande(cmd)">{{n+1}}</span>
                                </td>
                                <td class="text-left py-3 px-4 text-sm  font-semibold uppercase">{{ cmd.designation }}</td>
                                <td class="text-center py-3 px-4 text-sm  font-semibold uppercase">{{ cmd.pvu}}</td>
                                <td class="text-center py-3 px-4 text-sm  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                <td class="text-center py-3 px-4 text-sm  font-semibold uppercase">{{ cmd.pvu * cmd.qtecmd }}</td>

                            </tr>

                        </tbody>
                        <tfoot>
                            <tr class="border-b border-gray-400 bg-gray-300">
                                <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="3">Totaux </td>
                                <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPVU)}} </td> -->
                                <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td>
                                <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(totalTTC)}} </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- <input type="file" name="fontconv" id="fontconv" @change="fontConverter"> -->
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import createDocument from '../../controllers/createDocument'
import setDocument from '../../controllers/setDocument'
import destroyDocument from '../../controllers/destroyDocument'
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore'
import { onMounted, watch } from '@vue/runtime-core'
import { db, auth } from '../../firebase/config'
import { getAuth } from '@firebase/auth'
import receptionArticles from '../../controllers/receptionArticles'
import avancesClient from '../../controllers/avanceClients'
import genererPDF from '../../controllers/genererPDF'
// import fontConv from '../../controllers/fontConverter'

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
        const clientId = ref('')
        const clientNom = ref('')
        const seuil = ref('')
        const totalTTC = ref('')
        const totalQte = ref('')
        const totalPVU = ref('')
        const montantRegle = ref('')
        const modeReglement = ref('')
        const facture = ref()
        const vendeur = ref(getAuth().currentUser)
        const soldeClients = ref([])
        const oldDette = ref()
        const idBoutiqueVente = ref("qT2MsHMTZZQRsDv3qKyE")
        // const reste = ref()
        // const avance = ref()
        const router = useRouter()
        const route = useRoute()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }

        const { receptionError,stock, getStock, updateStock } = receptionArticles()
        const { setAvanceClient, updateAvanceClient, getAvance, avance} = avancesClient()
        const  dateDuJour = new Date().toLocaleDateString(undefined, options)

        const { createError, create } = createDocument()
        const { setError, insert } = setDocument()
        const { destroy, error} = destroyDocument()

        const { makeFacture } = genererPDF()

        const formatedNumber = (strNumber) => {
            return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
        }

        const numberFormatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'GNF',
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        })
        const simpleNumberFormatter = new Intl.NumberFormat('de-DE', {
            // style: 'currency',
            // currency: '',
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        })
        const reste = ()=>{
            let reste =0
            if(montantRegle.value ) {
                if(avance.value){
                    reste = totalTTC.value - (Number(montantRegle.value) )
                }else {
                    reste = totalTTC.value - Number(montantRegle.value)
                }
            } else {
                if(avance.value){
                    reste = totalTTC.value - ( avance.value.montantAvance)
                }else {
                    reste = totalTTC.value
                }
            }
            return reste
        }

        const showPop = () =>{
          document.querySelector(" .searchList").classList.toggle("active")
        }
        const changedClient = () => {
             let clt =  listeClients.value.filter((c)=>{
                return c.id == clientVenteId.value.split("_")[0]
            })
            selectedClient(clt[0])
        }
        const selectedClient = (client) => {
            clientId.value = client.id
            clientNom.value = client.nom +" " + client.prenom + " " + client.contact
            avance.value=null
            getAvance(client.id)

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
            // console.log("selectedArticle : ", article, qtecmd.value)
            bringStock(article.id)
            showPop()
        }

        const getFacture = async (id) => {
            const docRef = doc( db, "factures", id)
            const res =  await getDoc(docRef)
            if(res.exists()){
                //console.log("REs data : ", res.data())
                facture.value = {...res.data(), id: id}

            }

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
              return boutique.gerantBoutique.includes( auth.currentUser.email)
          })
        })

        const filteredClients = computed(()=>{
          return listeClients.value && listeClients.value.filter((client)=>{
              return listeClients.value
            //   return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          })
        })

        watch(boutiqueVente, async()=>{
            if(boutiqueVente.value =='') {
                return
            }
            // console.log(boutiqueVente.value)
            await getStock(boutiqueVente.value)
        })

        watch(commandes.value, () => {
            // console.log("commande modified", commandes.value)
            totalTTC.value = 0
            totalQte.value = 0
            totalPVU.value = 0
            commandes.value.map(cmd => {
                if(cmd){
                    totalTTC.value += cmd.pvu * cmd.qtecmd
                    totalQte.value += cmd.qtecmd
                    totalPVU.value += cmd.pvu
                }
            })
            // console.log("Total TTC : ", (totalTTC.value).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0}))
            //Si c'est un Remboursement
            if(route.params.id) {
                soldeClients.value.forEach(solde => {
                    if(solde.factureId == route.params.id) {
                        // console.log("Dette : ", solde.montantDette, totalTTC.value)
                        if(totalTTC.value > 0 ){
                            montantRegle.value = Number(totalTTC.value ) - Number(solde.montantDette)

                        }else montantRegle.value = 0
                        oldDette.value = solde
                        boutiqueVente.value = solde.boutiqueVente
                    }
                })
            }
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
            if(!route.params.id) {
                if(qtecmd.value > quantiteStock.value) {
                    alert("La quantité demandée est supérieur au stock disponible !")
                    return
                }
                if(!id.value || !designation.value){
                    alert("Selectionner d'abord un produit !")
                    return
                }
            }
            let commande = {
                id : id.value,
                designation : designation.value,
                pvu : Number(pvu.value),
                qtecmd : Number(qtecmd.value),
                montantTotal: Number(qtecmd.value * pvu.value),
                stockRestant: Number(quantiteStock.value - qtecmd.value)

            }
            commandes.value.push(commande)
            // console.log("liste commande : ", commandes.value)
            designation.value=""
            id.value=""
            pvu.value=""
            qtecmd.value=1
            codeFamille.value=""
             searchQuery.value = ''

        }

        const removeCommande = (cmd) => {
            commandes.value.forEach(element => {
                if(cmd === element) {
                    commandes.value.splice(
                        commandes.value.indexOf(element),1
                    )
                }
                // console.log ("element : ", element , "cmd : ", cmd, "egalite ", cmd === element, "indexOf ", commandes.value.indexOf(cmd))
            })
            console.log("liste commande : ", commandes.value)
            // designation.value = ""
            // id.value = ""
            // pvu.value = ""
            // qtecmd.value = 1
            // codeFamille.value = ""

        }

        onMounted( async () => {
            // getFamilles()
            boutiqueVente.value = idBoutiqueVente.value
            getBoutiques()
            getArticles()
            getClients()
            await getSolde()

            if(route.params.id) {
                // console.log("Router params : ", route.params.id)
                await getFacture(route.params.id)
                boutiqueVente.value = facture.value.boutiqueId
                // console.log("boutiquevente : ", boutiqueVente.value)
                retrieveCommande(facture.value.articles)
            }
            modeReglement.value="Espece"

        })

        const retrieveCommande = (articles) => {
            // console.log("articles length :", articles.designation)
            articles.forEach( article => {
                // console.log("retrieve : ", article.article)
                 id.value = article.id
                designation.value = article.article
                pvu.value = Number(article.pvu)
                qtecmd.value = Number(article.qtecmd)
                // montantTotal: Number(qtecmd.value * pvu.value),
                addCommande()
            })
            clientVenteId.value = facture.value.clientId
            clientId.value = facture.value.clientId

            // console.log("client  : ", clientVenteId.value)
        }

        const getSolde = async () =>{
            const docRef =  collection(db, "dettes")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                // console.log("snap vente", snap.docs)
                soldeClients.value = snap.docs.map(doc =>{
                    //doc.data().createdAt = doc.data().createdAt.seconds
                    return {...doc.data(), id : doc.id}
                })
            // console.log("solde : ", soldeClients.value)
            })
        }

        const handleSubmit = async () => {

            // Remboursement
            if(route.params.id) {
                const factureId = route.params.id
                // console.log("Data to send : ", oldDette.value.id)
                // Save dette
                if((totalTTC.value - montantRegle.value) > 0 ) {
                    let dette = {
                        clientId: clientVenteId.value ? clientId.value : "CltDiv",
                        factureId: factureId,
                        montantDette: Number(totalTTC.value - montantRegle.value),
                        boutiqueVente: boutiqueVente.value,
                        createdAt: serverTimestamp()
                    }
                    insert("dettes", dette, oldDette.value.id)
                    // console.log("Data to send : ", dette, oldDette.value.id)

                }else {
                    destroy("dettes", oldDette.value.id)
                }
                if(!setError.value) {
                    if( (totalTTC.value - montantRegle.value) > 0 ) {
                        let restant = (totalTTC.value - montantRegle.value)
                        // console.log("restant ", restant)
                        alert("Remboursemente effectué avec succès, \n mais le client doit toujours " + formatedNumber(restant))
                    }else alert("Remboursement effectué avec succès ! ")

                    commandes.value.splice(0, commandes.value.length)
                    designation.value=""
                    id.value=""
                    pvu.value=""
                    qtecmd.value=1
                    codeFamille.value=""
                    montantRegle.value =0
                    montantRegle.value ="0"
                    totalTTC.value =0
                }
                router.push({ name: 'Vente', params: { token: auth.currentUser.accessToken}})
                return
            }
            if(!commandes.value.length) {
                alert("Il n'ya aucune commande à enregistrer ! ")
                return
            }

            // Nouvelle vente
            let day = new Date().getDate()
            let month = new Date().getMonth() < 10 ? new Date().getMonth() < 1 ? "01": "0" + new Date().getMonth() : new Date().getMonth()
            let year = new Date().getYear()
            const factureId =  month + year + new Date().getMinutes()+  new Date().getSeconds()
            // console.log(factureId)

            if(clientVenteId.value =="CltDiv" || clientVenteId.value =='') {
                if((totalTTC.value - montantRegle.value) > 0 ) {
                    alert("Le montant Total de la facture est supérieur au montant règlé, or le client divers n'est pas autorisé à effectuer des ventes à crédit. \n Pensez à Enregistrer cet client !")
                    return
                }else if( (totalTTC.value - montantRegle.value) < 0) {
                    alert("Les avances sur vente ne sont pas autorisés pour les clients divers. \n Pensez à Enregistrer cet client !")
                    return
                }
            }
             createError.value = null
            //  Save commande
            commandes.value.forEach(vte => {
                let vente = {
                    articleId: vte.id,
                    article: vte.designation,
                    pvu: Number(vte.pvu),
                    qtecmd: Number(vte.qtecmd),
                    payer: Number(vte.montantTotal),
                    clientId: clientVenteId.value ? clientVenteId.value: "CltDiv",
                    vendeur: vendeur.value.displayName,
                    factureId: factureId,
                    reste: 0,
                    boutiqueId: boutiqueVente.value,
                    createdAt: serverTimestamp()
                }
                create("ventes", vente)
                 if(createError.value) {
                     alert("Impossible d'enregistrer cette vente !")
                     return
                 }
                //  Diminuer le Stock
                const stock = {
                //boutiqueReception : boutiqueReception.value,
                articleId : vte.id,
                quantiteStock : Number(vte.stockRestant),
                updatedAt: serverTimestamp()
            }
            updateStock(stock,boutiqueVente.value)
            // console.log("cmd : ", vente)
            })
            // Save facture
            let articleFacture = commandes.value.map(article => {
                let data = {
                    id: article.id,
                    article: article.designation,
                    pvu : article.pvu,
                    qtecmd: article.qtecmd
                }
                return data
            })

            let facture = {
                id: factureId,
                clientId: clientVenteId.value ? clientId.value : "CltDiv",
                articles: articleFacture,
                boutiqueId: boutiqueVente.value,
                createdAt: serverTimestamp()
            }
            insert("factures", facture, facture.id)
            // console.log("facture vente : ", facture)

            // Save dette
            if(reste() > 0 ) {
                let dette = {
                    clientId: clientVenteId.value ? clientId.value : "CltDiv",
                    factureId: factureId,
                    montantDette: reste(),// Number(totalTTC.value - montantRegle.value),
                    boutiqueVente: boutiqueVente.value,
                    createdAt: serverTimestamp()
                }
                create("dettes", dette)
                // s'il yavait une avance
                if(avance.value){
                    if((avance.value.montantAvance - montantRegle.value ? montantRegle.value : totalTTC.value) >=0){
                        let avanceClt = {
                            clientId: clientVenteId.value ? clientId.value : "CltDiv",
                            montantAvance: Number(avance.value.montantAvance - montantRegle.value ? montantRegle.value : totalTTC.value),
                            boutiqueVente: boutiqueVente.value,
                            updatedAt: serverTimestamp()
                        }
                        updateAvanceClient(avanceClt, clientId.value)
                    }else {
                        let avanceClt = {
                            clientId: clientVenteId.value ? clientId.value : "CltDiv",
                            montantAvance: 0,
                            boutiqueVente: boutiqueVente.value,
                            updatedAt: serverTimestamp()
                        }
                        updateAvanceClient(avanceClt, clientId.value)
                    }
                }
            } else if(reste() < 0 ) {
                // console.log("reste < 0")
                let avanceClt = {
                    clientId: clientVenteId.value ? clientId.value : "CltDiv",
                    montantAvance: Number(totalTTC.value - montantRegle.value)*-1,
                    boutiqueVente: boutiqueVente.value,
                    createdAt: serverTimestamp()
                }
                setAvanceClient(avanceClt, clientId.value)
            }else {
                 if(avance.value){
                    if((avance.value.montantAvance - montantRegle.value ) >=0){
                        let avanceClt = {
                            clientId: clientVenteId.value ? clientId.value : "CltDiv",
                            montantAvance: Number(avance.value.montantAvance - montantRegle.value),
                            boutiqueVente: boutiqueVente.value,
                            updatedAt: serverTimestamp()
                        }
                        updateAvanceClient(avanceClt, clientId.value)
                    }else {
                        let avanceClt = {
                            clientId: clientVenteId.value ? clientId.value : "CltDiv",
                            montantAvance: 0,
                            boutiqueVente: boutiqueVente.value,
                            updatedAt: serverTimestamp()
                        }
                        updateAvanceClient(avanceClt, clientId.value)
                    }
                }
            }

            /// Generate facture in pdf
             if((totalTTC.value - montantRegle.value) < 0 ) {
                let reglement = {
                    totalTTC : totalTTC.value.toString(),
                    montantRegle: montantRegle.value.toString(),
                    avance : (totalTTC.value - montantRegle.value)*-1,
                    modeReglement : modeReglement.value,
                    client: clientNom.value ? clientNom.value  : "Client divers",
                    gerant: auth.currentUser.displayName
                }
                makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})

             }else if(reste() >= 0 ) {
                 let reglement = {
                    totalTTC : totalTTC.value.toString(),
                    montantRegle: montantRegle.value.toString() ? montantRegle.value.toString() : avance.value.montantAvance,
                    restant : reste(),
                    modeReglement : modeReglement.value,
                    client: clientNom.value ? clientNom.value  : "Client divers",
                    gerant: auth.currentUser.displayName
                }
                // console.log(reglement)
                makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})
             }
            /// End of Generate facture in pdf

            if(!createError.value) {
                alert("Vente Enregistrer avec succès ! ")
                designation.value=""
                id.value=""
                pvu.value=""
                qtecmd.value=1
                codeFamille.value=""
                montantRegle.value =""
                commandes.value.splice(0, commandes.value.length)
                avance.value=null


            }

        }
        const goBack = () => {
            router.back()
        }

        return {
            dateDuJour,
            changedClient,
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
            totalTTC,
            totalQte,
            totalPVU,
            montantRegle,
            hideModal,
            addCommande,
            removeCommande,
            commandes,
            createError,
            goBack,
            selectedClient,
            modeReglement,
            formatedNumber,
            numberFormatter,
            simpleNumberFormatter,
            avance,
            reste,

        }
  }

}
</script>

<style>

</style>
