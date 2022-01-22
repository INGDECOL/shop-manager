<template>
  <div class="md:px-2 py-8 items-center w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="flex justify-center items-center gap-3">
          <!-- searchbar -->
          <div class="searchbar mx-1  flex justify-start ">
            <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
            <span class="material-icons -mx-9 p-4">
                  search
            </span>
          </div>
          <!-- Boutique -->
          <div class="mr-2 pr-2.5">
              <span class="flex justify-center gap-4 bg-blue-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200 p-3"  >
                {{ selectedBoutique }}
                </span>
              <!-- <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                  <option value="">Selectionner la boutique</option>
                  <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
              </select> -->
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
        <div  class="flex justify-center gap-2">
          <!-- Liste des boutiques -->
          <div class=" border rounded border-gray-300 text-sm p-0.5 w-1/3">
            <ul>
              <li class="m-1 font-bold cursor-pointer hover:underline hover:text-gray-400" @click="loadVentes">Tous</li>
              <li class="m-1 font-bold cursor-pointer hover:underline hover:text-gray-400 bg-gray-200 pl-1 py-1.5 rounded" v-for="boutique in filteredfacture" :key="boutique.id" @click="boutiqueSelected(boutique)">{{ boutique.designationBoutique}}</li>

            </ul>
          </div>
          <!-- Liste des operation -->
          <div v-if="listeVentes.length" class="border border-gray-300 rounded p-0.5 ">
            <table class="min-w-full bg-white divider-y divide-gray-400" id="rapportGlobal">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-bold text-base">#</th>
                    <th class="text-left py-3 px-4 uppercase font-bold text-base">Libelle</th>
                    <th class="text-left py-3 px-4 uppercase font-bold text-base">Montant</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll"  >
                    <td class="text-left text-base py-2 px-3 font-bold uppercase">1 </td>
                    <td class="text-left text-base font-bold py-2 px-3 ">Total des ventes</td>
                    <td class="text-center text-base font-bold py-2 px-3 uppercase">{{ numberFormatter.format(totalTTC ? totalTTC : 0 )}}</td>
                  </tr>
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped">
                    <td class="text-left text-base py-2 px-3 font-bold uppercase">2 </td>
                    <td class="text-left text-base text-red-300 font-bold py-2 px-3">Total montant en dette</td>
                    <td class="text-center text-base text-red-300 hover:text-red-400 font-bold py-2 px-3 cursor-pointer" title="Montant total non recouvré">{{ numberFormatter.format(montantTotalDettes ? montantTotalDettes : 0)}}</td>
                  </tr>
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll">
                    <td class="text-left text-base py-2 px-3 font-bold uppercase">3 </td>
                    <td class="text-left text-base font-bold py-2 px-3">Total PAU des articles en Stock</td>
                    <td class="text-center text-base font-bold py-2 px-3 cursor-pointer" title="Prix d'achat total des articles dans la boutique">{{ numberFormatter.format(pauTotal ? pauTotal : 0)}}</td>
                  </tr>
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped">
                    <td class="text-left text-base py-2 px-3 font-bold uppercase">4 </td>
                    <td class="text-left text-base font-bold py-2 px-3">Total PVU des articles en Stock</td>
                    <td class="text-center text-base font-bold py-2 px-3 cursor-pointer" title="Prix de vente total des articles dans la boutique">{{ numberFormatter.format(pvuTotal ? pvuTotal : 0)}}</td>
                  </tr>
                </tbody>
            </table>
            <!-- Total de la liste -->
            <div class="flex justify-center mt-2 mr-0">
                    <button class=" border-2 border-green-300 bg-transparent hover:bg-green-400" @click="exportPDF">Imprimer</button>
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
import getDocuments from "../../controllers/getDocuments"
import { useRouter } from 'vue-router'
// import NewProduit from "./NewProduit.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted, watch } from '@vue/runtime-core';
import receptionArticles from '../../controllers/receptionArticles';
import genererPDF from '../../controllers/genererPDF';
export default {
  components: {  Spinner },
  setup() {
    const router = useRouter()
    // const documents = ref("")
    // const getError = ref("")
    const {documents, getError, load} = getDocuments()
    const boutiqueVente = ref('')
    const selectedBoutique = ref('')
    const listeBoutiques = ref(null)
    const searchQuery = ref("")
    const listeFactures = ref([])
    const listeArticles = ref([])
    const filteredFactures = ref([])
    const listeDettes = ref([])
    const filteredDettes = ref([])
    const editproduitId = ref(null)
    const listeVentes = ref([])
    const filteredvente = ref([])
    const montantTotalDettes = ref()
    const pvuTotal = ref()
    const pauTotal = ref()
    const boutique = ref()
    const dateDebut = ref("")
    const dateFin = ref("")
    const totalTTC = ref("")
    const { makeDocument } = genererPDF()
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

    const { receptionError,stock, getStock, updateStock } = receptionArticles()

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

    const getBoutique = (id) =>{
      boutique.value = listeBoutiques.value.filter(boutique =>{
        return boutique.id == id
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

    watch(boutiqueVente, async()=>{
        if(boutiqueVente.value =='') {
            return
        }
        getBoutique(boutiqueVente.value)
        await getStock(boutiqueVente.value)
        await loadBoutiqueVentes()
        // console.log("dettes : ", listeDettes.value)
        getDetteBoutique()
        getRapport()
        // console.log("Dette boutiques : ", filteredDettes.value)
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

    const getDettes = async () =>{
        const docRef =  collection(db, "dettes")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            listeDettes.value = snap.docs.map(doc =>{
                //doc.data().createdAt = doc.data().createdAt.seconds
                return {...doc.data(), id : doc.id}
            })
        // console.log("solde : ", listeDettes.value)
        })
    }

    const getDetteBoutique = () => {
        montantTotalDettes.value = 0
        filteredDettes.value = listeDettes.value.filter(dette => {
            return dette.boutiqueVente == boutiqueVente.value
        })
        filteredDettes.value.map(dette => {
            montantTotalDettes.value +=  Number(dette.montantDette)
        })
    }

    const getRapport = () => {
      pvuTotal.value = 0
      pauTotal.value=0
      listeArticles.value.forEach(article => {
        pvuTotal.value += Number(article.pvu * bringStock(article.id))
        pauTotal.value += Number(article.pau * bringStock(article.id))
      })
    }

    const pullStock =  ( id) => {
        if(stock.value ) {
        // console.log("in pullStock : ", stock.value)
            for(let element in stock.value) {
            if(element.toString() == id){
                return stock.value[element].quantiteStock
            }
            }
        }
    }

    const bringStock = (id) => {
            // quantiteStock.value =  pullStock( id) ? pullStock( id) : 0
            return  pullStock( id) ? pullStock( id) : 0
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

    const loadVentes =async () => {
        const docRef =  collection(db, "ventes")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            listeVentes.value = snap.docs.map(doc =>{
                return {...doc.data(), id : doc.id}
            })
            loadBoutiqueVentes()
            // getBoutiqueFactures()
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
      filteredvente.value.map(vente => {
        totalTTC.value += Number(vente.payer)
      })
    }

    const boutiqueSelected = (boutique) => {
      boutiqueVente.value = boutique.id
      selectedBoutique.value = boutique.designationBoutique
    //   filteredvente.value = listeVentes.value.filter(vente => {
    //     return vente.factureId == facture
    //   })
    //   getTotal()
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
      getArticles()
      await getFactures()
      await loadVentes()
      await getDettes()

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
    //   if( isAdmin) {
    //     router.push( { name: "EditProduit", params: { token: auth.currentUser.accessToken, id: id}})

    //   }else {
    //     alert("Vous n'êtes pas autorisé à effectuer cette action")
    //   }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
       alert("Vous ne pouvez pas supprimer ou modifier sur cette page")
      return
    //   if( isAdmin) {
    //       const { destroy, error } = destroyDocument()
    //       if( confirm("Voulez-vous retourner cette vente et redefinir tous le montants vendus ?? \n Cette action est definitive et irreversible !!") ) {
    //         await destroy("produits", id)

    //     }
    //     if(error.value){
    //       alert(error.value)
    //     }
    //   }else {
    //     alert("Vous n'êtes pas autorisé à effectuer cette action")
    //   }
    }
    const filteredfacture = computed( () =>{
        // console.log("factures in filtered facture fx : ", listeFactures.value)

          return listeBoutiques.value ? listeBoutiques.value.filter( (boutique) => {
            return boutique.designationBoutique.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
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
          // totalTTC : totalTTC.value.toString(),
          dateDe: dateDe,
          dateA: dateA,
          boutique: boutiqueVente.value,
          gerant: auth.currentUser.displayName
      }
      makeDocument({title : 'RAPPORT GLOBAL DE LA BOUTIQUE  ' + boutique.value[0].designationBoutique, orientation : "p", format : "a4", id : 'rapportGlobal', option: options})
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
      boutiqueSelected,
      selectedBoutique,
      loadVentes,
      dateDebut,
      dateFin,
      totalTTC,
      montantTotalDettes,
      pvuTotal,
      pauTotal,
      exportPDF,
    }
  }
}
</script>

<style>

</style>
