<template>
  <div class="md:px-2 py-8 w-full">
      <!-- <NewProduit /> -->
      <div class="shadow  rounded border-b border-gray-200">
        <h2 class="font-bold text-xl pt-2">LISTE DES PRODUITS</h2>
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
            <table class="table-auto bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Désignation</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Famille</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Stock</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">PVU</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Fournisseur</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(produit, n) in filteredproduits" :key="produit.id">
                    <td class="text-left text-sm py-3 px-4 font-semibold uppercase">{{ n + 1 }} </td>
                    <td class="text-left text-sm py-3 px-4 font-semibold uppercase">{{ produit.designation}} </td>
                    <td class="text-left text-sm py-3 px-4">{{ produit.codeFamille}}</td>
                    <td class="text-left text-sm py-3 px-4">{{ produit.quantite}}</td>
                    <td class="text-left text-sm py-3 px-4">{{ produit.pvu }}</td>
                    <td class="text-left text-sm py-3 px-4 text-blue-400 underline cursor-pointer" :title="getFournisseur(produit.fournisseurId)">{{ produit.fournisseurId }}</td>
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " title="Modifier" :class="{ disabled: !isAdmin }" @click="edit(produit.id)">edit</span>
                      <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(produit.id)">delete</span>
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
import getDocuments from "../../controllers/getDocuments"
import destroyDocument from "../../controllers/destroyDocument"
import { useRouter } from 'vue-router'
import NewProduit from "./NewProduit.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted } from '@vue/runtime-core';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from '@firebase/firestore';
export default {
  components: { NewProduit, Spinner },
  setup() {
    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const editproduitId = ref(null)
    const listeFournisseurs = ref([])

    onMounted( async () => {
      await load("produits")
      await loadFournisseur()
      // getFournisseur("hrFBd6hzdLQvUqFQaVDk")
      // console.log("fournisseur with id : ", getFournisseur("hrFBd6hzdLQvUqFQaVDk"))
      //console.log(" produits : ", documents.value)
    })
    const loadFournisseur =async () => {
      const docRef =  collection(db, "fournisseurs") // docs to fetch in firebase
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeFournisseurs.value = snap.docs.map(doc =>{
                    // console.log("Data : ", doc.data())
                    return {...doc.data(), id : doc.id}
                })
            })
    }

    const getFournisseur =  (id) => {
      let info
      if(id) {
        listeFournisseurs.value.forEach(fournisseur => {
          if(fournisseur.id === id) {
            info = fournisseur.nom +" " + fournisseur.prenom
          }
        })
        return info
        } else return " Inconue"
      //  }
    }

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
        router.push( { name: "NewProduit", params: { token: auth.currentUser.accessToken}})
        }

    const edit = (id) => {
      //console.log(" id :::: ",id)
      if( isAdmin) {
        router.push( { name: "EditProduit", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet produit et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            await destroy("produits", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredproduits = computed( () =>{
          return documents.value ? documents.value.filter( (produit) => {
            return produit.designation.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }): []

    })



    return {
      auth,
      isAdmin,
      edit,
      getFournisseur,
      destroy,
      toggleForm,
      documents,
      getError,
      searchQuery,
      filteredproduits,
      editproduitId,
    }
  }
}
</script>

<style>

</style>
