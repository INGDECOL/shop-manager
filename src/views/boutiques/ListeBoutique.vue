<template>
  <div class="md:px-2 py-8 w-full">
      <AddBoutique />
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
        <div v-if="filteredBoutiques.length">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Désignation</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Gérant(e) principal(e)</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(boutique, n) in filteredBoutiques" :key="boutique.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ boutique.designationBoutique}} </td>
                    <td class="text-left py-3 px-4">{{ boutique.gerantBoutique}}</td>
                    <!-- <td class="text-left py-3 px-4">{{ boutique.contact}}</td>
                    <td class="text-left py-3 px-4">{{ boutique.adresse }}</td>
                    <td class="text-left py-3 px-4 text-blue-400 underline cursor-pointer">{{ client.email }}</td> -->
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" @click="edit(boutique.id)">edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(boutique.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
        <div class="flex justify-center mb-1" v-if="filteredBoutiques.length">
          <button class="bg-transparent border border-green-400 hover:bg-green-400 hover:text-gray-700" @click="exportPDF">Imprimer la liste</button>
        </div>

        <!-- A Imprimer -->
        <div v-if="filteredBoutiques.length" class="hidden">
            <table class="min-w-full bg-white divider-y divide-gray-400" id="boutique">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Désignation</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Gérant(e) principal(e)</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th> -->
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(boutique, n) in filteredBoutiques" :key="boutique.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ boutique.designationBoutique}} </td>
                    <td class="text-left py-3 px-4">{{ boutique.gerantBoutique}}</td>

                    <!-- <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" @click="edit(boutique.id)">edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(boutique.id)">delete</span>
                    </td> -->
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
import { onMounted } from '@vue/runtime-core'
import AddBoutique from "./NewBoutique.vue"
import Spinner from "../../components/Spinner.vue"
import { collection, onSnapshot } from '@firebase/firestore';
import genererPDF from '../../controllers/genererPDF';

export default {
  components: { AddBoutique, Spinner },
  setup() {

    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const listeBoutiques = ref(null)
    const editboutiqueId = ref(null)
    const { makeDocument } = genererPDF()

    onMounted( async () => {
      //await load("boutiques")
      const docRef = collection(db, "boutiques")
            const res = onSnapshot(docRef, (snap)=>{
                listeBoutiques.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })
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
        router.push( { name: "EditBoutique", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet client et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            await destroy("boutiques", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }

    const filteredBoutiques = computed(  () =>{

          return listeBoutiques.value ? listeBoutiques.value.filter( (boutique) => {
              //console.log("dddddddddddd : ", boutique)
            return boutique.designationBoutique.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
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
      makeDocument({title : 'LISTE DES BOUTIQUES  '  , orientation : "p", format : "a4", id : 'boutique', option: options})
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
      filteredBoutiques,
      editboutiqueId,
      exportPDF,
    }
  }
}
</script>

<style>

</style>
