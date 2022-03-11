<template>
  <div class="md:px-2 py-8 items-center mx-auto">
      <!-- <NewFournisseur /> -->
      <div class="shadow  rounded border-b border-gray-200">
        <h2 class="font-bold text-xl pt-2">GESTION DES FOURNISSEURS</h2>
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
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th><th class="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Prénoms</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Avance</th>
                    <th class="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(fournisseur, n) in filteredFournisseurs" :key="fournisseur.id">
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left text-xs py-3 px-2 font-semibold uppercase">{{ fournisseur.nom}} </td>
                    <td class="text-left text-xs py-3 px-2">{{ fournisseur.prenom}}</td>
                    <td class="text-left text-xs py-3 px-2">{{ fournisseur.contact}}</td>
                    <td class="text-left text-xs py-3 px-2">{{ fournisseur.adresse }}</td>
                    <td class="text-center text-xs py-3 px-2 text-blue-400 underline cursor-pointer">{{ numberFormatter.format(bringAvance(fournisseur.id)) }}</td>
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " title="Modifier" :class="{ disabled: !isAdmin }" @click="edit(fournisseur.id)">edit</span>
                      <span class="material-icons text-blue-400" title="Aller au depôt" :class="{ disabled: !isAdmin }" @click="depotAvance(fournisseur.id)">euro</span>
                      <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(fournisseur.id)">delete</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-b border-gray-400 bg-gray-300">
                      <td class="text-left py-3 px-4 text-sm  font-bold uppercase" colspan="5">Totaux </td>
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalPAU)}} </td> -->
                      <!-- <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{totalQte}} </td> -->
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" >{{ numberFormatter.format(totalAvance ? totalAvance  : 0)}} </td>
                      <td class="text-center py-3 px-4 text-sm  font-bold uppercase" > </td>
                  </tr>
                </tfoot>
            </table>
        </div>
        <div v-else>
          <Spinner />
        </div>
        <!-- <h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque at aut magnam repellendus libero. Ipsa alias, qui aut perspiciatis praesentium incidunt nihil laudantium. Voluptatibus voluptatem porro quia magni, deleniti ratione odio enim qui eum fuga quidem obcaecati numquam nobis totam eligendi beatae pariatur quo cumque officia atque rerum. Alias aliquam nisi minima, ab facere reprehenderit quam, nulla soluta culpa architecto facilis ullam cupiditate ad quidem officia blanditiis error nihil sed expedita? Explicabo, doloremque iure! Harum, consequatur. Molestiae rem et magnam aut sit laboriosam dicta sint excepturi illo hic commodi labore nostrum autem quae odit, quam voluptatibus architecto blanditiis. Minima sapiente corrupti asperiores voluptas, officia esse laudantium magnam iure ducimus rem, molestias ratione dicta eum debitis ipsam quaerat, sint cupiditate enim similique hic harum obcaecati. Totam, reiciendis sapiente. Sed delectus, ad voluptatum sit aut eveniet modi. Repudiandae, quos dicta explicabo eos eius nemo quia inventore deserunt sed vel. Dolor, doloribus perferendis.</p>
        </h4> -->
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
import NewFournisseur from "./NewFournisseur.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted, watch } from '@vue/runtime-core'
import avanceFournisseurs from "../../controllers/avanceFournisseurs"
export default {
  components: { NewFournisseur, Spinner },
  setup() {
    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const editFournisseurId = ref(null)
    const totalAvance = ref(0)
    const {getAvance, avnc, avance, getAvances } = avanceFournisseurs()

    const bringAvance =  (id) => {
      let av = 0
      avnc.value.map(avance => {
        if(avance.id == id ){
          av = avance.montantAvance
        }
      })
      return av
    }

    const depotAvance = (idClient) => {
      router.push({ name: 'DepotFournisseur', params: { token: auth.currentUser.accessToken, id: idClient}})
    }

    const numberFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'GNF',
    })


    onMounted( async () => {
      await getAvances()
      await load("fournisseurs")
      //console.log(" fournisseurs : ", documents.value)
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
      router.push({ name: "NewFournisseur", params: { token: auth.currentUser.accessToken}})
    }

    const edit = (id) => {
      //console.log(" id :::: ",id)
      if( isAdmin) {
        router.push( { name: "EditFournisseur", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet fournisseur et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            await destroy("fournisseurs", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredFournisseurs = computed( () =>{

          return documents.value ? documents.value.filter( (fournisseur) => {
            return fournisseur && fournisseur.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []

    })

    watch(filteredFournisseurs , () => {
      if(!filteredFournisseurs.value) return
       totalAvance.value = 0
          filteredFournisseurs.value.map(fournisseur => {
            // console.log("avanc : ", bringAvance(client.id), client.nom)
            totalAvance.value += bringAvance(fournisseur.id)
          })
    })
    return {
      auth,
      totalAvance,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      getError,
      searchQuery,
      filteredFournisseurs,
      editFournisseurId,
      bringAvance,
      numberFormatter,
      depotAvance,
    }
  }
}
</script>

<style>

</style>
