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
          <!-- Boutique -->
          <div class="mr-2 pr-2.5">
              <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                  <option value="">Selectionner la boutique</option>
                  <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
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
              <input type="date" name="dateFin" id="dateFin" v-model="dateFin" @change="getVenteByDate">
            </div>
          </div>
        </div>
        <div  class="flex justify-start gap-2">
          <!-- Liste des factures -->
          <div class=" border rounded border-gray-300 text-xs p-0.5">
            <ul>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1 hover:bg-gray-200" @click="loadVentes">Tous</li>
              <li class="m-1 font-semibold cursor-pointer hover:underline hover:text-gray-400 bg-gray-300 rounded p-1 hover:bg-gray-200" v-for="facture in filteredfacture" :key="facture.id" @click="getVenteByFacture(facture.id)">{{ formatedFacture(facture.id)}}</li>
            </ul>
          </div>
          <!-- Liste des ventes -->
          <div v-if="listeVentes.length" class="border border-gray-300 rounded overflow-scroll p-0.5 w-full">
            <table class="min-w-full bg-white divider-y divide-gray-400" id="listeVentes">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Article</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">PVU</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Qté cmd</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Montant</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th> -->
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(vente, n) in filteredvente " :key="vente.id">
                    <td class="text-left text-xs py-2 px-3 font-semibold uppercase">{{ n + 1 }} </td>
                    <td class="text-left text-xs py-2 px-3 ">{{ formatedDate(vente.createdAt.seconds ) }}</td>
                    <td class="text-left text-xs py-2 px-3 uppercase">{{vente.article}}</td>
                    <td class="text-center text-xs py-2 px-3">{{ (vente.pvu) }}</td>
                    <td class="text-center text-xs py-2 px-3">{{ vente.qtecmd}}</td>
                    <td class="text-center text-xs py-2 px-3 " title="Montant Total">{{ (vente.payer) }}</td>
                    <!-- <td class="text-left text-xs py-2 px-3 flex justify-between items-center">
                      <span class="material-icons disabled" title="Modifier"  @click="edit(vente.id)" >edit</span>
                      <span class="material-icons strash text-red-300 disabled" title="Supprimer" @click="destroy(vente.id)">delete</span>
                    </td> -->
                  </tr>
                </tbody>
                <tfoot>
                    <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="3">Totaux </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPVU)}} </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalTTC)}} </td>
                    </tr>
                </tfoot>
            </table>
            <!-- Total de la liste -->
            <div class="flex justify-center mt-2 mr-0">
                <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200"  >
                <span class="mx-3 my-4" >  Montant Total</span>
                <span class="mx-3 my-4">{{totalTTC ? (totalTTC ).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 }}</span>
                </span>
            </div>
            <div class="flex justify-center" v-if="filteredvente.length">
                <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700" @click="exportPDF">Imprimer la liste</button>
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
import { onMounted, watch } from '@vue/runtime-core'
import genererPDF from '../../controllers/genererPDF'
export default {
  components: {  Spinner },
  setup() {
    const router = useRouter()
    // const documents = ref("")
    // const getError = ref("")
    const {documents, getError, load} = getDocuments()
    const boutiqueVente = ref('')
    const boutique = ref()
    const listeBoutiques = ref(null)
    const searchQuery = ref("")
    const listeFactures = ref([])
    const filteredFactures = ref([])
    const editproduitId = ref(null)
    const listeVentes = ref([])
    const filteredvente = ref([])
    const dateDebut = ref("")
    const dateFin = ref("")
    const totalTTC = ref("")
    const totalPVU = ref("")
    const totalQte = ref("")
    const { makeDocument } = genererPDF()
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

    const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

    }
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

    const getBoutique = (id) =>{
      boutique.value = listeBoutiques.value.filter(boutique =>{
        return boutique.id == id
      })
    }

    watch(boutiqueVente, async()=>{
        if(boutiqueVente.value =='') {
            return
        }
        getBoutique(boutiqueVente.value)
        // console.log("boutique : ", boutique.value[0].designationBoutique)
        await getBoutiqueFactures()
        await loadBoutiqueVentes()
    })

    const getFactures =async () => {
        const docRef =  collection(db, "factures")
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

    const loadVentes =async () => {
        const docRef =  collection(db, "ventes")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            listeVentes.value = snap.docs.map(doc =>{
                return {...doc.data(), id : doc.id}
            })
            loadBoutiqueVentes()
            getBoutiqueFactures()
            // filteredvente.value = listeVentes.value
            getTotal()
        })
        await getFactures()
    }

    const loadBoutiqueVentes =async () => {

        filteredvente.value = listeVentes.value.filter(vente => {
          return vente.boutiqueId == boutiqueVente.value
        })
        // filteredvente.value = listeVentes.value
        getTotal()
    }

    const getTotal = () => {
      totalTTC.value = 0
      totalPVU.value = 0
      totalQte.value = 0
      filteredvente.value.map(vente => {
        totalTTC.value += Number(vente.payer)
        totalQte.value += Number(vente.qtecmd)
        totalPVU.value += Number(vente.pvu)

      })
    }

    const getVenteByFacture = (facture) => {
      if(boutiqueVente.value ==''){
        alert("Veuillez selectionner une boutique !")
        return
      }
      filteredvente.value = listeVentes.value.filter(vente => {
        return vente.factureId == facture
      })
      getTotal()
    }

    const getVenteByDate = (facture) => {
       if(boutiqueVente.value ==''){
        alert("Veuillez selectionner une boutique !")
        return
      }

      filteredvente.value = listeVentes.value.filter(vente => {
        return new Date(vente.createdAt.seconds *1000) >= new Date(dateDebut.value) && new Date(vente.createdAt.seconds *1000) <= new Date(dateFin.value) && vente.boutiqueId == boutiqueVente.value
      })
      getTotal()
    }

    onMounted( async () => {
      await getBoutiques()
      await getFactures()
      await loadVentes()

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

    const formatedVentes = () => {
      // console.log("length : ", documents.value.length)
      return listeVentes.value ?  listeVentes.value.map(vente => {
         vente.createdAt = new Date(vente.createdAt.seconds *1000).toLocaleString(undefined, options)
            vente.pvu = vente.pvu.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
            vente.payer = vente.payer.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
            // console.log("ventes : ", vente.createdAt)
            return vente
      }): []
    }

    const exportPDF = () => {
    /// Generate facture in pdf
      let dateDe= dateDebut.value
      let dateA = dateFin.value
      let options = {
          totalTTC : totalTTC.value.toString(),
          dateDe: dateDe,
          dateA: dateA,
          boutique: boutiqueVente.value,
          gerant: auth.currentUser.displayName
      }
      makeDocument({title : 'LISTE DES VENTES DE LA BOUTIQUE  ' + boutique.value[0].designationBoutique, orientation : "p", format : "a4", id : 'listeVentes', option: options})
        /// End of Generate facture in pdf
    }

    return {
      boutiqueVente,
      filteredBoutiques,
      formatedFacture,
      formatedVentes,
      formatedDate,
      formatedNumber,
      numberFormatter,
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
      listeVentes,
      filteredvente,
      getVenteByDate,
      getVenteByFacture,
      loadVentes,
      dateDebut,
      dateFin,
      totalTTC,
      totalPVU,
      totalQte,
      exportPDF,
    }
  }
}
</script>

<style>

</style>
