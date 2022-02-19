<template>
  <div class="md:px-2 py-8 items-center mx-auto">
      <!-- <Newdepense /> -->
      <div class="shadow  rounded border-b border-gray-200">
          <h3 class="text-center font-bold uppercase text-xl mt-2 pt-3">Liste des depenses effectuées</h3>
        <div class="flex justify-between items-center">
          <div class="searchbar mx-1 w-2/4 flex justify-start  ">
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
            <table class="table-auto bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th><th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Intitulé</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Montant</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Demandeur</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(depense, n) in filteredDepenses" :key="depense.id">
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ formatedDate(depense.dateDepense)}} </td>
                    <td class="text-left text-xs py-3 px-2">{{ depense.intitule}}</td>
                    <td class="text-center text-xs py-3 px-2">{{ simpleNumberFormatter.format(depense.montantDepense)}}</td>
                    <td class="text-left text-xs py-3 px-2">{{ depense.depenseDestinataire }}</td>
                    <!-- <td class="text-left text-xs py-3 px-2 text-blue-400 underline cursor-pointer">{{ depense.email }}</td> -->
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " title="Modifier" :class="{ disabled: !isAdmin }" @click="edit(depense.id)">edit</span>
                      <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(depense.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                    <!-- Compte gestion -->
                    <tr class="border-b border-gray-400 bg-gray-300">
                        <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="3">Total des depenses</td>
                        <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalDepense)}}</td>
                        <td class=" py-3 px-4 text-sm  text-center font-bold uppercase" colspan="2"></td>
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
import { auth } from "../../firebase/config"
import getUser from "../../controllers/getUser"
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import { useRouter } from 'vue-router'
import Spinner from "../../components/Spinner.vue"
import { onMounted, watch } from '@vue/runtime-core';
export default {
  components: {  Spinner },
  setup() {
    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const editDepenseId = ref(null)
    const totalDepense = ref(0)
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }


    const formatedDate = (strDate) => {
      return new Date(strDate  ).toLocaleDateString(undefined, options)

    }
    const numberFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'GNF',

    })
    const simpleNumberFormatter = new Intl.NumberFormat('de-DE', {
        // style: 'currency',
        // currency: 'GNF',

    })


    onMounted( async () => {
      await load("depenses")
      //console.log(" depenses : ", documents.value)
    })

    watch( documents, () => {
      totalDepense.value = 0
      documents.value.map(dette => {
        totalDepense.value += dette.montantDepense
      })
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
      router.push({ name: "NewDepense", params: { token: auth.currentUser.accessToken}})
    }

        // const filteredDepenses = computed(()=>{
        //     return documents.value && documents.value.filter((depense)=>{
        //         return depense.designation.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
        //     })
        // })


    const edit = (id) => {
      //console.log(" id :::: ",id)
      return
    //   if( isAdmin) {
    //     router.push( { name: "Editdepense", params: { token: auth.currentUser.accessToken, id: id}})

    //   }else {
    //     alert("Vous n'êtes pas autorisé à effectuer cette action")
    //   }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cette depense ?? Cette action est definitive et irreversible !!") ) {
            await destroy("depenses", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredDepenses = computed( () =>{

          return documents.value ? documents.value.filter( (depense) => {
            return depense.intitule.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
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
      filteredDepenses,
      editDepenseId,
      formatedDate,
      numberFormatter,
      simpleNumberFormatter,
      totalDepense,
    }
  }
}
</script>

<style>

</style>
