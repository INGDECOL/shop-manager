<template>
    <div class="ml-auto mr-auto mt-8" @click="hideModal">
        <div class="rounded-xl  border border-transparent bg-white p-7 my-10 mx-auto shadow-lg text-center active">
            <h2 class="font-bold m-2 text-base">RAPPORT GLOBAL DES TRANSACTIONS</h2>
            <form class="register" @submit.prevent="handleSignUp">
                <!-- <h2 class="font-bold m-2 text-base text-center text-green-400">
                    En cours de conception reéssayer plus tard !!!
                </h2> -->
                <!-- <div class="flex justify-between gap-2 -mt-4 mb-2">
                    <div class="flex justify-between items-center gap-2">
                        <label for="">Du</label>
                        <input type="date" name="dateDebut" id="dateDebut" v-model="dateDebut">
                        </div>
                        <div class="flex justify-between items-center gap-2 mr-1">
                        <label for="">Au</label>
                        <input type="date" name="dateFin" id="dateFin" v-model="dateFin" @change="getBalanceByDate">
                    </div>
                </div> -->

                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Total Versements : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(totalVersement ? totalVersement : 0)}}</span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Total Retrait : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(totalRetrait ? totalRetrait : 0)}} </span>
                </h2>
                <h2 class="border-b mx-2 flex justify-between items-center gap-2">
                    <span>Solde Actuel : </span>
                    <span class="font-bold">{{ simpleNumberFormatter.format(soldeActuel ? soldeActuel : 0)}} </span>
                </h2>

            </form>
            <button class="bg-indigo-400  hover:bg-indigo-300 hover:text-gray-600" >Imprimer le rapport</button>
        </div>

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
        const totalVersement = ref(0)
        const totalRetrait = ref(0)
        const soldeActuel = ref(0)
        const listeMouvements = ref([])
        const accountList = ref([])

        const dateDebut = ref("")
        const dateFin = ref("")
        const listeArticles = ref(null)

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



        const getSoldes = async () =>{
            const docRef =  collection(db, "mouvements")
            const q = query( docRef, orderBy("createdAt", "asc"))
            const res = onSnapshot(q, ( snap ) =>{
                // console.log("snap vente", snap.docs.length)
                listeMouvements.value = snap.docs.map(doc =>{
                    // console.log("data : ", doc.data())
                    return {...doc.data(), id : doc.id}
                })
            // console.log("solde : ", listeMouvements.value)
            })
        }

        const getSolde =  (id) =>{
            let versement=0, retrait =0, solde=0
            totalVersement.value = 0
            totalRetrait.value = 0
            soldeActuel.value = 0
            listeMouvements.value.map(mouvement => {
                if(mouvement.operation =="Versement") {
                    totalVersement.value += Number(mouvement.montant)
                    // console.log("versement : ", totalVersement.value)
                }else if(mouvement.operation =="Retrait") {
                    totalRetrait.value += mouvement.montant
                }
            })
            soldeActuel.value = totalVersement.value - totalRetrait.value
            // console.log("solde : ", versement, retrait)

        }

        watch(listeMouvements, ()=>{
            // console.log("chg", listeMouvements.value, listeMouvements.value !== "")
           if(listeMouvements.value ) {
                getSolde()
           }

        })


        onMounted( async()=> {
            await getSoldes()
        })

        const makePDF = () => {
            /// Generate facture in pdf
            let dateDe= dateDebut.value
            let dateA = dateFin.value
            let options = {
                // totalTTC : totalTTC.value.toString(),
                // dateDe: dateDe,
                // dateA: dateA,
                // boutique: boutiqueVente.value,
                gerant: auth.currentUser.displayName
            }
            makeRapport({title : 'BALANCE DES COMPTES  ' , orientation : "l", format : "a4", id : 'balance', option: options})
                /// End of Generate facture in pdf
        }

        return {
            totalVersement,
            totalRetrait,
            soldeActuel,
            // getBalanceByDate,
            simpleNumberFormatter,
            makePDF,
            // dateDebut,
            // dateFin,
            // debitFournisseur,
            // creditFournisseur,
            // debitClient,
            // creditClient,
            // debitCaisse,
            // creditCaisse,
            // debitAchatMarchandise,
            // creditVenteMarchandise,
            // masseSalariale,
            // listeArticles,
            // totalPAU,

        }

    }

}
</script>

<style>

</style>
