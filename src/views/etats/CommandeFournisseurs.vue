<template>
      <div class="mx-auto w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <!-- INFO DATE Vendeur CLIENT -->
            <div class="flex justify-between items-center border rounded-md py-1.5 ">
              <!-- Date du jour -->
              <span class="flex justify-between items-center bg-blue-100 text-blue-600 text-sm font-bold mx-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-blue-200" title="Aujourd'hui">
                <span class="material-icons mr-1">date_range</span>
                {{dateDuJour}}

              </span>
              <!-- Acheteur -->
              <span class="flex justify-between items-center bg-green-100 text-green-600 text-sm font-bold mr-2 pr-2.5 py-0.5 rounded-md cursor-pointer hover:bg-green-200" title="Acheteur">
                <span class="material-icons mr-1">people</span>
                {{vendeur.displayName}}

              </span>
              <!-- Boutique -->
              <!-- <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div> -->
              <!-- fournisseurs -->
              <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="fournisseurCmdId" class=" font-bold  cursor-pointer"  title="Fournisseur" required>
                      <option value="">Selectionner le fournisseur</option>
                      <option value="FssDiv">FssDiv</option>
                      <option v-for="fournisseur in filteredFournisseurs" :key="fournisseur.id" :value="fournisseur.nom +'_'+fournisseur.prenom" @click="selectedFournisseur(fournisseur)">{{fournisseur.nom +" "+fournisseur.prenom }}</option>
                  </select>
              </div>
            </div>
            <div class="error">{{ receptionError }}</div>
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
                <!-- Total de la facture -->
                <div class="flex justify-between ">
                    <div class="ml-5">
                        <p class="font-bold text-2xl ">{{ routeid ? "Remboursement facture": "Etablir une commande" }}</p>
                    </div>
                    <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold mr-8  rounded-md cursor-pointer hover:bg-green-200">
                       <span class="mx-3 my-6"> Montant HT</span>
                        <span class="mx-3 my-6">{{ totalHT ? (totalHT).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 +"  GNF "}}</span>
                    </span>
                </div>
                <div class="produit  flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote gauche -->
                  <div class="rounded border mb-2 px-1 mx-1 w-full ">
                    <div class="flex justify-center items-center">
                        <!-- Rechercher -->
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
                        <input type="text" name="pvu"  placeholder="Prix Unitaire"  v-model="pau">
                        <input type="number" name="qtecmd" id="qtecmd" min="1" v-model="qtecmd">
                    </div>
                    <div class="mt-5 mb-2">
                    <span class=" font-bold bg-yellow-400 rounded-lg p-2.5 cursor-pointer hover:text-gray-600 hover:bg-yellow-300" @click="addCommande">Valider</span>
                    </div>
                  </div>
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full">
                        <div class="border m-1 p-1 max-h-48 overflow-y-scroll overflow-x-scroll">
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
                                        <td class="text-left py-3 px-4 font-semibold uppercase">
                                            <span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne" @click="removeCommande(cmd)">x</span>
                                        </td>
                                        <td class="text-left py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.designation }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pau}}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pau * cmd.qtecmd }}</td>

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
                                <label class="w-1/2">Montant Total HT </label>
                                <input type="text" name="montanttotalttc" id="montanttotalttc" class="h-1" v-model="totalHT" disabled>
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
                            <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : (totalHT - montantRegle)>0 }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalHT - montantRegle)>0 ? "Reste dû " : "Monnaie à rendre" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{montantRegle ? (totalHT - montantRegle).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 +"  GNF "}}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Facture à imprimer -->
                <div class="border m-1 p-1 max-h-48 overflow-y-scroll overflow-x-scroll">
                    <table class="min-w-full bg-white divider-y divide-gray-400 " id="commande">
                        <thead class="bg-gray-800 text-white">
                                <tr>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Désignation</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-xs">P. Unitaire</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-xs">Qté</th>
                                    <th class="text-center py-3 px-4 uppercase font-semibold text-xs">Total</th>
                                </tr>
                        </thead>
                        <tbody class="text-gray-700 ">
                            <tr class="border-b border-gray-400 " :class="{ striped : n % 2 ===0}" v-for="(cmd,n) in commandes" :key="cmd.id">
                                <td class="text-left py-3 px-4 font-semibold uppercase">
                                    <span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne" @click="removeCommande(cmd)">{{ n+1}}</span>
                                </td>
                                <td class="text-left py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.designation }}</td>
                                <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pau}}</td>
                                <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pau * cmd.qtecmd }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="border-b border-gray-400 bg-gray-300">
                                <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="2">Totaux </td>
                                <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPAU)}} </td>
                                <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td>
                                <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalHT)}} </td>
                            </tr>
                        </tfoot>
                    </table>
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
import setDocument from '../../controllers/setDocument'
import destroyDocument from '../../controllers/destroyDocument'
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
import { onMounted, watch } from '@vue/runtime-core'
import { db, auth } from '../../firebase/config'
import { getAuth } from '@firebase/auth'
import receptionArticles from '../../controllers/receptionArticles'
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
        const  dateDuJour = new Date().toLocaleDateString(undefined, options)

        const { createError, create } = createDocument()
        const { setError, insert } = setDocument()
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


        const showPop = () =>{
          document.querySelector(" .searchList").classList.toggle("active")
        }
        const selectedFournisseur = (fss) => {
            fournisseurId.value = fss.id
             fournisseurNom.value = fss.nom +" " + fss.prenom + " " + fss.contact
            // console.log("fss : ", fournisseurId.value)

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

        // const getBoutiques = async () => {
        //   const docRef = collection(db, "boutiques")
        //   const res = onSnapshot(docRef, (snap)=>{
        //       listeBoutiques.value = snap.docs.map(doc => {
        //           return {...doc.data(), id: doc.id}
        //       })
        //   })

        // }

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
            await getSolde()

            if(route.params.id) {
                routeid.value = route.params.id
                await getFacture(route.params.id)
                retrieveCommande(facture.value.articles)
                fournisseurCmdId.value = facture.value.fournisseurId
                fournisseurId.value = facture.value.fournisseurId
                console.log("idsss : ", fournisseurCmdId.value, fournisseurId.value)
                document.querySelector("#magasin").removeAttribute("required")

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
                console.log("Data to send : ", oldDette.value.id)
                // Save dette
                if((totalHT.value - montantRegle.value) > 0 ) {
                    let dette = {
                        fournisseurId: fournisseurCmdId.value ? fournisseurId.value : "FssDiv",
                        factureId: factureId,
                        montantDette: Number(totalHT.value - montantRegle.value),
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
            let day = new Date().getDate()
            let month = new Date().getMonth() < 10 ? new Date().getMonth() < 1 ? "01": "0" + new Date().getMonth() : new Date().getMonth()
            let year = new Date().getFullYear()
            const factureId = day + month + year + new Date().getHours() + new Date().getMinutes() + "010" + new Date().getSeconds()

            //verification fournisseur enregistrer
            if(fournisseurCmdId.value =="FssDiv" || fournisseurCmdId.value =='') {
                if((totalHT.value - montantRegle.value) > 0 ) {
                    alert("Le montant Total de la facture est supérieur au montant règlé, or les opérations de reglèment en dette ne sont pas autorisé avec ce fournisseur. \n Pensez à Enregistrer cet fournisseur s'il est confiant !")
                    return
                }
            }
             createError.value = null
            //  Save commande
            commandes.value.forEach(cmdfss => {
                let commande = {
                    articleId: cmdfss.id,
                    article: cmdfss.designation,
                    pau: Number(cmdfss.pau),
                    qtecmd: Number(cmdfss.qtecmd),
                    payer: Number(cmdfss.montantTotal),
                    fournisseurId: fournisseurId.value ? fournisseurId.value: "FssDiv",
                    acheteur: vendeur.value.displayName,
                    factureId: factureId,
                    reste: 0,
                    createdAt: serverTimestamp()
                }
                create("commandeFournisseurs", commande)
                 if(createError.value) {
                     alert("Impossible d'enregistrer cette commande !")
                     return
                 }
            })
            // Save facture
            let articleFacture = commandes.value.map(article => {
                let data = {
                    id: article.id,
                    article: article.designation,
                    pau : article.pau,
                    qtecmd: article.qtecmd
                }
                return data
            })

            let facture = {
                id: factureId,
                fournisseurId: fournisseurCmdId.value ? fournisseurId.value : "FssDiv",
                articles: articleFacture,
                createdAt: serverTimestamp()
            }
            insert("facturesFournisseurs", facture, facture.id)

            // Save dette
            if((totalHT.value - montantRegle.value) > 0 ) {
                let dette = {
                    fournisseurId: fournisseurCmdId.value ? fournisseurId.value : "FssDiv",
                    factureId: factureId,
                    montantDette: Number(totalHT.value - montantRegle.value),
                    createdAt: serverTimestamp()
                }
                create("detteFournisseurs", dette)
            }
             /// Generate facture in pdf
            let options = {
                totalHT : totalHT.value.toString(),
                montantRegle: montantRegle.value.toString(),
                restant : (totalHT.value - montantRegle.value),
                modeReglement : modeReglement.value,
                fournisseur: fournisseurNom.value ? fournisseurNom.value  : "Fournisseur divers",
                acheteur: auth.currentUser.displayName
            }

            makeCommande({title : 'Bon de Commande N° ' + factureId, orientation : "p", format : "a4",data : articleFacture, id : 'commande', option: options})
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
            dateDuJour,
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
            hideModal,
            addCommande,
            removeCommande,
            commandes,
            modeReglement,
            createError,
            goBack,
            selectedFournisseur,
            numberFormatter,

        }
  }

}
</script>

<style>

</style>
