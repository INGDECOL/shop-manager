<template>
  <div class="md:px-2 py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <div class="text-center font-bold mb-2 text-lg underline title">
            GESTION DES COMPTES AUXILLIAIRES
        </div>
        <div class="flex justify-center w-80 ml-auto -mt-10">
            <NewAccount />
        </div>
        <div class="flex justify-end items-center">
          <!-- <div class="mr-2 pr-2.5 mb-2"> -->
              <button class="my-2 mx-2 py-0 flex justify-between items-center" @click="toggleForm" title="Nouveau compte"><span class="material-icons text-center py-1 m-0">add</span>Nouveau</button>
         <!-- </div> -->
        </div>
        <div v-if="listeComptes.length">
            <table class="min-w-full bg-white divider-y divide-gray-400">
                <thead class="bg-gray-800 text-white">
                  <tr >
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date creation</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">N° Compte</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Mandataire compte</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Fond initial</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Solde actuel</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-700">
                  <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(compte, n) in listeComptes" :key="compte.id">
                    <td class="text-left py-3 px-4 font-semibold uppercase">{{ n + 1}} </td>
                    <td class="text-left py-3 px-4 font-semibold uppercase text-xs">{{ formatedDate(compte.createdAt.seconds)}} </td>
                    <td class="text-left py-3 px-4 text-xs text-blue-400 underline hover:text-blue-500 cursor-pointer" title="Cliquer pour aller au payement" @click="payerFacture(compte.id)">{{ compte.id}}</td>
                    <td class="text-left py-3 px-4 text-xs">{{  getFournisseur(compte.fournisseurId) }}</td>
                    <td class="text-left py-3 px-4 text-xs font-semibold text-pink-400 hover:text-pink-300 cursor-pointer" title="Montant restant">{{ formatedNumber(compte.impayer ? compte.impayer : 0) }}</td>
                    <!-- <td class="text-left py-3 px-4 text-xs font-semibold underline text-blue-400 hover:text-blue-300 cursor-pointer" title="Montant Total dû" >0</td> -->
                    <td class="text-left py-3 px-4 flex justify-between items-center">
                      <span class="material-icons " :class="{ disabled: !isAdmin }" >edit</span>
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
    const listeFactures = ref([])
    const listeComptes = ref([])
    const listeFournisseurs = ref([])
    const soldeFournisseurs = ref([])
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

  const getBoutiques = async () => {
    const docRef = collection(db, "boutiques")
    const res = onSnapshot(docRef, (snap)=>{
        listeBoutiques.value = snap.docs.map(doc => {
            return {...doc.data(), id: doc.id}
        })
    })
  }

  const filteredBoutiques = computed(()=>{
    return listeBoutiques.value && listeBoutiques.value.filter((boutique)=>{
        return boutique.gerantBoutique.toString().includes(auth.currentUser.email)// == auth.currentUser.email
    })
  })


  const getSolde = async () =>{
    const docRef =  collection(db, "detteFournisseurs")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          soldeFournisseurs.value = snap.docs.map(doc =>{
              //doc.data().createdAt = doc.data().createdAt.seconds
              return {...doc.data(), id : doc.id}
          })
      // console.log("solde : ", soldeFournisseurs.value)
      })
  }

  const loadFactures =async () => {
      const docRef =  collection(db, "facturesFournisseurs")
      const q = query( docRef, orderBy("createdAt", "desc"))
      const res = onSnapshot(q, ( snap ) =>{
          // console.log("snap vente", snap.docs)
          documents.value = snap.docs.map(doc =>{
              return {...doc.data(), id : doc.id}
          })

          listeFactures.value = documents.value
          listeComptes.value = listeFactures.value
      })
  }

  const loadFournisseurs = async () => {
    const docRef =  collection(db, "fournisseurs") // docs to fetch in firebase
            const q = query( docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, ( snap ) =>{
                listeFournisseurs.value = snap.docs.map(doc =>{
                    // console.log("Data : ", doc.data())
                    return {...doc.data(), id : doc.id}
                })
            })
  }

  const detailDette = (fournisseur) => {
    if( fournisseur.solvabilite <= 0 ) {
      alert("Aucun detail à afficher le solde vaut 0 ")
      return
    }
    // console.log("Detail id : ", client.id)
    router.push( { name: "DetailDette", params: { token: auth.currentUser.accessToken, id: fournisseur.id }})
  }

  const payerFacture = (idfacture) => {
    router.push({ name: 'AdminNewCommande', params: { token: auth.currentUser.accessToken, id: idfacture}})
  }

  const getFournisseur = (id) => {
    let info
    if(id) {
      listeFournisseurs.value.forEach(fournisseur => {
        // console.log("params : ", client.id, " =>", id , client.id==id)
        if(fournisseur.id === id) {
          info = fournisseur.nom +" " + fournisseur.prenom
        }
      })
      return info
    }else return "Inconnue"
  }

  watch(boutiqueVente, async()=>{
      if(boutiqueVente.value =='') {
          return
      }
      // console.log("boutique : ", listeFactures.value.length, listeFactures.value)
      listeComptes.value = listeFactures.value.filter(facture => {
        // console.log("facture :: ", facture.boutiqueId, boutiqueVente.value)
        return facture.boutiqueId == boutiqueVente.value
      })
  })

    watch(listeFactures, () => {

        if(listeFactures.value.length ) {
          const lstFact = listeFactures
        // Calculer le solde total par facture
            lstFact.value.map(facture => {
                let soldeTotal =0
                facture.articles.forEach(solde => {
                    soldeTotal += Number(solde.pvu * solde.qtecmd)
                })
                facture.total = soldeTotal
                // Total dette de la facture
                soldeFournisseurs.value.forEach(solde => {
                    if(solde.factureId == facture.id) {
                        facture.impayer = solde.montantDette
                    }
                })
                // facture.client = getFournisseur(facture.clientId)
            })
            listeFactures.value = lstFact.value.filter(facture => {
              return facture.impayer >0
            })
            listeComptes.value = listeFactures.value
        }

    })

    onMounted( async () => {
    //   getBoutiques()
      await loadFournisseurs()
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
        // router.push( { name: "EditClient", params: { token: auth.currentUser.accessToken, id: id}})

      }else {
        alert("Vous n'êtes pas autorisé à effectuer cette action")
      }
    }

    const destroy = async (id) => {
      //console.log(" destroy id :::: ",id)
      if( isAdmin) {
          const { destroy, error } = destroyDocument()
          if( confirm("Voulez-vous supprimer cet client et tous les sous documents liés ?? Cette action est definitive et irreversible !!") ) {
            // await destroy("clients", id)

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
      isAdmin,
      edit,
      destroy,
      toggleForm,
      documents,
      listeFactures,
      listeComptes,
      document,
      getError,
      searchQuery,
      filteredFournisseurs,
      filteredBoutiques,
      boutiqueVente,
      editclientId,
      soldeFournisseurs,
      formatedNumber,
      formatedDate,
      detailDette,
      getFournisseur,
      payerFacture,
      nom,
      prenom
    }
  }
}
</script>

<style>

</style>
