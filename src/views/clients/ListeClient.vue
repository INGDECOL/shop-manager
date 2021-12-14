<template>
  <div class="md:px-2 py-8 w-full">
      <AddClient />
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
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
            <table class="min-w-full bg-white divider-y divide-gray-400">
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
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(client, n) in filteredClients" :key="client.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ client.nom}} </td>
                    <td class="text-left py-3 px-4">{{ client.prenom}}</td>
                    <td class="text-left py-3 px-4">{{ client.contact}}</td>
                    <td class="text-left py-3 px-4">{{ client.adresse }}</td>
                    <td class="text-left py-3 px-4 font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû">{{ formatedNumber(client.solvabilite) }}</td>
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" @click="edit(client.id)" title="Modifier le client">edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(client.id)" title="Supprimer le client">delete</span>
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
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import { useRouter } from 'vue-router'
import { onMounted, watch } from '@vue/runtime-core'
import AddClient from "./NewClient.vue"
import Spinner from "../../components/Spinner.vue"
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
export default {
  components: { AddClient, Spinner },
  setup() {
    const router = useRouter()
    const documents = ref([])
    const soldeClients = ref([])
    const getError = ref('')
    const searchQuery = ref("")
    const editclientId = ref(null)

  const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
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
      console.log("solde : ", soldeClients.value)
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
  // watch(soldeClients, () => {
  //   console.log("watch solde : ", documents.value.length, soldeClients.value.length)
  // })
  watch(documents, () => {
    console.log("watch doc : ", documents.value.length, soldeClients.value.length)
    // Calculer le solde total par client
    if(soldeClients.value.length ) {
      documents.value.map(client => {
        let soldeTotal =0
        soldeClients.value.forEach(solde => {
          if( solde.clientId == client.id ) {
            console.log("corespondance")
            soldeTotal += solde.montantDette
          }
        })
        client.solvabilite = soldeTotal
        console.log("Solde client : ", client)
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
      formatedNumber,
    }
  }
}
</script>

<style>

</style>
