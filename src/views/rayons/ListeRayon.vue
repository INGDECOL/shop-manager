<template>
  <div class="md:px-2 py-8 w-full">
      <NewRayon />
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
        <div v-if="documents.length">
          <table class="min-w-full bg-white divider-y divide-gray-400" >
              <thead class="bg-gray-800 text-white">
                <tr >
                  <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                  <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Designation</th>
                  <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                  <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(rayon, n) in filteredRayons" :key="rayon.id">
                  <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1 }} </td>
                  <td class="text-left py-3 px-4">{{ rayon.rayon}}</td>
                  <td class="text-left py-3 px-4">{{ rayon.description}}</td>
                  <td class="text-left py-3 px-4 flex justify-between items-center">
                    <span class="material-icons " title="Modifier " :class="{ disabled: !isAdmin }" @click="edit(rayon.id)">edit</span>
                    <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(rayon.id)">delete</span>
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
import { auth } from "../../firebase/config"
import getUser from "../../controllers/getUser"
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import { useRouter } from 'vue-router'
import NewRayon from "./NewRayon.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted } from '@vue/runtime-core';
export default {
  components: { NewRayon, Spinner },
  setup() {
    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const editrayonId = ref(null)
    // onMounted( async () => {
      const l = async () => await load("rayons")
      //console.log(" rayons : ", documents.value)
    // })
    l()
    const isAdmin = ref(async () =>{
      const { findUser, error, user } = getUser()
      let _user = auth.currentUser
      //console.log("userssss : ", _user.uid)
      if(_user) {
          await findUser(_user.uid)
          // console.log("requireAuthAdmin : ", user.value.fonction)
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
      // console.log(" id :::: ",id)
      if( isAdmin) {
        router.push( { name: "EditRayon", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      // console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet rayon et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            await destroy("rayons", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredRayons = computed( () =>{
          return documents.value ? documents.value.filter( (rayon) => {
            return rayon.rayon.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []

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
      filteredRayons,
      editrayonId,
    }
  }
}
</script>

<style>

</style>
