<template>
    <div class="ml-auto mr-auto mt-8" @click="hideModal">
        <div class="rounded-xl  border border-transparent bg-white p-7 my-10 mx-auto shadow-lg text-center active">
            <h2 class="font-bold m-2 text-base">GRAND LIVRE DES COMPTES GLOBAUX</h2>
            <form class="register" @submit.prevent="handleSignUp">
                <!-- <h2 class="font-bold m-2 text-base text-center text-green-400">
                    En cours de conception reéssayer plus tard !!!
                </h2> -->
                <div class="flex justify-between gap-2 -mt-4 mb-2">
                    <div class="flex justify-between items-center gap-2">
                        <label for="">Du</label>
                        <input type="date" name="dateDebut" id="dateDebut" v-model="dateDebut">
                        </div>
                        <div class="flex justify-between items-center gap-2 mr-1">
                        <label for="">Au</label>
                        <input type="date" name="dateFin" id="dateFin" v-model="dateFin" @change="getBalanceByDate">
                    </div>
                </div>

                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Fournisseurs : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(debitFournisseur ? debitFournisseur : 0)}}</span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Masse Salariale : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(masseSalariale ? masseSalariale : 0)}} </span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Depenses : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(totalDepense ? totalDepense : 0)}} </span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Clients : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(debitClient ? debitClient : 0)}} </span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items- gap-2">
                    <span>Caisse : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(debitCaisse ? debitCaisse : 0)}}  </span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Achat Marchandises : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(debitAchatMarchandise ? debitAchatMarchandise : 0)}}</span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Vente Marchandises : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(creditVenteMarchandise ? creditVenteMarchandise : 0)}} </span>
                </h2>
            </form>
            <button class="bg-indigo-400  hover:bg-indigo-300 hover:text-gray-600" @click="makePDF">Imprimer le rapport</button>
        </div>
        <table class="table-auto  bg-white divider-y divide-gray-400" id="balance" hidden>
            <thead class="bg-gray-800 text-white" >
                <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm " rowspan="2" >N° Compte</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm" rowspan="2">Intitulé compte</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm" colspan="2">
                        Mouvements
                    </th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm" colspan="2">Solde Cumulé</th>
                </tr>
                <tr >
                    <th class="text-center font-semibold text-xs" >
                        Débit
                    </th>
                    <th class="text-center font-semibold text-xs" >
                        Crédit
                    </th>
                    <th class="text-center font-semibold text-xs" >
                        Débit
                    </th>
                    <th class="text-center font-semibold text-xs" >
                        Crédit
                    </th>
                </tr>
            </thead>
            <tbody class="text-gray-700">
                <!-- Fournisseurs -->
                <tr class="border-b border-gray-400 max-h-2">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">4011</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Fournisseurs </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(debitFournisseur)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(creditFournisseur)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> {{ (creditFournisseur - debitFournisseur) < 0 ? simpleNumberFormatter.format(creditFournisseur - debitFournisseur) : ""}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (creditFournisseur - debitFournisseur) > 0 ? simpleNumberFormatter.format(creditFournisseur - debitFournisseur) : ""}} </td>
                </tr>
                <!-- Clients -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">4111</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Clients </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(debitClient)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(creditClient)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (creditClient - debitClient) < 0 ?simpleNumberFormatter.format(creditClient - debitClient) : ""}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (creditClient - debitClient) > 0 ?simpleNumberFormatter.format(creditClient - debitClient) : ""}} </td>
                </tr>
                <!-- Salaire personnel -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">661</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Renumérations </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(salaireTotal)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(masseSalariale)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> {{ (masseSalariale - salaireTotal ) < 0 ? simpleNumberFormatter.format(masseSalariale - salaireTotal) : ""}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (masseSalariale - salaireTotal ) > 0 ? simpleNumberFormatter.format(masseSalariale - salaireTotal) : ""}} </td>
                </tr>
                <!-- Salaire personnel -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">6328</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Frais divers </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(totalDepense)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> {{ (totalDepense - 0 ) < 0 ? simpleNumberFormatter.format(totalDepense - 0) : ""}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (totalDepense - 0 ) > 0 ? simpleNumberFormatter.format(totalDepense - 0) : ""}} </td>
                </tr>
                <!-- Caisse -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">571</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Caisse </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(debitCaisse)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(creditCaisse)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ (creditCaisse - debitCaisse ) < 0 ? simpleNumberFormatter.format(creditCaisse - debitCaisse ) : ""}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> {{ (creditCaisse - debitCaisse ) > 0 ? simpleNumberFormatter.format(creditCaisse - debitCaisse ) : ""}} </td>
                </tr>
                <!-- Achat Marchandises -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">6011</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Achat Marchandises </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(debitAchatMarchandise)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(debitAchatMarchandise)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> </td>
                </tr>
                <!-- Vente Marchandises -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">7011</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> Vente Marchandises </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(creditVenteMarchandise)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"></td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(creditVenteMarchandise)}} </td>
                </tr>
                <!-- Stock Marchandises -->
                <tr class="border-b border-gray-400 max-h-2 striped">
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">311</td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">Stock Marchandises </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"> </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(totalPAU)}} </td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase"></td>
                    <td class="text-left text-xs py-3 px-4 font-semibold uppercase">{{ simpleNumberFormatter.format(totalPAU)}} </td>
                </tr>

            </tbody>
                <tfoot>
                    <!-- Compte gestion -->
                    <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="2">Totaux comptes de gestion</td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(totalDebit)}} </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(totalCredit)}}</td>
                        <!-- <td class=" py-3 px-4 text-sm  font-bold uppercase" > </td> -->
                        <td class=" py-3 px-4 text-sm  text-center font-bold uppercase" colspan="2">{{ simpleNumberFormatter.format(totalCredit - totalDebit)}}</td>
                    </tr>
                    <!-- Compte bilan -->
                    <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="2">Totaux comptes de bilan</td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format( creditCaisse)}} </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(creditFournisseur + masseSalariale + totalDepense )}}</td>
                        <td class=" py-3 px-4 text-sm text-center  font-bold uppercase" colspan="2">{{ simpleNumberFormatter.format(creditCaisse - (creditFournisseur + masseSalariale + totalDepense ))}} </td>
                        <!-- <td class=" py-3 px-4 text-sm  font-bold uppercase" ></td> -->
                    </tr>

                    <!-- Totaux balance -->
                    <!-- <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="2">Totaux de la balance</td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(340075000)}} </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ simpleNumberFormatter.format(340075000)}}</td>
                        <td class=" py-3 px-4 text-sm  font-bold uppercase" > </td>
                        <td class=" py-3 px-4 text-sm  font-bold uppercase" ></td>
                    </tr> -->
                </tfoot>

        </table>
        <!-- <div v-if="listeArticles">
            <ul>
                <li v-for="article in listeArticles" :key="article.id">{{ article.designation + " ==> " + article.pau + " ==> " + article.qte}}</li>
            </ul>
        </div> -->

    </div>

</template>

<script>
import { ref } from '@vue/reactivity'
import genererPDF from '../../controllers/genererPDF'
import getDocuments from '../../controllers/getDocuments'
import { onMounted, watch } from '@vue/runtime-core'
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'
import { auth, db } from '../../firebase/config'
import receptionArticles from '../../controllers/receptionArticles'
export default {
    setup () {
        const debitFournisseur = ref("") // cmd total
        const creditFournisseur = ref(0) // cmd - dette
        const debitClient = ref(0) // cmd total
        const creditClient = ref(0) // cmd - dette
        const debitCaisse = ref(0) // vente total
        const creditCaisse = ref(0) // achat + salaire +
        const debitAchatMarchandise = ref(0)
        const creditVenteMarchandise = ref(0)
        const masseSalariale = ref(0)
        const salaireTotal = ref(0)
        const dateDebut = ref("01-01-" + new Date().getFullYear())
        const dateFin = ref("31-12-" + new Date().getFullYear())
        const listeCommandeFournisseurs = ref([])
        const listeDetteFournisseurs = ref([])
        const listeVentes = ref([])
        const listeDetteClients = ref([])
        const listeDepenses = ref([])
        const listeBulletins = ref([])
        const listeSalaires = ref([])
        const listeBoutiques = ref(null)
        const listeArticles = ref(null)
        const totalPAU = ref("")
        const totalDepense = ref(0)
        const totalDebit = ref(0)
        const totalCredit = ref(0)


        const { makeRapport } = genererPDF()
        const { receptionError,stock, getStock, reception, updateStock } = receptionArticles()

        const numberFormatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'GNF',

        })
        const simpleNumberFormatter = new Intl.NumberFormat('de-DE', {
            // style: 'currency',
            // currency: 'GNF',

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
        const getDepenses = async () => {
            const docRef = collection(db, "depenses")
            const res = onSnapshot(docRef, (snap)=>{
                listeDepenses.value = snap.docs.map(doc => {
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

        const getCommandeFournisseurs = async () => {
            const docRef =  collection(db, "commandeFournisseurs")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeCommandeFournisseurs.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
                })
            })
        }
        const getVenteClients = async () => {
            const docRef =  collection(db, "ventes")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeVentes.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
                })
            })
        }
        const getBulletins = async () => {
            const docRef =  collection(db, "bulletins")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeBulletins.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
                })
            })
        }
        const getSalaire = async () => {
            const docRef =  collection(db, "salaires")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeSalaires.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
                })
            })
        }
        const getDetteClients = async () =>{
            const docRef =  collection(db, "dettes")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                // console.log("snap vente", snap.docs)
                listeDetteClients.value = snap.docs.map(doc =>{
                    //doc.data().createdAt = doc.data().createdAt.seconds
                    return {...doc.data(), id : doc.id}
                })
            // console.log("solde : ", listeDettes.value)
            })
        }
        const getDetteFournisseurs = async () =>{
            const docRef =  collection(db, "detteFournisseurs")
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                // console.log("snap vente", snap.docs)
                listeDetteFournisseurs.value = snap.docs.map(doc =>{
                    //doc.data().createdAt = doc.data().createdAt.seconds
                    return {...doc.data(), id : doc.id}
                })
            // console.log("solde : ", listeDettes.value)
            })
        }

        const pauTotal = () => {
            let total =0
            console.log("count : ", listeArticles.value.length)
            listeArticles.value.map(article=>{
                total += (article.pau * article.qte ? article.qte : 0)
            })
            // console.log("total : ", total)
            return total
        }

        const getResultatTotal = () => {
            // console.log("tota : ", totalPAU.value)
        }


        watch(listeCommandeFournisseurs, ()=>{
            // console.log("chg")
            debitFournisseur.value = 0
            // debitAchatMarchandise.value = 0
            listeCommandeFournisseurs.value.map(cmd => {
                debitFournisseur.value += cmd.payer

            })
        })

        watch(listeBoutiques, async()=>{
            if(listeBoutiques.value =='') {
                return
            }
            listeBoutiques.value.map(async boutique => {
                await getStock(boutique.id)
                if(stock.value){
                    listeArticles.value.map(article => {
                        article.qte = article.qte ? article.qte + bringStock(article.id) : bringStock(article.id)
                    })
                }
                totalPAU.value =0
                listeArticles.value.map(article => {
                    totalPAU.value += article.qte * article.pau
                })
                // console.log("total pau : => ", totalPAU.value, "caisse : =>", creditCaisse.value, "creanc clt : =>",(creditClient.value - debitClient.value), "credit fss  : => ", (creditFournisseur.value - debitFournisseur.value), "salaire  : =>", masseSalariale.value)
                totalCredit.value = (totalPAU.value + creditCaisse.value + (creditClient.value - debitClient.value))
                // console.log("sal : ", masseSalariale.value)
                totalDebit.value = ((debitFournisseur.value - creditFournisseur.value) + masseSalariale.value + totalDepense.value)

            })


        })

        // creditClient & creditVenteMarchandise
        watch(listeVentes, ()=>{
            // console.log("chg")
            debitClient.value = 0
            creditClient.value = 0
            creditVenteMarchandise.value = 0
            listeVentes.value.map(vte => {
                creditClient.value += vte.payer
                // debitCaisse.value += vte.payer
                creditVenteMarchandise.value += vte.payer
            })
            // console.log("credit client : ", creditClient.value)
        })

        watch(listeBulletins, ()=>{
            masseSalariale.value = 0
            listeBulletins.value.map(bulletin => {
                // console.log("sal : ", bulletin)
                masseSalariale.value += (bulletin.montantNet + bulletin.antecedant)
            })
        })

        watch(listeDetteFournisseurs, () => {
            creditFournisseur.value = 0
            let totalDette = 0
            debitCaisse.value = 0
            listeDetteFournisseurs.value.map(dettefss => {
                totalDette += dettefss.montantDette

            })
            creditFournisseur.value = debitFournisseur.value - totalDette
            debitAchatMarchandise.value = debitFournisseur.value - totalDette
            debitCaisse.value = (debitFournisseur.value - totalDette) + masseSalariale.value
            getResultatTotal()
            // console.log("tot pau : ", numberFormatter.format(totalPAU.value))
        })

        watch(listeDetteClients, () => {
            // creditClient.value = 0
            debitCaisse.value = 0
            let totalDette = 0
            listeDetteClients.value.map(detteclt => {
                totalDette += detteclt.montantDette
            })
            debitClient.value = creditClient.value - totalDette
            creditCaisse.value = creditClient.value - totalDette
            //  console.log("deb clt : ", numberFormatter.format(debitClient.value), totalDette)
        })

        watch(listeSalaires, () => {
            // console.log("lst sal :")
            listeSalaires.value.map(salaire => {
                salaireTotal.value += (salaire.indemnites + salaire.salaireBase)
            })
        })

        watch(listeDepenses, ()=> {
            listeDepenses.value.map( depense => {
                totalDepense.value += depense.montantDepense
            })
        })
        const getBalanceByDate = () => {

        }

        onMounted( async()=> {
            await getBoutiques()
            await getArticles()
            await getCommandeFournisseurs()
            await getVenteClients()
            await getBulletins()
            await getSalaire()
            await getDetteClients()
            await getDetteFournisseurs()
            await getDepenses()

        })

        const makePDF = () => {
        /// Generate facture in pdf
        let dateDe= dateDebut.value
        let dateA = dateFin.value
        let options = {
            // totalTTC : totalTTC.value.toString(),
            dateDe: dateDe,
            dateA: dateA,
            // boutique: boutiqueVente.value,
            gerant: auth.currentUser.displayName
        }
        console.log("date de : ", dateDebut.value)

        makeRapport({title : 'BALANCE DES COMPTES  ' , orientation : "l", format : "a4", id : 'balance', option: options})
            /// End of Generate facture in pdf
    }


        return {
            getBalanceByDate,
            simpleNumberFormatter,
            makePDF,
            dateDebut,
            dateFin,
            debitFournisseur,
            creditFournisseur,
            debitClient,
            creditClient,
            debitCaisse,
            creditCaisse,
            debitAchatMarchandise,
            creditVenteMarchandise,
            masseSalariale,
            listeArticles,
            totalPAU,
            salaireTotal,
            totalDebit,
            totalCredit,
            totalDepense,

        }

    }

}
</script>

<style>

</style>
