<template>
  <div class="md:px-2 py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="flex justify-between items-center gap-2">
          <!-- searchbar -->
          <div class="searchbar mx-1  flex justify-start ">
            <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
            <span class="material-icons -mx-9 p-4">
                  search
            </span>
          </div>
          <!-- Dates -->
          <div class="flex justify-start gap-2 mr-1">
            <div class="flex justify-between items-center gap-2">
              <p class="text-center font-bold">ENREGISTRER UN MOUVMENT</p>
            </div>
          </div>

            <!-- Solde actuel -->
          <div v-if="soldeActuel">
            <div class="flex justify-center my-2 mr-2">
                <span class="flex justify-center gap-4 bg-red-400 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{' bg-green-400 ': Number(soldeActuel) > 0 }" >
                <span class="mx-3 my-4" >Solde actuel</span>
                <span class="mx-3 my-4">{{soldeActuel ? (soldeActuel ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div>


          </div>
        </div>
        <div  class="flex justify-center gap-2">
          <!-- Liste des comptes -->
          <div class=" border rounded border-gray-300 text-xs p-0.5 w-1/3">
            <ul>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1" @click="getAccounts">Tous</li>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1" v-for="account in filteredAccount" :key="account.id" @click="accountSelected(account)">{{ account.nom +" "+ account.prenom}}</li>
            </ul>
          </div>
          <!-- operation form -->
          <div  class="border border-gray-300 rounded  p-0.5 w-full">
            <div class="modal active">
                <h2 class="mb-2 font-bold">Mouvements de Compte</h2>
                <form  @submit.prevent="handleSubmit">
                    <input type="text" class="hidden" name="id" v-model="id">
                    <input type="text" name="nom"   class="uppercase" placeholder="Nom"  v-model="nom" disabled>
                    <input type="text" name="prenom"   class="uppercase" placeholder="Prenoms" v-model="prenom" disabled>
                    <input type="text" name="contact" placeholder="Telephone"   v-model="contact" disabled>
                    <select name="typeOperation" id="typeOperation" v-model="typeOperation">
                        <option value="">Quelle Opération ?</option>
                        <option value="Versement">Un versement</option>
                        <option value="Retrait">Un retrait</option>
                    </select>
                    <input type="text" name="montantOperation" placeholder="Montant"   v-model="montantOperation" >

                    <button>Enregistrer</button>
                    <p class="error">{{ createError }}</p>
                </form>
                <div>
                </div>
            </div>
            <!-- Total de la liste -->
            <!-- <div class="flex justify-center mt-2 mr-0">
                <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200"  >
                <span class="mx-3 my-4" >  Montant Total</span>
                <span class="mx-3 my-4">{{totalTTC ? (totalTTC ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div> -->
          </div>
        <!-- <div v-else class="flex justify-center w-full">
          <Spinner />
        </div> -->
        </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { auth, db, error } from "../../firebase/config"
import {  getDocs, collection, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import getUser from "../../controllers/getUser"
import getDocument from "../../controllers/getDocument"
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import createDocument from "../../controllers/createDocument"
import { useRouter } from 'vue-router'
// import NewProduit from "./NewProduit.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted, watch } from '@vue/runtime-core';
export default {
  components: {  Spinner },
  setup() {
    const router = useRouter()
    // const documents = ref("")
    // const getError = ref("")
    const {documents, getError, load} = getDocuments()
    const { createError, create} = createDocument()
    const id = ref('')
    const soldeActuel = ref()
    const listeMouvements = ref([])
    const searchQuery = ref("")
    const accountList = ref([])
    const filteredAccounts = ref([])
    const nom = ref(null)
    const prenom = ref(null)
    const contact = ref(null)
    const typeOperation = ref('')
    const montantOperation = ref('')
    const accountId = ref(null)

    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

    const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

    }

    const formatedNumber = (strNumber) => {
      return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
    }

    const formatedFacture = (strFactId) => {
      return strFactId.length > 20 ? strFactId.substring(0,20) +"..." : strFactId
    }

    const getAccounts =async () => {
        const docRef =  collection(db, "comptes")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("sanap facture", snap.docs, new Date().getMonth())
            accountList.value = snap.docs.map(doc =>{
                // console.log("Data : ", doc.data())
                return {...doc.data(), id : doc.id}
            })
        filteredAccounts.value = accountList.value
        // console.log("account : ", filteredAccounts.value)
        })
    }

    // const getAccounts =async () => {
    //     const docRef =  collection(db, "facturesFournisseurs")
    //     const q = query( docRef, orderBy("createdAt", "desc"))
    //     const res = onSnapshot(q, ( snap ) =>{
    //         // console.log("sanap facture", snap.docs)
    //         accountList.value = []
    //         accountList.value = snap.docs.map(doc =>{
    //                 return {...doc.data(), id : doc.id}
    //         })
    //         filteredAccounts.value = accountList.value.filter (facture => {
    //           return facture.fournisseurId === fournisseurCmdId.value
    //         })
    //         // console.log("Liste boutique facture : ", accountList.value, fournisseurCmdId.value)
    //     })
    // }

    const getSoldes = async () =>{
        const docRef =  collection(db, "mouvements")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            listeMouvements.value = snap.docs.map(doc =>{
                //doc.data().createdAt = doc.data().createdAt.seconds
                return {...doc.data(), id : doc.id}
            })
        // console.log("solde : ", listeMouvements.value)
        })
    }
    const getSolde =  (id) =>{
        let versement=0, retrait =0, solde=0

        listeMouvements.value.map(mouvement => {
            if(mouvement.compteId == id && mouvement.operation =="Versement") {
                versement += Number(mouvement.montant)
            }else if(mouvement.compteId == id && mouvement.operation =="Retrait") {
                retrait += mouvement.montant
            }
        })
        solde = versement - retrait
        return solde
    }

    const accountSelected = (account) => {
      soldeActuel.value = getSolde(account.id)
      accountId.value = account.id
      nom.value = account.nom
      prenom.value = account.prenom
      contact.value = account.contact
    }


    onMounted( async () => {
      await getSoldes()
      await getAccounts()
    //   await loadCommandes()

    })

    const isAdmin = ref(async () =>{
      const { findUser, error, user } = getUser()
      let _user = auth.currentUser
      if(_user) {
          await findUser(_user.uid)
          if(user.value.fonction !== 'Administrateur'){
            return false

          } else {
            return true
          }
        }else {
          router.push({ name: "Home"})
        }

    })

    const toggleForm = () => {
      router.push( { name: "NewProduit", params: { token: auth.currentUser.accessToken}})
    }

    const filteredAccount = computed( () =>{
          return filteredAccounts.value.length ? filteredAccounts.value.filter( (account) => {
            return account.prenom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []
    })

    const handleSubmit = async() => {
        if(isNaN(montantOperation.value)) {
            alert("Saisie du montant incorrect ! ")
            return
        }
        if(!accountId.value) {
            alert("Veuillez selectionner un compte !")
            return
        }
        if(!typeOperation.value) {
            alert("Veuillez selectionner une opération à effectuer !")
            return
        }
        // if(typeOperation.value =='Retrait' && montantOperation.value > soldeActuel.value ) {
        //     alert("Solde insuffisant pour le montant demandé !")
        //     return
        // }

        const mouvement = {
                compteId : accountId.value,
                operation: typeOperation.value,
                montant: Number(montantOperation.value),
                createdAt: serverTimestamp()
            }
            // console.log("mouvement : ", mouvement)
            await create("mouvements", mouvement)
            if(!createError.value) {
                alert("Mouvement enregistré avec succès ! ")
                nom.value=''
                prenom.value=''
                contact.value = ''
                montantOperation.value=''
                typeOperation.value=''
                accountId.value=''
                soldeActuel.value =''
            }
    }


    return {
      id,
      createError,
      soldeActuel,
      getAccounts,
      formatedDate,
      formatedNumber,
      auth,
      isAdmin,
      toggleForm,
      documents,
      getError,
      searchQuery,
      filteredAccount,
      nom,
      prenom,
      contact,
      montantOperation,
      typeOperation,
      accountList,
      accountSelected,
      getAccounts,
      handleSubmit,
    }
  }
}
</script>

<style>

</style>
