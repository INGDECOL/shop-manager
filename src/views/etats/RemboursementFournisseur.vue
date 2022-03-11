<template>
      <div class="mx-auto " >
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-center -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>

            <div class=" justify-center items-center flex-col  gap-0.5 mt-0">
                <!-- Total de la facture -->
                <p class="mt-0 font-bold text-xl text-center uppercase">{{ routeid ? "Payement facture fournisseur": "Etablir une commande" }}</p>


                <div class="produit  md:flex justify-center  gap-0.5 m-0 shadow-none">

                    <div class="border rounded mb-2 px-1 mx-1 w-full">

                        <!-- Mode reglement et validation -->
                        <div class="border m-1">
                            <div class="mx-3 content-center" v-if="document">
                                <label class="z-10 text-left text-xs">Fournisseur</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 text-gray-500" :value="document.nom + ' ' + document.prenom " disabled>
                            </div>
                            <div class="mx-3" v-if="facture">
                                <label class="z-10 text-left text-xs">N° Facture</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 text-gray-500" :value=" facture.id " disabled>
                            </div>
                            <div class="mx-3 " >
                                <label class="z-10 text-left text-xs">Net à payer</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 text-gray-500" :value="formatedNumber(totalHT ? totalHT : 0 )" disabled>
                            </div>
                            <div class="mx-3" v-if="facture">
                                <label class="z-10 text-left text-xs">Total payé</label>
                                <input type="text" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 text-gray-500" :value="formatedNumber(facture ? (totalHT - facture.montantDette) : 0 )" disabled>
                            </div>

                            <div class="mx-3  text-blue-700">
                                <label class="z-10 text-left text-xs">Versement </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="-mt-3.5 border rounded h-9 font-bold  text-xl text-center  pt-2 " v-model="montantRegle">

                            </div>
                        </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Valider</button>
                        <p class="error">{{ createError }}</p>
                        <!-- Montant restant ou Montant à rendre -->
                        <div class="flex justify-center ">
                            <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : (totalHT -  montantRegle)>0 }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalHT - montantRegle)>=0 ? "Reste dû " : "Avance" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{formatedNumber(montantRegle ? (facture.montantDette - montantRegle) :0) }}</span>
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
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
import { onMounted, watch } from '@vue/runtime-core'
import { db, auth } from '../../firebase/config'
import { getAuth } from '@firebase/auth'
import receptionArticles from '../../controllers/receptionArticles'
import avancesFournisseur from '../../controllers/avanceFournisseurs'
import genererPDF from '../../controllers/genererPDF'

export default {
  setup () {
        const routeid = ref('')
        const id = ref('')
        const designation = ref('')
        const boutiqueVente = ref('')
        const listeBoutiques = ref(null)
        const listeFournisseurs = ref(null)
        const listeArticles = ref(null)
        const searchQuery = ref('')
        const pau = ref('')
        const pvu = ref('')
        const expiration = ref('')
        const codeFamille = ref('')
        const quantiteStock = ref('')
        const qtecmd = ref('')
        const commandes = ref([])
        const fournisseurCmdId = ref('')
        const fournisseurId = ref('')
        const fournisseurNom = ref('')
        const seuil = ref('')
        const totalHT = ref('')
        const totalQte = ref('')
        const totalPAU = ref('')
        const montantRegle = ref('')
        const modeReglement = ref('')
        const facture = ref()
        const vendeur = ref(getAuth().currentUser)
        const soldeFournisseurs = ref([])
        const oldDette = ref()
        const router = useRouter()
        const route = useRoute()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }

        const { receptionError,stock, getStock, updateStock } = receptionArticles()
        const { setAvanceFournisseur, updateAvanceFournisseur, getAvance, avance } = avancesFournisseur()
        const  dateDuJour = new Date().toLocaleDateString(undefined, options)

        const { createError, create } = createDocument()
        const { setError, insert } = setDocument()
        const { load, document } = getDocument()
        const { destroy, error} = destroyDocument()
        const { makeCommande } = genererPDF()

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
        // currency: 'GNF',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        })

        const reste = ()=>{
            let reste =0
            if(avance.value){
                reste = totalHT.value - (Number(montantRegle.value) )
            }else {
                reste = totalHT.value - Number(montantRegle.value)
            }
            return reste
        }

        const showPop = () =>{
          document.querySelector(" .searchList").classList.toggle("active")
        }
        const changedFournisseur = () => {
            let fss =  listeFournisseurs.value.filter((f)=>{
                return f.id == fournisseurCmdId.value.split("_")[0]
            })
            selectedFournisseur(fss[0])
        }
        const selectedFournisseur = (fss) => {
            fournisseurId.value = fss.id
            fournisseurNom.value = fss.nom +" " + fss.prenom + " " + fss.contact
            avance.value=null
           getAvance(fss.id)

        }

        const selectedArticle = (article) => {
            // if(!boutiqueVente.value) {
            //     alert("Veuillez Selectionner une boutique ! ")
            //     showPop()
            //     return
            // }
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
            const docRef = doc( db, "facturesFournisseurs", id)
            const res =  await getDoc(docRef)
            if(res.exists()){
                // console.log("REs data : ", res.data())
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
        const getFournisseurs = async () => {
            const docRef = collection(db, "fournisseurs")
            const res = onSnapshot(docRef, (snap)=>{
                listeFournisseurs.value = snap.docs.map(doc => {
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



        const filteredBoutiques = computed(()=>{
          return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
              return boutique.gerantBoutique.includes( auth.currentUser.email)
          })
        })

        const filteredFournisseurs = computed(()=>{
          return listeFournisseurs.value && listeFournisseurs.value.filter((FSS)=>{
              return listeFournisseurs.value
            //   return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          })
        })

        watch(boutiqueVente, async()=>{
            if(boutiqueVente.value =='') {
                return
            }
            await getStock(boutiqueVente.value)
        })

        watch(commandes.value, () => {
            // console.log("commande modified", commandes.value)
            totalHT.value = 0
             totalQte.value = 0
            totalPAU.value = 0
            commandes.value.map(cmd => {
                if(cmd){
                    totalHT.value += cmd.pau * cmd.qtecmd
                    totalQte.value += cmd.qtecmd
                    totalPAU.value += cmd.pau
                }
            })
            // console.log("Total TTC : ", (totalHT.value).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0}))
            //Si c'est un Remboursement
            if(route.params.id) {
                soldeFournisseurs.value.forEach(solde => {
                    if(solde.factureId == route.params.id) {
                        // console.log("Dette : ", solde.montantDette, totalHT.value)
                        if(totalHT.value > 0 ){
                            montantRegle.value = Number(totalHT.value ) - Number(solde.montantDette)

                        }else montantRegle.value = 0
                        oldDette.value = solde
                        // boutiqueVente.value = solde.boutiqueVente
                    }
                })
            }
        })

        watch(soldeFournisseurs, ()=> {
            if(soldeFournisseurs.value =='' ) return

            //console.log("watch :",soldeFournisseurs.value, document.value.id)
            //  getTotal()
             soldeFournisseurs.value.map(solde => {
                // console.log(solde.factureId, "=>", facture.value.id)
                if(solde.factureId == facture.value.id ) {
                    facture.value.montantDette = solde.montantDette
                    oldDette.value = solde
                }
            })
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
            // if(!route.params.id) {
            //     if(qtecmd.value > quantiteStock.value) {
            //         alert("La quantité demandée est supérieur au stock disponible !")
            //         return
            //     }
            // }
            let commande = {
                id : id.value,
                designation : designation.value,
                pau : Number(pau.value),
                qtecmd : Number(qtecmd.value),
                montantTotal: Number(qtecmd.value * pau.value),

                // stockRestant: Number(quantiteStock.value - qtecmd.value)

            }
            commandes.value.push(commande)
            // console.log("liste commande : ", commandes.value)
            designation.value=""
            id.value=""
            pau.value=""
            qtecmd.value=1
            codeFamille.value=""
            searchQuery.value=""

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
            // console.log("liste commande : ", commandes.value)
            // designation.value = ""
            // id.value = ""
            // pvu.value = ""
            // qtecmd.value = 1
            // codeFamille.value = ""

        }

        onMounted( async () => {
            getArticles()
            getFournisseurs()


            if(route.params.id) {
                routeid.value = route.params.id
                await getFacture(route.params.id)
                await load("fournisseurs", facture.value.fournisseurId)
                retrieveCommande(facture.value.articles)
                fournisseurCmdId.value = facture.value.fournisseurId
                fournisseurId.value = facture.value.fournisseurId
                await getSolde()
                // console.log("idsss : ", fournisseurCmdId.value, fournisseurId.value)
                // document.querySelector("#magasin").removeAttribute("required")

            }
            modeReglement.value="Espece"

        })

        const retrieveCommande = (articles) => {
            // console.log("articles length :", articles.designation)
            articles.forEach( article => {
                // console.log("retrieve : ", article.article)
                 id.value = article.id
                designation.value = article.article
                pau.value = Number(article.pau)
                qtecmd.value = Number(article.qtecmd)
                // montantTotal: Number(qtecmd.value * pvu.value),
                addCommande()
            })
            fournisseurCmdId.value = facture.value.fournisseurId
            fournisseurId.value = facture.value.fournisseurId

            // console.log("client  : ", fournisseurCmdId.value)
        }

        const getSolde = async () =>{
            const docRef =  collection(db, "detteFournisseurs")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                // console.log("snap vente", snap.docs)
                soldeFournisseurs.value = snap.docs.map(doc =>{
                    //doc.data().createdAt = doc.data().createdAt.seconds
                    return {...doc.data(), id : doc.id}
                })
            // console.log("solde : ", soldeFournisseurs.value)
            })
        }

        const handleSubmit = async () => {
            // Remboursement
            if(route.params.id) {
                const factureId = route.params.id
                // console.log("Data to send : ", oldDette.value.id)
                // Save dette
                if((totalHT.value - montantRegle.value) > 0 ) {
                    let dette = {
                        fournisseurId: fournisseurCmdId.value ? fournisseurId.value : "FssDiv",
                        factureId: factureId,
                        montantDette: Number(facture.value.montantDette - montantRegle.value),
                        createdAt: serverTimestamp()
                    }
                    insert("detteFournisseurs", dette, oldDette.value.id)
                    // console.log("Data to send : ", dette, oldDette.value.id)

                }else {
                    destroy("detteFournisseurs", oldDette.value.id)
                }
                if(!setError.value) {
                    if( (totalHT.value - montantRegle.value) > 0 ) {
                        let restant = (totalHT.value - montantRegle.value)
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
                    totalHT.value =0
                }
                router.push({ name: 'AdminCompteFournisseur', params: { token: auth.currentUser.accessToken}})
                return
            }

            // Nouvelle commande



             /// Generate facture in pdf
             if((totalHT.value - montantRegle.value) < 0 ) {
                let options = {
                    totalHT : totalHT.value.toString(),
                    montantRegle: montantRegle.value.toString(),
                    avance : (totalHT.value - montantRegle.value)*-1,
                    modeReglement : modeReglement.value,
                    fournisseur: fournisseurNom.value ? fournisseurNom.value  : "Fournisseur divers",
                    acheteur: auth.currentUser.displayName
                }

                // makeCommande({title : 'Bon de Commande N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: options})
             } else if(reste() >= 0 ) {
                let options = {
                    totalHT : totalHT.value.toString(),
                    montantRegle: montantRegle.value.toString(),
                    restant : reste(),
                    modeReglement : modeReglement.value,
                    fournisseur: fournisseurNom.value ? fournisseurNom.value  : "Fournisseur divers",
                    acheteur: auth.currentUser.displayName
                }

                // makeCommande({title : 'Bon de Commande N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: options})

             }
            /// End of Generate facture in pdf
            if(!createError.value) {
                alert("Commande Enregistrée avec succès ! ")
                designation.value=""
                id.value=""
                pvu.value=""
                pau.value=""
                qtecmd.value=1
                codeFamille.value=""
                montantRegle.value =""
                commandes.value.splice(0, commandes.value.length)
            }

        }
        const goBack = () => {
            router.back()
        }
        return {
            document,
            dateDuJour,
            changedFournisseur,
            receptionError,
            vendeur,
            showPop,
            selectedArticle,
            filteredArticles,
            boutiqueVente,
            filteredBoutiques,
            filteredFournisseurs,
            searchQuery,
            handleSubmit,
            id,
            routeid,
            designation,
            pau,
            pvu,
            codeFamille,
            fournisseurCmdId,
            expiration,
            seuil,
            quantiteStock,
            bringStock,
            qtecmd,
            totalHT,
            totalQte,
            totalPAU,
            montantRegle,
            commandes,
            modeReglement,
            createError,
            goBack,
            selectedFournisseur,
            numberFormatter,
            formatedNumber,
            avance,
            facture,
            reste,

        }
  }

}
</script>

<style>

</style>
