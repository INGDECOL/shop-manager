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
          <!-- Fournisseurs -->
          <div class="mr-2 pr-2.5">
              <select name="magasin"  id="magasin" v-model="fournisseurCmdId" class=" font-bold  cursor-pointer"  title="Fournisseur" required>
                      <option value="">Selectionner le fournisseur</option>
                      <option value="FssDiv">FssDiv</option>
                      <option v-for="fournisseur in filteredFournisseurs" :key="fournisseur.id" :value="fournisseur.id">{{fournisseur.nom +" "+fournisseur.prenom }}</option>
                  </select>
          </div>
          <!-- Dates -->
          <div class="flex justify-start gap-2 mr-1">
            <div class="flex justify-between items-center gap-2">
              <label for="">De</label>
              <input type="date" name="dateDebut" id="dateDebut" v-model="dateDebut">
            </div>
            <div class="flex justify-between items-center gap-2 mr-1">
              <label for="">A</label>
              <input type="date" name="dateFin" id="dateFin" v-model="dateFin" @change="getCommandeByDate">
            </div>
          </div>
          <!-- <div>
            <button class="my-0 mx-2 py-0 flex justify-between items-center" @click="toggleForm"><span class="material-icons text-center py-1 m-0">add</span>Ajouter</button>

          </div> -->
        </div>
        <div  class="flex justify-start gap-2">
          <!-- Liste des factures -->
          <div class=" border rounded border-gray-300 text-xs p-0.5">
            <ul>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400" @click="getFournisseursFactures">Tous</li>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400" v-for="facture in filteredfacture" :key="facture.id" @click="getCommandeByFacture(facture.id)">{{ formatedFacture(facture.id)}}</li>
            </ul>
          </div>
          <!-- Liste des ventes -->
          <div v-if="listeCommandes.length" class="border border-gray-300 rounded overflow-scroll p-0.5 w-full">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Article</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">PAU</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Qté cmd</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Montant</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(vente, n) in filteredvente " :key="vente.id">
                    <td class="text-left text-xs py-2 px-3 font-semibold uppercase">{{ n + 1 }} </td>
                    <td class="text-left text-xs py-2 px-3 ">{{ formatedDate(vente.createdAt.seconds ) }}</td>
                    <td class="text-left text-xs py-2 px-3 uppercase">{{vente.article}}</td>
                    <td class="text-left text-xs py-2 px-3">{{ formatedNumber(vente.pau) }}</td>
                    <td class="text-center text-xs py-2 px-3">{{ vente.qtecmd}}</td>
                    <td class="text-center text-xs py-2 px-3 " title="Montant Total">{{ formatedNumber(vente.payer) }}</td>
                    <td class="text-left text-xs py-2 px-3 flex justify-between items-center">
                      <span class="material-icons disabled" title="Modifier"  @click="edit(vente.id)" >edit</span>
                      <span class="material-icons strash text-red-300 disabled" title="Supprimer" @click="destroy(vente.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
            </table>
            <!-- Total de la liste -->
            <div class="flex justify-center mt-2 mr-0">
                <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200"  >
                <span class="mx-3 my-4" >  Montant Total</span>
                <span class="mx-3 my-4">{{totalTTC ? (totalTTC ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div>
            <div class="flex justify-center">
                <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700">Imprimer la liste</button>
            </div>
          </div>
        <div v-else class="flex justify-center w-full">
          <Spinner />
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
    const fournisseurCmdId = ref('')
    const listeBoutiques = ref(null)
    const listeFournisseurs = ref(null)
    const searchQuery = ref("")
    const listeFactures = ref([])
    const filteredFactures = ref([])
    const editproduitId = ref(null)
    const listeCommandes = ref([])
    const filteredvente = ref([])
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

    const getFournisseurs = async () => {
      const docRef = collection(db, "fournisseurs")
      const res = onSnapshot(docRef, (snap)=>{
          listeFournisseurs.value = snap.docs.map(doc => {
              return {...doc.data(), id: doc.id}
          })
      })

    }
    const filteredFournisseurs = computed(()=>{
      return listeFournisseurs.value && listeFournisseurs.value.filter((FSS)=>{
              return listeFournisseurs.value
            //   return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          })
    })

    watch(fournisseurCmdId, async()=>{
        if(fournisseurCmdId.value =='') {
            return
        }
        await getFournisseursFactures()
        await loadfournisseurCmdIds()
    })

    const getFactures =async () => {
        const docRef =  collection(db, "facturesFournisseurs")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("sanap facture", snap.docs, new Date().getMonth())
            listeFactures.value = snap.docs.map(doc =>{
                // console.log("Data : ", doc.data())
                return {...doc.data(), id : doc.id}
            })
        filteredFactures.value = listeFactures.value
        })
    }

    const getFournisseursFactures =async () => {
        const docRef =  collection(db, "facturesFournisseurs")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("sanap facture", snap.docs)
            listeFactures.value = []
            listeFactures.value = snap.docs.map(doc =>{
                    return {...doc.data(), id : doc.id}
            })
            filteredFactures.value = listeFactures.value.filter (facture => {
              return facture.fournisseurId === fournisseurCmdId.value
            })
            loadfournisseurCmdIds()
            // console.log("Liste boutique facture : ", listeFactures.value, fournisseurCmdId.value)
        })
    }

    const loadCommandes =async () => {
        const docRef =  collection(db, "commandeFournisseurs")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            listeCommandes.value = snap.docs.map(doc =>{
                return {...doc.data(), id : doc.id}
            })
            loadfournisseurCmdIds()
            getFournisseursFactures()
            // filteredvente.value = listeCommandes.value
            getTotal()
        })
        await getFactures()
    }

    const loadfournisseurCmdIds =async () => {

        filteredvente.value = listeCommandes.value.filter(vente => {
          return vente.fournisseurId == fournisseurCmdId.value
        })
        // filteredvente.value = listeCommandes.value
        getTotal()
    }

    const getTotal = () => {
      totalTTC.value = 0
      filteredvente.value.map(vente => {
        totalTTC.value += Number(vente.payer)
      })
    }

    const getCommandeByFacture = (facture) => {
      if(fournisseurCmdId.value ==''){
        alert("Veuillez selectionner une boutique !")
        return
      }
      filteredvente.value = listeCommandes.value.filter(vente => {
        return vente.factureId == facture
      })
      getTotal()
    }

    const getCommandeByDate = (facture) => {
       if(fournisseurCmdId.value ==''){
        alert("Veuillez selectionner un fournisseur !")
        return
      }

      filteredvente.value = listeCommandes.value.filter(vente => {
        return new Date(vente.createdAt.seconds *1000) >= new Date(dateDebut.value) && new Date(vente.createdAt.seconds *1000) <= new Date(dateFin.value) && vente.fournisseurId == fournisseurCmdId.value
      })
      getTotal()

      filteredFactures.value = listeFactures.value.filter(facture => {
          return new Date(facture.createdAt.seconds *1000) >= new Date(dateDebut.value) && new Date(facture.createdAt.seconds *1000) <= new Date(dateFin.value) && facture.fournisseurId == fournisseurCmdId.value
      })

    }

    onMounted( async () => {
      await getFournisseurs()
      await getFactures()
      await loadCommandes()

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
    const filteredfacture = computed( () =>{
        // console.log("factures in filtered facture fx : ", listeFactures.value)

          return filteredFactures.value.length ? filteredFactures.value.filter( (facture) => {
            return facture.id.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []

    })

    const formatedCommandes = () => {
      // console.log("length : ", documents.value.length)
      return listeCommandes.value ?  listeCommandes.value.map(vente => {
         vente.createdAt = new Date(vente.createdAt.seconds *1000).toLocaleString(undefined, options)
            vente.pvu = vente.pvu.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
            vente.payer = vente.payer.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
            // console.log("ventes : ", vente.createdAt)
            return vente
      }): []
    }

    return {
      fournisseurCmdId,
      filteredFournisseurs,
      formatedFacture,
      getFactures,
      formatedCommandes,
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
      filteredfacture,
      editproduitId,
      listeFactures,
      listeCommandes,
      filteredvente,
      getCommandeByDate,
      getCommandeByFacture,
      loadCommandes,
      getFournisseursFactures,
      dateDebut,
      dateFin,
      totalTTC,
    }
  }
}
</script>

<style>

</style>
