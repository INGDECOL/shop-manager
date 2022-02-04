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

    </div>

</template>

<script>
import { ref } from '@vue/reactivity'
import genererPDF from '../../controllers/genererPDF'
import getDocuments from '../../controllers/getDocuments'
import { onMounted, watch } from '@vue/runtime-core'
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'
import { db } from '../../firebase/config'
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
        const dateDebut = ref("")
        const dateFin = ref("")
        const listeCommandeFournisseurs = ref([])
        const listeDetteFournisseurs = ref([])
        const listeVentes = ref([])
        const listeDetteClients = ref([])
        const listeBulletins = ref([])

        const { } = genererPDF()

        const numberFormatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'GNF',

        })
        const simpleNumberFormatter = new Intl.NumberFormat('de-DE', {
            // style: 'currency',
            // currency: 'GNF',

        })

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

        watch(listeCommandeFournisseurs, ()=>{
            console.log("chg")
            debitFournisseur.value = 0
            debitAchatMarchandise.value = 0
            listeCommandeFournisseurs.value.map(cmd => {
                debitFournisseur.value += cmd.payer
                debitAchatMarchandise.value += cmd.payer
            })
        })

        watch(listeVentes, ()=>{
            console.log("chg")
            debitClient.value = 0
            debitCaisse.value = 0
            creditVenteMarchandise.value = 0
            listeVentes.value.map(vte => {
                debitClient.value += vte.payer
                debitCaisse.value += vte.payer
                creditVenteMarchandise.value += vte.payer
            })
        })

        watch(listeBulletins, ()=>{
            masseSalariale.value = 0
            listeBulletins.value.map(bulletin => {
                masseSalariale.value += bulletin.montantNet
            })
        })

        const getBalanceByDate = () => {

        }

        onMounted( async()=> {
           await getCommandeFournisseurs()
           await getVenteClients()
           await getBulletins()

        })

        const makePDF = () => {
            alert("Fichier PDF en cours de traitement , reéssayer plus tard !!")
        }


        return {
            getBalanceByDate,
            simpleNumberFormatter,
            makePDF,
            dateDebut,
            dateFin,
            debitFournisseur,
            debitClient,
            debitCaisse,
            debitAchatMarchandise,
            creditVenteMarchandise,
            masseSalariale,

        }

    }

}
</script>

<style>

</style>
