<template>
  <div class="md:px-2 py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="text-center font-bold mb-2 text-lg underline title">
            GESTION DES COMPTES CLIENTS
        </div>
        <!-- <div class="flex justify-center items-center">
          <div class="mr-2 pr-2.5">
                  <select name="magasin"  id="magasin" v-model="boutiqueVente" class=" font-bold mr-2 pr-2.5 cursor-pointer"  required title="Magasin">
                      <option value="">Selectionner la boutique</option>
                      <option v-for="boutique in filteredBoutiques" :key="boutique.id" :value="boutique.id">{{ boutique.designationBoutique }}</option>
                  </select>
              </div>
        </div> -->
        <div v-if="listeFacturesBoutique">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">N° Facture</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Client</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Impayé</th> -->
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Compte</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solvabilité</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(client, n) in listeFacturesBoutique" :key="client.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <!-- <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ formatedDate(client.createdAt.seconds)}} </td> -->
                    <td class="text-left py-3 px-4 text-xs text-blue-400 underline hover:text-blue-500 cursor-pointer uppercase" title="Cliquer pour aller au depôt" @click="depotAvance(client.id)">{{  client.nom + " " + client.prenom }}</td>
                    <!-- <td class="text-left py-3 px-4 text-xs">{{  client.nom + " " + client.prenom }}</td> -->
                    <!-- <td class="text-left py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant en Dette">{{ formatedNumber(facture.impayer ? facture.impayer : 0) }}</td> -->
                    <td class="text-center py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant en compte">{{ formatedNumber(bringAvance(client.id)) }}</td>
                    <!-- <td class="text-left py-3 px-4 text-xs font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû" >0</td> -->
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons text-blue-500" :class="{ disabled: !isAdmin }" title="Aller au depôt" @click="depotAvance(client.id)">euro</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(client.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-b border-gray-400 bg-gray-300">
                      <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="2">Totaux </td>
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPAU)}} </td> -->
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td> -->
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ formatedNumber(totalAvance ? totalAvance  : 0)}} </td>
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" > </td>
                  </tr>
                </tfoot>
            </table>
        </div>
        <div v-else>
          <p class="text-center">Aucune donnée trouvée pour le moment</p>
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
import avancesClient from '../../controllers/avanceClients';
export default {
  components: { Spinner },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const nom = ref('')
    const listeBoutiques = ref(null)
    const boutiqueVente = ref('')
    const idBoutiqueVente = ref("1v5aR0zlptk0d5joyp6r")
    const prenom = ref('')
    const documents = ref([])
    const listeFactures = ref([])
    const listeFacturesBoutique = ref([])
    const listeClients = ref([])
    const soldeClients = ref([])
    const getError = ref('')
    const totalAvance = ref(0)
    const searchQuery = ref("")
    const editclientId = ref(null)
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }
    const { getAvances, getAvance, avnc } = avancesClient()

  const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
  }

  const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

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
        return boutique.gerantBoutique.toString().includes(auth.currentUser.email)// == auth.currentUser.email
    })
  })


  const getSolde = async () =>{
    const docRef =  collection(db, "dettes")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          soldeClients.value = snap.docs.map(doc =>{
              //doc.data().createdAt = doc.data().createdAt.seconds
              return {...doc.data(), id : doc.id}
          })
      // console.log("solde : ", soldeClients.value)
      })
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

  const loadFactures =async () => {
      const docRef =  collection(db, "factures")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          documents.value = snap.docs.map(doc =>{
              return {...doc.data(), id : doc.id}
          })
          // listeFacturesBoutique.value = documents.value.filter(facture => {
         //   return facture.impayer >0 && facture.boutiqueId == boutiqueVente.value
          //})
      //     listeFacturesBoutique.value = listeFactures.value.filter(facture => {
      //   // console.log("facture :: ", facture.boutiqueId, boutiqueVente.value)
      //   return facture.boutiqueId == boutiqueVente.value
      // })
      })
  }

  const loadClients = async () => {
    const docRef =  collection(db, "clients") // docs to fetch in firebase
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeClients.value = snap.docs.map(doc =>{
                    // console.log("Data : ", doc.data())
                    return {...doc.data(), id : doc.id}
                })
            })
  }

  const detailDette = (client) => {
    if( client.solvabilite <= 0 ) {
      alert("Aucun detail à afficher le solde vaut 0 ")
      return
    }
    // console.log("Detail id : ", client.id)
    router.push( { name: "DetailDette", params: { token: auth.currentUser.accessToken, id: client.id }})
  }

  const depotAvance = (idClient) => {
    router.push({ name: 'DepotClient', params: { token: auth.currentUser.accessToken, id: idClient}})
  }

  const getClient = (id) => {
    let info
    if(id) {
      listeClients.value.forEach(client => {
        // console.log("params : ", client.id, " =>", id , client.id==id)
        if(client.id === id) {
          info = client.nom +" " + client.prenom
        }
      })
      return info
    }else return "Inconnue"
  }

  watch(boutiqueVente, async()=>{
      if(boutiqueVente.value =='') {
          return
      }
      // console.log("boutique : ", boutiqueVente.value, documents.value)
      // listeFacturesBoutique.value = documents.value.filter(facture => {
      //   console.log("ids : ", facture.boutiqueId ,"==>", boutiqueVente.value, facture.clientId)
      //       return facture.boutiqueId == boutiqueVente.value
      // })
  })

  watch(listeClients, () => {
      // console.log("watch doc : ", listeClients.value.length, soldeClients.value.length)

          listeFacturesBoutique.value = listeClients.value
          totalAvance.value = 0
          listeFacturesBoutique.value.map(client => {
            // console.log("avanc : ", bringAvance(client.id), client.nom)
            totalAvance.value += bringAvance(client.id)
          })
          // console.log("listeFacturesBoutique : ", totalAvance.value)
      // }

  })

    onMounted( async () => {
      getBoutiques()
      await getSolde()
      await loadClients()
      await loadFactures()
      await getAvances()
      boutiqueVente.value = idBoutiqueVente.value
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
          if( confirm("Voulez-vous supprimer cette facture ?? Elle ne sera plus comptabilisée \n Cette action est definitive et irreversible !!") ) {
            await destroy("factures", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredClients = computed( () =>{
          return documents.value ? documents.value.filter( (client) => {
            return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }) : []
    })

    return {
      auth,
      totalAvance,
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
      filteredClients,
      filteredBoutiques,
      boutiqueVente,
      editclientId,
      soldeClients,
      formatedNumber,
      formatedDate,
      detailDette,
      getClient,
      depotAvance,
      nom,
      prenom,
      bringAvance,
    }
  }
}
</script>

<style>

</style>
