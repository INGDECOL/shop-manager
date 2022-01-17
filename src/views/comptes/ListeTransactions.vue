<template>
  <div class="md:px-2 py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="flex justify-between items-center">
          <!-- searchbar -->
          <div class="searchbar mx-1  flex justify-start ">
            <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
            <span class="material-icons -mx-9 p-4">
                  search
            </span>
          </div>
          <div class="flex justify-start gap-2 mr-1">
            <div class="flex justify-between items-center gap-2">
              <p class="text-center font-bold">LISTE DES TRANSACTIONS</p>
            </div>
          </div>

          <!-- Boutique -->
          <!-- <div class="mr-2 pr-2.5">
              <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                  <option value="">Selectionner la boutique</option>
                  <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
              </select>
          </div> -->
          <!-- Dates -->
          <!-- <div class="flex justify-start gap-2 mr-1">
            <div class="flex justify-between items-center gap-2">
              <label for="">De</label>
              <input type="date" name="dateDebut" id="dateDebut" v-model="dateDebut">
            </div>
            <div class="flex justify-between items-center gap-2 mr-1">
              <label for="">A</label>
              <input type="date" name="dateFin" id="dateFin" v-model="dateFin" @change="getVenteByDate">
            </div>
          </div> -->

          <div v-if="soldeActuel">
            <div class="flex justify-center my-2 mr-2">
                <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200"  >
                <span class="mx-3 my-4" >Solde actuel</span>
                <span class="mx-3 my-4">{{soldeActuel ? (soldeActuel ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div>


          </div>

        </div>
        <div  class="flex justify-start gap-2">
          <!-- Liste des comptes -->
          <div class=" border rounded border-gray-300 text-xs p-0.5">
            <ul>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1 hover:bg-gray-200" @click="getAccounts">Tous</li>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1 hover:bg-gray-200" v-for="account in filteredAccount" :key="account.id" @click="accountSelected(account)">{{ account.nom +" "+ account.prenom}}</li>
            </ul>
          </div>
          <!-- Liste des mouvements -->
          <div v-if="filteredMouvements.length" class="border border-gray-300 rounded overflow-scroll p-0.5 w-full">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date Op</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Type</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Montant</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Solde</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Montant</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(mouvement, n) in filteredMouvements " :key="mouvement.id">
                    <td class="text-left text-xs py-2 px-3 font-semibold uppercase">{{ n + 1 }} </td>
                    <td class="text-left text-xs py-2 px-3 ">{{ formatedDate(mouvement.createdAt.seconds ) }}</td>
                    <td class="text-left text-xs py-2 px-3 uppercase">{{mouvement.operation}}</td>
                    <td class="text-left text-xs py-2 px-3">{{ formatedNumber(mouvement.montant) }}</td>
                    <td class="text-center text-xs font-bold py-2 px-3">{{ formatedNumber(mouvement.solde ? mouvement.solde : 0) }}</td>
                    <!-- <td class="text-center text-xs py-2 px-3 " title="Montant Total">{{ formatedNumber(mouvement.payer) }}</td> -->
                    <td class="text-left text-xs py-2 px-3 flex justify-between items-center">
                      <span class="material-icons disabled" title="Modifier"  @click="edit(mouvement.id)" >edit</span>
                      <span class="material-icons strash text-red-300 disabled" title="Supprimer" @click="destroy(mouvement.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
            </table>
            <!-- Total de la liste -->
            <!-- <div class="flex justify-center mt-2 mr-0">
                <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200"  >
                <span class="mx-3 my-4" >  Montant Total</span>
                <span class="mx-3 my-4">{{totalTTC ? (totalTTC ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div> -->
            <div class="flex justify-center">
                <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700">Imprimer la liste</button>
            </div>
          </div>
        <div v-else class=" items-center w-full">
          <p class="text-center font-bold">Aucune donnée trouvée</p>
          <div>

          <Spinner />
          </div>
        </div>
        </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { auth, db, error } from "../../firebase/config"
import {  getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import getUser from "../../controllers/getUser"
import getDocument from "../../controllers/getDocument"
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
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
    const nom = ref('')
    const prenom = ref('')
    const contact = ref('')
    const soldeActuel = ref('')
    const accountList = ref([])
    const accountId = ref(null)
    const searchQuery = ref("")
    const listeFactures = ref([])
    const filteredAccounts = ref([])
    const filteredFactures = ref([])
    const editproduitId = ref(null)
    const listeMouvements = ref([])
    const filteredMouvements = ref([])
    const dateDebut = ref("")
    const dateFin = ref("")
    const totalTTC = ref("")
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
        if(isAdmin){
          return boutique //.gerantBoutique == auth.currentUser.email
        }else {
          return boutique.gerantBoutique == auth.currentUser.email

        }
      })
    })

    // watch(boutiqueVente, async()=>{
    //     if(boutiqueVente.value =='') {
    //         return
    //     }
    //     await getBoutiqueFactures()
    //     await loadBoutiqueVentes()
    // })

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
        //console.log("account : ", filteredAccounts.value)
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
        const q = query( docRef, orderBy("createdAt", "asc"))
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
        console.log("solde : ", versement, retrait)
        return solde
    }
    const getMouvements =  (id) =>{
        let solde =0
        filteredMouvements.value = listeMouvements.value.filter(mouvement => {
            if(mouvement.compteId == id ) {
                if(mouvement.operation =="Versement") {
                solde += mouvement.montant
                mouvement.solde = solde
                }else if(mouvement.operation == "Retrait") {
                solde -= mouvement.montant
                mouvement.solde = solde
            }
            }
            return mouvement.compteId == id
        })

    }

    const getBoutiqueFactures =async () => {
        const docRef =  collection(db, "factures")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("sanap facture", snap.docs)
            listeFactures.value = []
            listeFactures.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
            })
            filteredFactures.value = listeFactures.value.filter (facture => {
              return facture.boutiqueId == boutiqueVente.value
            })
            // console.log("Liste boutique facture : ", listeFactures.value, boutiqueVente.value)
        })
    }

    // const getAccounts =async () => {
    //     const docRef =  collection(db, "ventes")
    //     const q = query( docRef, orderBy("createdAt", "desc"))
    //     const res = onSnapshot(q, ( snap ) =>{
    //         // console.log("snap vente", snap.docs)
    //         listeVentes.value = snap.docs.map(doc =>{
    //             return {...doc.data(), id : doc.id}
    //         })
    //         loadBoutiqueVentes()
    //         getBoutiqueFactures()
    //         // filteredMouvements.value = listeVentes.value
    //         getTotal()
    //     })
    //     await getAccounts()
    // }

    // const loadBoutiqueVentes =async () => {

    //     filteredMouvements.value = listeVentes.value.filter(vente => {
    //       return vente.boutiqueId == boutiqueVente.value
    //     })
    //     // filteredMouvements.value = listeVentes.value
    //     getTotal()
    // }

    const getTotal = () => {
      totalTTC.value = 0
      filteredMouvements.value.map(vente => {
        totalTTC.value += Number(vente.payer)
      })
    }

    const accountSelected = (account) => {
      soldeActuel.value = getSolde(account.id)
      accountId.value = account.id
      nom.value = account.nom
      prenom.value = account.prenom
      contact.value = account.contact
      getMouvements(account.id)
    }

    const getVenteByDate = (facture) => {
       if(boutiqueVente.value ==''){
        alert("Veuillez selectionner une boutique !")
        return
      }

      filteredMouvements.value = listeVentes.value.filter(vente => {
        return new Date(vente.createdAt.seconds *1000) >= new Date(dateDebut.value) && new Date(vente.createdAt.seconds *1000) <= new Date(dateFin.value) && vente.boutiqueId == boutiqueVente.value
      })
      getTotal()
    }

    onMounted( async () => {
    //   await getBoutiques()
        await getSoldes()
        await getAccounts()

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

    const edit = (id) => {
      //console.log(" id :::: ",id)
      alert("Vous ne pouvez pas modifier ou supprimer sur cette page")
      return
      // if( isAdmin) {
      //   router.push( { name: "EditProduit", params: { token: auth.currentUser.accessToken, id: id}})

      // }else {
      //   alert("Vous n'êtes pas autorisé à effectuer cette action")
      // }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
       alert("Vous ne pouvez pas supprimer ou modifier sur cette page")
      return
      // if( isAdmin) {
      //     const { destroy, error } = destroyDocument()
      //     if( confirm("Voulez-vous retourner cette vente et redefinir tous le montants vendus ?? \n Cette action est definitive et irreversible !!") ) {
      //       await destroy("produits", id)

      //   }
      //   if(error.value){
      //     alert(error.value)
      //   }
      // }else {
      //   alert("Vous n'êtes pas autorisé à effectuer cette action")
      // }
    }
    const filteredAccount = computed( () =>{
        console.log(searchQuery.value)
          return filteredAccounts.value.length ? filteredAccounts.value.filter( (account) => {
            return account.prenom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []
    })


    return {
      accountList,
      filteredAccounts,
      soldeActuel,
      formatedDate,
      formatedNumber,
      auth,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      getError,
      searchQuery,
      filteredAccount,
      editproduitId,
      listeFactures,
      filteredMouvements,
      getVenteByDate,
      accountSelected   ,
      getAccounts,
      dateDebut,
      dateFin,
      totalTTC,
    }
  }
}
</script>

<style>

</style>
