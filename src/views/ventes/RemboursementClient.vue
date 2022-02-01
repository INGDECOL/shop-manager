<template>
      <div class="mx-auto " @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-center -mr-5  ml-auto">



                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <p class="mt-0 font-bold text-xl">
                Remboursement de Dette
            </p>
            <!-- INFO DATE Vendeur CLIENT -->
            <div class="flex justify-center items-center border rounded-md py-1.5 mb-1">
              <!-- Date du jour -->
              <!-- <span class="flex justify-between items-center bg-blue-100 text-blue-600 text-xs  mx-1 pr-2 py-0.5 rounded-md cursor-pointer  hover:bg-blue-200 md:font-bold md:mx-2 md:pr-2.5 md:text-sm"  title="Aujourd'hui">
                <span class="text-xs material-icons mr-1 md:text-sm">date_range</span>
                {{dateDuJour}}

              </span> -->
              <!-- Vendeur -->
              <!-- <span class="text-xs flex justify-between items-center bg-green-100 text-green-600 md:text-sm md:font-bold mr-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-green-200" title="Vendeur">
                <span class="material-icons mr-1">people</span>
                {{vendeur.displayName}}

              </span> -->
              <!-- Boutique -->
              <!-- <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" md:font-bold md:text-sm text-xs mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div> -->
              <!-- CLIENT -->
              <div class="mr-2 pr-2.5 ">
                  <div name="magasin"   class="font-bold cursor-pointer p-2"  title="Client" >
                      <option v-if="document" class="font-bold">{{document.nom + " " + document.prenom + " " + document.contact}}</option>
                  </div>
              </div>
            </div>
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
                <!-- Total de la facture -->
                <div class="flex justify-center " :class="{'flex justify-between gap-2': (avance)}">
                    <!-- <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base md:font-bold ml-8  rounded-md cursor-pointer hover:bg-green-200" v-if="avance">
                       <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4"> Avance </span>
                        <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4">{{formatedNumber( montantRegle ? (avance.montantAvance - montantRegle)>=0 ? (avance.montantAvance - montantRegle): 0  : avance.montantAvance) }}</span>
                    </span> -->
                    <span class="flex justify-center gap-4 bg-red-300 text-gray-600 md:text-base md:font-bold mr-8  rounded-md cursor-pointer hover:bg-green-200">
                       <span class="mx-1 my-2 font-bold md:mx-3 md:my-4"> Total Dettes</span>
                        <span class="mx-1 my-2 font-semibold md:mx-3 md:my-4">{{formatedNumber( totalTTC ? (totalTTC - montantRegle  ) > 0 ? (totalTTC - montantRegle) :0  : 0) }}</span>
                    </span>
                </div>
                <div class="produit  md:flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full" id="cmd">
                        <!-- Mode reglement et validation -->
                        <div class="border m-1">
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total TTC </label>
                                <input type="text" name="montanttotalttc" id="montanttotalttc" class="h-1" v-model="totalTTC" disabled>
                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3 text-blue-700">
                                <label class="w-1/2">Total Reçu </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="h-1.5 font-bold" v-model="montantRegle">

                            </div>
                        </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Enregistrer</button>
                        <p class="error">{{ createError }}</p>
                        <!-- Montant restant ou Montant à rendre -->
                        <div class="flex justify-center ">
                            <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : (totalTTC -  (montantRegle.value + avance ? avance.montantAvance : 0))>0 }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalTTC - montantRegle)>=0 ? "Reste dû " : "Avance" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{formatedNumber(montantRegle ? (reste()) :0) }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import createDocument from '../../controllers/createDocument'
import getDocument from '../../controllers/getDocument'
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
        const commandes = ref([])
        const clientVenteId = ref('')
        const clientId = ref('')
        const clientNom = ref('')
        const contact = ref('')
        const totalTTC = ref('')
        const montantRegle = ref('')
        const facture = ref()
        const vendeur = ref(getAuth().currentUser)
        const soldeClients = ref([])
        const oldDette = ref()
        const router = useRouter()
        const route = useRoute()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }

        const { receptionError,stock, getStock, updateStock } = receptionArticles()
        const { setAvanceClient, updateAvanceClient, getAvance, avance} = avancesClient()
        const {  document, load } = getDocument()
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
                    reste = totalTTC.value - (Number(montantRegle.value) + avance.value.montantAvance)
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
        //   document.querySelector(" .searchList").classList.toggle("active")
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
                // document.querySelector(".create").classList.toggle("open")
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
        watch(soldeClients, async()=>{
            if(soldeClients.value =='') {
                return
            }
            // console.log("watch :",soldeClients.value, document.value.id)
             getTotal()
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


        onMounted( async () => {
            // getFamilles()
            if(route.params.id) {
                await getFacture(route.params.id)
                await load("clients", facture.value.clientId)
                await getBoutiques()
                await getArticles()
                await getClients()
                await getSolde()
                boutiqueVente.value = facture.value.boutiqueId
                clientId.value = facture.value.clientId
                // console.log("boutiquevente : ", facture.value)
                // retrieveCommande(facture.value.articles)

            }

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
                //console.log("snap vente", snap.docs)
                soldeClients.value = snap.docs.map(doc =>{
                    //doc.data().createdAt = doc.data().createdAt.seconds
                    return {...doc.data(), id : doc.id}
                })
                // console.log("getSolde : ", soldeClients.value)
            })
        }

        const getTotal = () => {
            totalTTC.value =0
            soldeClients.value.map(solde => {
               if(solde.clientId === document.value.id) {
                //    console.log("total : ", solde.clientId, document.value.id, solde.montantDette, solde.boutiqueVente)
                   totalTTC.value += solde.montantDette
               }
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
                        clientId: clientId.value ? clientId.value : "CltDiv",
                        factureId: factureId,
                        montantDette: Number(totalTTC.value - montantRegle.value),
                        boutiqueVente: boutiqueVente.value,
                        createdAt: serverTimestamp()
                    }
                    console.log("Data to send : ", dette)

                    insert("dettes", dette, oldDette.value.id)

                }else if(( totalTTC.value -montantRegle.value )< 0 ) {
                     let avanceClt = {
                    clientId: clientId.value ? clientId.value : "CltDiv",
                    montantAvance: Number(totalTTC.value - montantRegle.value)*-1,
                    boutiqueVente: boutiqueVente.value,
                    createdAt: serverTimestamp()
                }
                setAvanceClient(avanceClt, clientId.value)
                }else {
                    destroy("dettes", oldDette.value.id)
                }
                if(!setError.value) {
                    if( (totalTTC.value - montantRegle.value) > 0 ) {
                        let restant = (totalTTC.value - montantRegle.value)
                        // console.log("restant ", restant)
                        alert("Remboursemente effectué avec succès, \n mais le client doit toujours " + formatedNumber(restant))
                    }else if(  (totalTTC.value - montantRegle.value) < 0) {
                         let restant = (totalTTC.value - montantRegle.value) * -1
                        // console.log("restant ", restant)
                        alert("Remboursemente effectué avec succès avec une avance de  " + formatedNumber(restant))
                    }else alert("Remboursement effectué avec succès ! ")

                }
                router.push({ name: 'CompteClient', params: { token: auth.currentUser.accessToken}})
                return
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
                // makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})

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
                // makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})
             }
            /// End of Generate facture in pdf
        }
        const goBack = () => {
            router.back()
        }

        return {
            dateDuJour,
            document,
            vendeur,
            showPop,
            searchQuery,
            handleSubmit,
            id,
            designation,
            clientVenteId,
            totalTTC,
            montantRegle,
            hideModal,
            commandes,
            createError,
            goBack,
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
