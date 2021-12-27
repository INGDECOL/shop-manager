<template>
  <div class="md:px-2 py-8 w-full">
      <NewPersonnel />
      <Bon />
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div class="searchbar mx-1 w-2/4 flex justify-start ">
            <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
            <span class="material-icons -mx-9 p-4">
                  search
            </span>
          </div>
          <div>
            <button class="my-0 mx-2 py-0 flex justify-between items-center" @click="toggleForm('create')"><span class="material-icons text-center py-1 m-0">add</span>Ajouter</button>

          </div>
        </div>
        <div v-if="documents.length">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Nom Complet</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Contact</th>
                    <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th> -->
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Fonction</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(personnel, n) in filteredPersonnels" :key="personnel.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ personnel.nom}} </td>
                    <td class="text-left py-3 px-4">{{ personnel.phoneNumber}}</td>
                    <td class="text-left py-3 px-4 text-blue-400 underline cursor-pointer">{{ personnel.email }}</td>
                    <td class="text-left py-3 px-4">{{ personnel.fonction }}</td>
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " title="Modifier" :class="{ disabled: !isAdmin }" @click="edit(personnel.id)">edit</span>
                      <span class="material-icons text-blue-400" title="Faire un bon pour ce personnel" :class="{ disabled: !isAdmin }" @click="faireUnBon(personnel)">credit_card</span>
                      <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(personnel.id)">delete</span>
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
import NewPersonnel from "../auth/Signup.vue"
import Bon from "./Bon.vue"
import Spinner from "../../components/Spinner.vue"
import { onMounted } from '@vue/runtime-core';
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
export default {
  components: { NewPersonnel, Spinner, Bon },

  setup() {
    const router = useRouter()
    const {documents, getError, load} = getDocuments()
    const searchQuery = ref("")
    const editPersonnelId = ref(null)
    const listeSalaires = ref([])
    const listeBons = ref([])
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

    const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

    }
    const formatedNumber = (strNumber) => {
      return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
    }

    onMounted( async () => {
      await load("users")
      getSalaires()
      getBons()
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

    const toggleForm = (str) => {
        document.querySelector("." +str).classList.toggle("open")
        // document.querySelectorAll(".create .modal").forEach(form => {
        //     form.classList.add("active")
        // })
    }

    const getSalaires = () => {
      const docRef = collection(db, "salaires")
      const q = query(docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, snap => {
        listeSalaires.value = snap.docs.map(doc =>{
          return {...doc.data(), id:doc.id}
        })
      })
    }

      const getAntecedants = (id) => {
        let montanAntecedant =0
        listeBons.value.map(bon => {
          if(bon.id == id) {
            montanAntecedant += bon.montant
          }
        })
        return montanAntecedant > 0 ? montanAntecedant : 0

      }

      const getSalaire = (id) => {
        let objSalaire = {}
        listeSalaires.value.map(salaire => {
          // console.log("salaire : ", salaire)
          if(salaire.id == id) {
            objSalaire = {
               salaireBase : Number(salaire.salaireBase),
              indemnites :  Number(salaire.indemnites),
              salaireNet : formatedNumber( Number(salaire.salaireBase) + Number(salaire.indemnites) )
            }

          }
        })
          return objSalaire ? objSalaire : null


      }

    const getBons = () => {
      const docRef = collection(db, "bons")
      const q = query(docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, snap => {
        listeBons.value = snap.docs.map(doc =>{
          return {...doc.data(), id:doc.id}
        })
      })
    }

    const faireUnBon = (personnel) => {
      toggleForm('bon')
      // console.log("frm bon :" , personnel)
      let salaire = getSalaire(personnel.id)
      let form = document.querySelector(".bon")
      form.querySelector('#name').value = personnel.nom
      form.querySelector('#phone').value = personnel.phoneNumber
      // form.querySelector('#email').value = personnel.email
      form.querySelector('#fonction').value = personnel.fonction
      form.querySelector('#salaireBase').value = salaire.salaireBase
      form.querySelector('#indemnites').value = salaire.indemnites
      form.querySelector('#salaireNet').value = salaire.salaireNet
      form.querySelector('#antecedant').value = getAntecedants(personnel.id)

      // console.log("form : ", salaire.salaireBase)

    }

    const edit = (id) => {
      //console.log(" id :::: ",id)
      if( isAdmin) {
        router.push( { name: "EditPersonnel", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet fournisseur et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            return
            await destroy("users", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }
    const filteredPersonnels = computed( () =>{

          return documents.value ? documents.value.filter( (personnel) => {
            return personnel.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
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
      filteredPersonnels,
      editPersonnelId,
      faireUnBon,
    }
  }
}
</script>

<style>

</style>
