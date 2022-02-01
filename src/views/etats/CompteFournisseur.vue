<template>
  <div class="mx-auto py-4">
      <div class="mx-auto shadow  rounded border-b border-gray-200">
        <div class="text-center font-bold mb-2 text-lg underline title">
            GESTION DES FACTURES FOURNISSEURS IMPAYEES
        </div>
        <!-- <div class="flex justify-center items-center">
          <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div>
        </div> -->
        <div v-if="listeFacturesBoutique.length">
            <table class="table-auto  bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">N° Facture</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Fournisseurs</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Impayé</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Avance</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solvabilité</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 " :class="{ striped : n % 2 ===0}" v-for="(facture, n) in listeFacturesBoutique" :key="facture.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ formatedDate(facture.createdAt.seconds)}} </td>
                    <td class="text-left py-3 px-4 text-xs text-blue-400 underline hover:text-blue-500 cursor-pointer" title="Cliquer pour aller au payement" @click="payerFacture(facture.id)">{{ facture.id}}</td>
                    <td class="text-left py-3 px-4 text-xs">{{  getFournisseur(facture.fournisseurId) }}</td>
                    <td class="text-left py-3 px-4 text-xs font-bold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant restant">{{ formatedNumber(facture.impayer ? facture.impayer : 0) }}</td>

                    <td class="text-left py-3 px-4 text-xs font-bold hover:text-pink-300 cursor-pointer" title="Montant restant">{{ formatedNumber(bringAvance(facture.fournisseurId)) }}</td>

                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" >edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }">delete</span>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
        <div class="flex justify-center mb-1" v-if="listeFacturesBoutique.length">
            <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700" @click="exportPDF">Imprimer la liste</button>
        </div>
        <!-- Liste à Imprimer -->
        <div v-if="listeFacturesBoutique.length" class="hidden">
            <table class="min-w-full bg-white divider-y divide-gray-400" id="listeImpayer">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">N° Facture</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Fournisseurs</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Impayé</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Avance</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(facture, n) in listeFacturesBoutique" :key="facture.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ formatedDate(facture.createdAt.seconds)}} </td>
                    <td class="text-left py-3 px-4 text-xs text-blue-400 underline hover:text-blue-500 cursor-pointer" title="Cliquer pour aller au payement" @click="payerFacture(facture.id)">{{ facture.id}}</td>
                    <td class="text-left py-3 px-4 text-xs">{{  getFournisseur(facture.fournisseurId) }}</td>
                    <td class="text-left py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant restant">{{ (facture.impayer ? facture.impayer : 0) }}</td>
                    <td class="text-left py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant restant">{{ bringAvance(facture.fournisseurId) }}</td>
                    <!-- <td class="text-left py-3 px-4 text-xs font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû" >0</td> -->
                  </tr>
                </tbody>
                  <tfoot>
                    <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="4">Totaux </td>
                        <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPVU)}} </td> -->
                        <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td> -->
                        <td class=" py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalImpayer)}} </td>
                        <td class=" py-3 px-4 text-sm  font-bold uppercase" ></td>
                    </tr>
                </tfoot>

            </table>
        </div>
        <div v-else>
          <Spinner />
        </div>

      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import { auth, db } from "../../firebase/config"
import getUser from "../../controllers/getUser"
import getDocument from "../../controllers/getDocument"
import destroyDocument from "../../controllers/destroyDocument"
import { useRoute, useRouter } from 'vue-router'
import { onMounted, watch } from '@vue/runtime-core'
import Spinner from "../../components/Spinner.vue"
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import genererPDF from '../../controllers/genererPDF';
import avancesFournisseur from '../../controllers/avanceFournisseurs';
export default {
  components: { Spinner },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const nom = ref('')
    const listeBoutiques = ref(null)
    const boutiqueVente = ref('')
    const prenom = ref('')
    const documents = ref([])
    const listeFactures = ref([])
    const listeFacturesBoutique = ref([])
    const listeFournisseurs = ref([])
    const soldeFournisseurs = ref([])
    const getError = ref('')
    const totalImpayer = ref('')
    const searchQuery = ref("")
    const editclientId = ref(null)
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

    const { makeDocument } = genererPDF()
    const { getAvances, avnc } = avancesFournisseur()

    const formatedNumber = (strNumber) => {
      return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
    }

    const formatedDate = (strDate) => {
        return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

    }

    const numberFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'GNF',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    })


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
          return boutique.gerantBoutique.toString().includes(auth.currentUser.email)// == auth.currentUser.email
      })
    })


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

    const loadFactures =async () => {
        const docRef =  collection(db, "facturesFournisseurs")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            documents.value = snap.docs.map(doc =>{
                return {...doc.data(), id : doc.id}
            })

            // listeFactures.value = documents.value
            // listeFacturesBoutique.value = listeFactures.value
        })
    }

    const loadFournisseurs = async () => {
      const docRef =  collection(db, "fournisseurs") // docs to fetch in firebase
              const q = query( docRef, orderBy("createdAt", "desc"))
              const res = onSnapshot(q, ( snap ) =>{
                  listeFournisseurs.value = snap.docs.map(doc =>{
                      // console.log("Data : ", doc.data())
                      return {...doc.data(), id : doc.id}
                  })
              })
    }

    const detailDette = (fournisseur) => {
      if( fournisseur.solvabilite <= 0 ) {
        alert("Aucun detail à afficher le solde vaut 0 ")
        return
      }
      // console.log("Detail id : ", client.id)
      router.push( { name: "DetailDette", params: { token: auth.currentUser.accessToken, id: fournisseur.id }})
    }

    const payerFacture = (idfacture) => {
      router.push({ name: 'AdminNewCommande', params: { token: auth.currentUser.accessToken, id: idfacture}})
    }

    const getFournisseur = (id) => {
      let info
      if(id) {
        listeFournisseurs.value.forEach(fournisseur => {
          // console.log("params : ", client.id, " =>", id , client.id==id)
          if(fournisseur.id === id) {
            info = fournisseur.nom +" " + fournisseur.prenom
          }
        })
        return info
      }else return "Inconnue"
    }

    const bringAvance = (id) => {
      let av = 0
      avnc.value.map(avance => {
        if(avance.id == id ){
          av = avance.montantAvance
        }
      })
      return av
    }

    watch(boutiqueVente, async()=>{
        if(boutiqueVente.value =='') {
            return
        }
        // console.log("boutique : ", listeFactures.value.length, listeFactures.value)
        listeFacturesBoutique.value = listeFactures.value.filter(facture => {
          // console.log("facture :: ", facture.boutiqueId, boutiqueVente.value)
          return facture.boutiqueId == boutiqueVente.value
        })
    })

    watch(documents, () => {

        if(documents.value.length ) {
          const lstFact = listeFactures
        // Calculer le solde total par facture
            documents.value.map(facture => {
                let soldeTotal =0
                facture.articles.forEach(solde => {
                    soldeTotal += Number(solde.pvu * solde.qtecmd)
                })
                facture.total = soldeTotal
                // Total dette de la facture
                soldeFournisseurs.value.forEach(solde => {
                    if(solde.factureId == facture.id) {
                        facture.impayer = solde.montantDette
                    }
                })
                // facture.client = getFournisseur(facture.clientId)
            })
            listeFacturesBoutique.value = documents.value.filter(facture => {
              return facture.impayer >0
            })
            // listeFacturesBoutique.value = listeFactures.value
            totalImpayer.value = 0
            listeFacturesBoutique.value.map(fact => {
              totalImpayer.value += fact.impayer
            })
        }

    })

    onMounted( async () => {
    //   getBoutiques()
      await loadFournisseurs()
      await getSolde()
      await loadFactures()
      await getAvances()
      //console.log(" clients : ", documents.value)
    })

    const isAdmin = ref(async () =>{
      const { findUser, error, user } = getUser()
      let _user = auth.currentUser
      //console.log("userssss : ", _user.uid)
      if(_user) {
          await findUser(_user.uid)
          //console.log("requireAuthAdmin : ", user.value.fonction)
          if(user.value.fonction !== 'Administrateur'){
            // alert("Vous n'êtes pas autorisé à aller sur cette page ")
            return false

          } else {
            return true
          }
        }else {
          router.push({ name: "Home"})
        }

    })

    const toggleForm = () => {
        document.querySelector(".create").classList.toggle("open")
        // document.querySelectorAll(".create .modal").forEach(form => {
        //     form.classList.add("active")
        // })
    }

    const edit = (id) => {
      //console.log(" id :::: ",id)
      if( isAdmin) {
        // router.push( { name: "EditClient", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }

    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet client et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            // await destroy("clients", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }

    const filteredFournisseurs = computed( () =>{
          return documents.value ? documents.value.filter( (client) => {
            return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }) : []
    })

    const exportPDF = () => {
    /// Generate facture in pdf
      let options = {
          totalTTC : totalImpayer.value.toString(),
          boutique: boutiqueVente.value,
          gerant: auth.currentUser.displayName
      }
      makeDocument({title : 'LISTE DES FACTURES FOURNISSEUR IMPAYEES  ' , orientation : "l", format : "a4", id : 'listeImpayer', option: options})
        /// End of Generate facture in pdf
    }


    return {
      auth,
      totalImpayer,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      listeFactures,
      listeFacturesBoutique,
      document,
      getError,
      searchQuery,
      filteredFournisseurs,
      filteredBoutiques,
      boutiqueVente,
      editclientId,
      soldeFournisseurs,
      formatedNumber,
      formatedDate,
      detailDette,
      getFournisseur,
      payerFacture,
      nom,
      prenom,
      exportPDF,
      numberFormatter,
      bringAvance,
    }
  }
}
</script>

<style>

</style>
