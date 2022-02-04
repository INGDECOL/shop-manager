<template>
  <div class="md:px-2 py-8 ">
      <div class="shadow overflow-auto rounded border-b border-gray-200">
        <div class="text-center font-bold mb-2 text-lg underline title">
            GESTION DES COMPTES AUXILLIAIRES
        </div>
        <div class="flex justify-center  ml-auto -mt-10">
            <NewAccount />
        </div>
        <div class="flex justify-end items-center">
          <!-- <div class="mr-2 pr-2.5 mb-2"> -->
              <button class="my-2 mx-2 py-0 flex justify-between items-center" @click="toggleForm" title="Nouveau compte"><span class="material-icons text-center py-1 m-0">add</span>Nouveau</button>
         <!-- </div> -->
        </div>
        <div v-if="listeComptes.length">
            <table class="table-auto bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Date creation</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">N° Compte</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Mandataire compte</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Fond initial</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Solde actuel</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(compte, n) in listeComptes" :key="compte.id">
                    <td class="text-left py-3 px-1 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-1 font-semibold uppercase text-xs">{{ formatedDate(compte.createdAt.seconds)}} </td>
                    <td class="text-left py-3 px-1 text-xs text-blue-400 underline hover:text-blue-500 cursor-pointer" title="Cliquer pour la liste des transactions" @click="payerFacture(compte.id)">{{ compte.id}}</td>
                    <td class="text-left py-3 px-1 text-xs">{{  compte.nom +" "+ compte.prenom }}</td>
                    <td class="text-center py-3 px-1 text-xs font-semibold text-green-600 hover:text-green-700 cursor-pointer" title="Montant initial à la creation">{{ formatedNumber(compte.fondDepart ? compte.fondDepart : 0) }}</td>
                    <td class=" py-3 px-1 text-xs font-semibold  text-center hover:text-blue-300 cursor-pointer" title="Solde actuel du compte" >{{ formatedNumber(getSolde(compte.id)?? 0) }}</td>
                    <td class="text-left py-3 px-1 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" >edit</span>
                      <span class="material-icons strash text-red-300" :class="{ disabled: !isAdmin }" @click="destroy(compte.id)">delete</span>
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
import NewAccount from "./NewAccount.vue"
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
export default {
  components: { Spinner, NewAccount },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const nom = ref('')
    const listeBoutiques = ref(null)
    const boutiqueVente = ref('')
    const prenom = ref('')
    const documents = ref([])
    const comptes = ref([])
    const listeComptes = ref([])
    const listeFournisseurs = ref([])
    const listeMouvements = ref([])
    const getError = ref('')
    const searchQuery = ref("")
    const editclientId = ref(null)
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

  const formatedNumber = (strNumber) => {
    return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
  }

  const formatedDate = (strDate) => {
      return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

  }

//   const getBoutiques = async () => {
//     const docRef = collection(db, "boutiques")
//     const res = onSnapshot(docRef, (snap)=>{
//         listeBoutiques.value = snap.docs.map(doc => {
//             return {...doc.data(), id: doc.id}
//         })
//     })
//   }

//   const filteredBoutiques = computed(()=>{
//     return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
//         return boutique.gerantBoutique.toString().includes(auth.currentUser.email)// == auth.currentUser.email
//     })
//   })


  const getSoldes = async () =>{
    const docRef =  collection(db, "mouvements")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          listeMouvements.value = snap.docs.map(doc =>{
              //doc.data().createdAt = doc.data().createdAt.seconds
              return {...doc.data(), id : doc.id}
          })
      // console.log("solde : ", listeMouvements.value)
      })
  }
  const getSolde =  (id) =>{
    let versement=0, retrait =0, solde=0

    listeMouvements.value.map(mouvement => {
        if(mouvement.compteId == id && mouvement.operation =="Versement") {
            versement += Number(mouvement.montant)
        }else if(mouvement.compteId == id && mouvement.operation =="Retrait") {
            retrait += mouvement.montant
        }
    })
    solde = versement - retrait
    return solde
  }

  const loadAccount =async () => {
      const docRef =  collection(db, "comptes")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          documents.value = snap.docs.map(doc =>{
              return {...doc.data(), id : doc.id}
          })

          comptes.value = documents.value
          listeComptes.value = comptes.value
      })
  }

    watch(comptes, () => {
        if(comptes.value.length ) {

            listeComptes.value = comptes.value
        }
    })

    onMounted( async () => {
    //   getBoutiques()
    //   await loadFournisseurs()
      await getSoldes()
      await loadAccount()
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

    const payerFacture = (id) => {
      console.log(id)
    }

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
          if( confirm("Voulez-vous supprimer cet compte et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
             await destroy("comptes", id)

        }
        if(error.value){
          alert(error.value)
        }
      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }

    const filteredFournisseurs = computed( () =>{
          return documents.value ? documents.value.filter( (client) => {
            return client.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
          }) : []
    })

    return {
      auth,
      payerFacture,
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      comptes,
      getSolde,
      listeComptes,
      document,
      getError,
      searchQuery,
      editclientId,
      listeMouvements,
      formatedNumber,
      formatedDate,
      nom,
      prenom
    }
  }
}
</script>

<style>

</style>
