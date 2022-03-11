<template>
  <div class="md:px-2 py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="text-center font-bold mb-2 text-lg underline">
            Liste des factures du client {{ nom.toUpperCase() +" " + prenom}}
        </div>
        <div v-if="listeFactures.length">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">N° Facture</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Total</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Impayé</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solvabilité</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(facture, n) in listeFactures" :key="facture.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ formatedDate(facture.createdAt.seconds)}} </td>
                    <td class="text-left py-3 px-4 text-xs">{{ facture.id}}</td>
                    <td class="text-left py-3 px-4 text-xs">{{ formatedNumber(facture.total) }}</td>
                    <td class="text-left py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant restant">{{ facture.impayer ? formatedNumber(facture.impayer) : formatedNumber(0) }}</td>
                    <!-- <td class="text-left py-3 px-4 text-xs font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû" >0</td> -->
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons text-blue-400" :class="{ disabled: !isAdmin }" @click="payerFacture(facture.id)">euro</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }">delete</span>
                    </td>
                  </tr>
                </tbody>
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
export default {
  components: { Spinner },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const nom = ref('')
    const prenom = ref('')
    const documents = ref([])
    const listeFactures = ref([])
    const soldeClients = ref([])
    const getError = ref('')
    const searchQuery = ref("")
    const editclientId = ref(null)
    const { document, load } = getDocument()
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }



  const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
  }

    const formatedDate = (strDate) => {
        return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

    }

  const payerFacture = (idfacture) => {
    router.push({ name: 'RemboursementClient', params: { token: auth.currentUser.accessToken, id: idfacture}})
  }

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
  const loadFactures =async () => {
      const docRef =  collection(db, "factures")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          documents.value = snap.docs.map(doc =>{
              return {...doc.data(), id : doc.id}
          })
          listeFactures.value = documents.value.filter(facture => {
            //   console.log("list fact : ", facture, facture.clientId == route.params.id, facture.clientId, " =>", route.params.id)
              return facture.clientId == route.params.id
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

    watch(listeFactures, () => {
        // console.log("watch doc : ", listeFactures.value.length, soldeClients.value.length)
        if(listeFactures.value.length ) {
        // Calculer le solde total par facture
            listeFactures.value.map(facture => {
                let soldeTotal =0
                facture.articles.forEach(solde => {
                    soldeTotal += Number(solde.pvu * solde.qtecmd)

                })
                facture.total = soldeTotal
                // console.log("total facture: ", soldeTotal, facture)

                // Total dette de la facture
                soldeClients.value.forEach(solde => {
                    if(solde.factureId == facture.id) {
                        facture.impayer = solde.montantDette
                    }
                })
                // console.log("Solde client : ", facture, listeFactures.value.length)
            })
        }

    })

    onMounted( async () => {
        await load("clients", route.params.id)
        // console.log("route : ", route.params.id)
        if( document.value) {
            nom.value = document.value.nom
            prenom.value = document.value.prenom
            // adresse.value = document.value.adresse
            // contact.value = document.value.contact
            // email.value = document.value.email

        }
       await getSolde()
      await loadFactures()
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
        router.push( { name: "EditClient", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet client et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            await destroy("clients", id)

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
      payerFacture,
      auth,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      listeFactures,
      document,
      getError,
      searchQuery,
      filteredClients,
      editclientId,
      soldeClients,
      formatedNumber,
      formatedDate,
      detailDette,
      nom,
      prenom
    }
  }
}
</script>

<style>

</style>
