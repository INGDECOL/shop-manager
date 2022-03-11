<template>
      <div class="mx-auto " >
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-center -mr-5  ml-auto">
                <span name="closeBtn" id ="closeBtn" class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <p class="mt-0 font-bold text-xl text-center uppercase">
                Depôt au compte fournisseur
            </p>

            <div class=" justify-center items-center flex-col  gap-0.5 mt-0 ">

                <div class=" md:flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full" id="cmd">
                        <!-- Mode reglement et validation -->
                        <div class="border m-1">
                            <div class="mx-3 content-center" v-if="document">
                                <label class="z-10 text-left text-xs">Client</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 text-gray-500" :value="document.nom + ' ' + document.prenom " disabled>

                            </div>
                            <!-- <div class="mx-3">
                                <label class="z-10 text-left text-xs">N° Facture </label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center pt-2 text-gray-500" :value="factureId" disabled>

                            </div> -->
                            <div class="mx-3">
                                <label class="z-10 text-left text-xs">Montant en Avance</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center pt-2 text-gray-500" :value="formatedNumber( avance ? (avance.montantAvance )  : 0)" disabled>

                            </div>
                            <!-- <div class="mx-3">
                                <label class="z-10 text-left text-xs">Total payé</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center pt-2 text-gray-500" :value="formatedNumber( facture ? ( totalTTC -  facture.montantDette)  : 0)" disabled>

                            </div> -->
                            <div class="mx-3  text-blue-700">
                                <label class="z-10 text-left text-xs">Versement </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center pt-2" v-model="montantRegle">

                            </div>
                        </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Valider</button>
                        <p class="error">{{ createError }}</p>
                        <!-- Montant restant ou Montant à rendre -->
                        <div class="flex justify-center ">
                            <!-- <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : (totalTTC -  (montantRegle.value + avance ? avance.montantAvance : 0))>0 }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalTTC - montantRegle)>=0 ? "Reste dû " : "Avance" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{formatedNumber(montantRegle ? (facture.montantDette - montantRegle) :0) }}</span>
                            </span> -->
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
import avancesFournisseur from '../../controllers/avanceFournisseurs'
import genererPDF from '../../controllers/genererPDF'
// import fontConv from '../../controllers/fontConverter'

export default {
  setup () {
        const id = ref('')
        const designation = ref('')
        const boutiqueVente = ref('')
        const factureId = ref("")
        const listeBoutiques = ref(null)
        const listeClients = ref(null)
        const listeArticles = ref(null)
        const searchQuery = ref('')
        const commandes = ref([])
        const clientVenteId = ref('')
        const fssId = ref('')
        const clientNom = ref('')
        const pvu = ref('')
        const qtecmd = ref('')
        const totalTTC = ref('')
        const totalPVU = ref('')
        const montantRegle = ref('')
        const facture = ref()
        const vendeur = ref(getAuth().currentUser)
        const soldeClients = ref([])
        const oldDette = ref()
        const router = useRouter()
        const route = useRoute()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const { setAvanceFournisseur, getAvance, avnc, avance } = avancesFournisseur()

        const { receptionError,stock, getStock, updateStock } = receptionArticles()
        const {  document, load } = getDocument()
        const  dateDuJour = new Date().toLocaleDateString(undefined, options)

        const { createError, create } = createDocument()
        const { setError, insert } = setDocument()
        const { destroy, error} = destroyDocument()

        const { makeFacture } = genererPDF()

        const formatedNumber = (strNumber) => {
            return strNumber ? strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0}) : 0
        }

        const numberFormatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'GNF',

        })
        const simpleNumberFormatter = new Intl.NumberFormat('de-DE', {

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
            router.back()
        }
        const getBoutiques = async () => {
          const docRef = collection(db, "boutiques")
          const res = onSnapshot(docRef, (snap)=>{
              listeBoutiques.value = snap.docs.map(doc => {
                  return {...doc.data(), id: doc.id}
              })
          })

        }


        watch(commandes.value, () => {
            // console.log("commande modified", commandes.value)
            totalTTC.value = 0
            // totalQte.value = 0
            totalPVU.value = 0
            commandes.value.map(cmd => {
                if(cmd){
                    totalTTC.value += cmd.pvu * cmd.qtecmd
                    // totalQte.value += cmd.qtecmd
                    totalPVU.value += cmd.pvu
                }
            })
            console.log("Total TTC : ", (totalTTC.value).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0}))


        })

        const addCommande = () => {
            if(route.params.id) {
                // console.log("route id")

                let commande = {
                    id : id.value,
                    designation : designation.value,
                    pvu : Number(pvu.value),
                    qtecmd : Number(qtecmd.value),
                    montantTotal: Number(qtecmd.value * pvu.value),
                    stockRestant: Number( qtecmd.value)

                }
                commandes.value.push(commande)
                // console.log("liste commande : ", commandes.value)
                designation.value=""
                id.value=""
                pvu.value=""
                // qtecmd.value=1
                // codeFamille.value=""
                // searchQuery.value = ''
            }
        }

        onMounted( async () => {
            // getFamilles()
            if(route.params.id) {
                await getAvance(route.params.id)
                factureId.value = route.params.id
                // await getFacture(route.params.id)
                await load("fournisseurs", route.params.id)
                // await getBoutiques()
                // await getArticles()
                // await getClients()
                // await getSolde()
                fssId.value = document.value.id
                // console.log("fssId : ", fssId.value)
                // boutiqueVente.value = facture.value.boutiqueId
                // fssId.value = facture.value.fssId
                // console.log("factId", facture.value.id)
                // retrieveCommande(facture.value.articles)

            }

        })

        const retrieveCommande = (articles) => {
            // console.log("articles length :", articles.designation)
            articles.forEach( article => {
                 console.log("retrieve : ", article)
                 id.value = article.id
                designation.value = article.article
                pvu.value = Number(article.pvu)
                qtecmd.value = Number(article.qtecmd)
                // montantTotal: Number(qtecmd.value * pvu.value),
                addCommande()
            })
            clientVenteId.value = facture.value.fssId
            fssId.value = facture.value.fssId

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
            // totalTTC.value =0
            soldeClients.value.map(solde => {
               if(solde.fssId === document.value.id) {
                    // console.log("total : ", solde.fssId, document.value.id, solde.id, solde.montantDette, solde.boutiqueVente)
                //    totalTTC.value += solde.montantDette
               }
            })
        }

        const handleSubmit = async () => {

            // Remboursement
            if(route.params.id) {
                const factureId = route.params.id
                if( isNaN(montantRegle.value)) {
                    alert("Saisie incorrect ! le montant versé doit être un nombre supérieur à Zéro (0)")
                    return
                }

                     let avanceFss = {
                        fournisseurId: fssId.value ? fssId.value : "FssDiv",
                        montantAvance: Number(totalTTC.value - montantRegle.value)*-1,
                        createdAt: serverTimestamp()
                    }
                    setAvanceFournisseur(avanceFss, fssId.value)
                    alert("Dépôt effectué avec succès ! ")


                router.push({ name: 'Fournisseurs', params: { token: auth.currentUser.accessToken}})
                }

            }
            /// Generate facture in pdf
            //  if((totalTTC.value - montantRegle.value) < 0 ) {
            //     let reglement = {
            //         totalTTC : totalTTC.value.toString(),
            //         montantRegle: montantRegle.value.toString(),
            //         avance : (totalTTC.value - montantRegle.value)*-1,
            //         modeReglement : modeReglement.value,
            //         client: clientNom.value ? clientNom.value  : "Client divers",
            //         gerant: auth.currentUser.displayName
            //     }
            //     // makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})

            //  }else if(reste() >= 0 ) {
            //      let reglement = {
            //         totalTTC : totalTTC.value.toString(),
            //         montantRegle: montantRegle.value.toString() ? montantRegle.value.toString() : avance.value.montantAvance,
            //         restant : reste(),
            //         modeReglement : modeReglement.value,
            //         client: clientNom.value ? clientNom.value  : "Client divers",
            //         gerant: auth.currentUser.displayName
            //     }
                // console.log(reglement)
                // makeFacture({title : 'Facture N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: reglement})

            /// End of Generate facture in pdf
        // }
        const goBack = () => {
            router.back()
        }

        return {
            dateDuJour,
            avance,
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
            facture,
            factureId,

        }
  }

}
</script>

<style>

</style>
