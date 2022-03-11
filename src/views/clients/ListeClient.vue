<template>
  <div class="md:px-2 py-8 mx-auto">
      <!-- <AddClient /> -->
      <div class="shadow  rounded border-b border-gray-200">

        <h2 class="font-bold text-xl pt-2">GESTION DES CLIENTS</h2>
        <div class="flex justify-between items-center">
          <div class="searchbar mx-1 w-2/4 flex justify-start ">
            <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
            <span class="material-icons -mx-9 p-4">
                  search
            </span>
          </div>
          <div>
            <button class="my-0 mx-2 py-0 flex justify-between items-center" @click="toggleForm"><span class="material-icons text-center py-1 m-0">add</span>Ajouter</button>

          </div>
        </div>

        <div v-if="filteredClients.length">
            <table class="table-auto bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Prénoms</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solvabilité</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 " :class="{ striped : n % 2 ===0}" v-for="(client, n) in filteredClients" :key="client.id">
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ client.nom}} </td>
                    <td class="text-left text-xs py-3 px-2">{{ client.prenom}}</td>
                    <td class="text-left text-xs py-3 px-2">{{ client.contact}}</td>
                    <td class="text-left text-xs py-3 px-2">{{ client.adresse }}</td>
                    <td class="text-center text-xs py-3 px-2 font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer " title="Montant Total en dette" @click="detailDette(client)">{{ formatedNumber(client.solvabilite ? client.solvabilite : 0) }}</td>
                    <td class="text-left text-xs py-3 px-2 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" @click="edit(client.id)" title="Modifier le client">edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(client.id)" title="Supprimer le client">delete</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-b border-gray-400 bg-gray-300">
                      <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="5">Totaux </td>
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPAU)}} </td> -->
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td> -->
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ formatedNumber(totalTTC ? totalTTC : 0)}} </td>
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" > </td>
                  </tr>
                </tfoot>
            </table>
        </div>
        <div class="flex justify-center mb-1" v-if="filteredClients.length">
          <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700" @click="exportPDF">Imprimer la liste</button>
        </div>
        <!-- A Imprimer -->
        <div v-if="filteredClients.length" hidden>
            <table class="min-w-full bg-white divider-y divide-gray-400" id="client">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Prénoms</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solvabilité</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th> -->
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(client, n) in filteredClients" :key="client.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ client.nom}} </td>
                    <td class="text-left py-3 px-4">{{ client.prenom}}</td>
                    <td class="text-left py-3 px-4">{{ client.contact}}</td>
                    <td class="text-left py-3 px-4">{{ client.adresse }}</td>
                    <td class="text-left py-3 px-4 font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû" @click="detailDette(client)">{{ numberFormatter.format(client.solvabilite ? client.solvabilite : 0) }}</td>

                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-b border-gray-400 bg-gray-300">
                      <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="5">Totaux </td>
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPAU)}} </td> -->
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td> -->
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalTTC ? totalTTC : 0  )}} </td>
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
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import { useRouter } from 'vue-router'
import { onMounted, watch } from '@vue/runtime-core'
import AddClient from "./NewClient.vue"
import Spinner from "../../components/Spinner.vue"
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import genererPDF from '../../controllers/genererPDF';
export default {
  components: { AddClient, Spinner },
  setup() {
    const router = useRouter()
    const documents = ref([])
    const soldeClients = ref([])
    const getError = ref('')
    const searchQuery = ref("")
    const editclientId = ref(null)
    const totalTTC = ref(null)

    const numberFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'GNF',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

    const { makeDocument } = genererPDF()

    const formatedNumber = (strNumber) => {
      return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
    }
    const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

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
        })
    }
    const loadClients =async () => {
        const docRef =  collection(db, "clients")
        const q = query( docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, ( snap ) =>{
            // console.log("snap vente", snap.docs)
            documents.value = snap.docs.map(doc =>{
                //doc.data().createdAt = doc.data().createdAt.seconds
                  //console.log("Data : ", doc.id, " => ", doc.data().createdAt)

                return {...doc.data(), id : doc.id}
            })
        })
    }
    const detailDette = (client) => {
      if( client.solvabilite <= 0 ) {
        alert("Aucun detail à afficher le solde crédit vaut 0 ")
        return
      }
      // console.log("Detail id : ", client.id)
      router.push( { name: "DetailDette", params: { token: auth.currentUser.accessToken, id: client.id }})
    }

    watch(documents, () => {
      // console.log("watch doc : ", documents.value.length, soldeClients.value.length)
      // Calculer le solde total par client
      if(soldeClients.value.length ) {
        documents.value.map(client => {
          let soldeTotal =0
          soldeClients.value.forEach(solde => {
            // console.log("dette : ", solde.montantDette, solde.clientId, soldeClients.value.length)
            if( solde.clientId == client.id ) {
              // console.log("dette clt : ", solde.montantDette)
              soldeTotal += solde.montantDette
              totalTTC.value += solde.montantDette
            }
          })
          client.solvabilite = soldeTotal
          // console.log("Solde client : ", client)
        })
      }

    })

    onMounted( async () => {
       await getSolde()
      await loadClients()
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
       router.push({ name: "AddClient", params: { token: auth.currentUser.accessToken}})
        // document.querySelector(".create").classList.toggle("open")
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

    const exportPDF = () => {
      let options = {
          // totalTTC : totalTTC.value.toString(),
          // totalPAU : totalPAU.value,
          // totalQte : totalQte.value,
          // dateDe: dateDe,
          // dateA: dateA,
          // facture: factureSelected.value,
          gerant: auth.currentUser.displayName
      }
      makeDocument({title : 'LISTE DES CLIENTS  '  , orientation : "p", format : "a4", id : 'client', option: options})
    }
    return {
      auth,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      getError,
      searchQuery,
      filteredClients,
      editclientId,
      soldeClients,
      totalTTC,
      formatedDate,
      formatedNumber,
      numberFormatter,
      detailDette,
      exportPDF,
    }
  }
}
</script>

<style>

</style>
