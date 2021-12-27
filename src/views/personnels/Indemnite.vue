<template>
        <div class="mx-auto w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
              <p class="text-center font-bold text-base mb-0"> PAYEMENT DE SALAIRE</p>
                <!-- Total de la facture -->
                <!-- <div class="flex justify-end ">
                    <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold mr-8  rounded-md cursor-pointer hover:bg-green-200">
                       <span class="mx-3 my-6"> Montant TTC</span>
                        <span class="mx-3 my-6">{{ totalTTC ? (totalTTC).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 +"  GNF "}}</span>
                    </span>
                </div> -->
                <div class="produit  flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote gauche -->
                  <div class="rounded border mb-2 px-1 mx-1 w-full overflow-scroll">
                    <!-- Rechercher -->
                    <div class="searchbar mx-1  flex justify-start ">
                      <input type="text" placeholder="Rechercher..." class="w-full h-10" v-model="searchQuery" >
                      <span class="material-icons -mx-9 p-4">
                            search
                      </span>
                    </div>

                    <div class="border m-1 flex flex-col gap-1 p-1 ">
                        <div v-if="documents.length" class="">
                          <table class=" bg-white divider-y divide-gray-400">
                              <thead class="bg-gray-800 text-white">
                                <tr >
                                  <th class="text-left py-3 px-3 uppercase  text-xs">Nom Complet</th>
                                  <th class="text-left py-3 px-3 uppercase  text-xs">Contact</th>
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th> -->
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th> -->
                                  <th class="text-left py-3 px-3 uppercase  text-xs">Fonction</th>
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th> -->
                                </tr>
                              </thead>
                              <tbody class="text-gray-700">
                                <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(personnel, n) in filteredPersonnels" :key="personnel.id">
                                  <td class="text-left py-3 px-3 text-xs uppercase underline hover:text-blue-400 cursor-pointer" @click="personnelSelected(personnel)">{{ personnel.nom}} </td>
                                  <td class="text-left py-3 px-3 text-xs">{{ personnel.phoneNumber}}</td>
                                  <!-- <td class="text-left py-3 px-4">{{ personnel.adresse}}</td> -->
                                  <!-- <td class="text-left py-3 px-4 text-blue-400 underline cursor-pointer">{{ personnel.email }}</td> -->
                                  <td class="text-left py-3 px-3 text-xs">{{ personnel.fonction }}</td>
                                  <!-- <td class="text-left py-3 px-4 flex justify-between items-center">
                                    <span class="material-icons " title="Modifier" :class="{ disabled: !isAdmin }" @click="edit(personnel.id)">edit</span>
                                    <span class="material-icons strash text-red-300" title="Supprimer" :class="{ disabled: !isAdmin }" @click="destroy(personnel.id)">delete</span>
                                  </td> -->
                                </tr>
                              </tbody>
                          </table>
                      </div>

                    </div>
                  </div>
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full ">
                        <div class="border m-1 p-1 ">
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Nom</label>
                            <input type="text" name="nom" id="nom" placeholder="Nom complet" v-model="nom" disabled>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="contact">Contact</label>
                            <input type="text" name="contact" id="contact" placeholder="Contact" v-model="contact" disabled>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Salaire Base</label>
                            <input type="text" name="salaireBase" id="salaireBase" placeholder="Salaire de Base" v-model="salaireBase" disabled>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Primes</label>
                            <input type="text" name="indemnites" id="indemnites" placeholder="indemnites" v-model="indemnites" disabled>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Antecedant</label>
                            <input type="text" name="antecedant" id="antecedant" placeholder="antecedant" v-model="antecedant" disabled>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Montant Net</label>
                            <input type="text" name="salaireNet" id="salaireNet" placeholder="salaireNet" v-model="salaireNet" disabled>
                          </div>
                            <!-- <table class="min-w-full bg-white divider-y divide-gray-400 ">
                                <thead class="bg-gray-800 text-white">
                                        <tr>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-sm">#</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Désignation</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">P. Unitaire</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Qté</th>
                                            <th class="text-left py-3 px-4 uppercase font-semibold text-xs">Total</th>
                                        </tr>
                                </thead>
                                <tbody class="text-gray-700 ">
                                    <tr class="border-b border-gray-400 " :class="{ striped : n % 2 ===0}" v-for="(cmd,n) in commandes" :key="cmd.id">
                                        <td class="text-left py-3 px-4 font-semibold uppercase">
                                            <span class="bg-red-400 text-white rounded-sm p-1 cursor-pointer hover:bg-red-500" title="Supprimer la ligne" @click="removeCommande(cmd)">x</span>
                                        </td>
                                        <td class="text-left py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.designation }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pvu}}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.qtecmd }}</td>
                                        <td class="text-center py-3 px-4 text-xs  font-semibold uppercase">{{ cmd.pvu * cmd.qtecmd }}</td>

                                    </tr>

                                </tbody>
                            </table> -->
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-600 hover:text-gray-800">Payer</button>
                        <p class="error">{{  }}</p>
                        </div>
                    </div>
                </div>
                </div>
            </form>
        </div>
    </div>

</template>

<script>
  import { computed, ref } from '@vue/reactivity'
  import { useRouter } from 'vue-router'
  import getDocuments from '../../controllers/getDocuments'
  import { onMounted } from '@vue/runtime-core'
  import { auth, db } from "../../firebase/config"
  import getUser from "../../controllers/getUser"
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore'
  export default {
    setup() {
      const router = useRouter()
      const {documents, getError, load} = getDocuments()
      const searchQuery = ref("")
      const editPersonnelId = ref(null)
      const nom = ref('')
      const contact = ref('')
      const fonction = ref('')
      const antecedant = ref()
      const salaireBase = ref()
      const indemnites = ref()
      const salaireNet = ref()
      const listeBons = ref([])
      const listeSalaires = ref([])
      const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

      const formatedDate = (strDate) => {
        return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

      }
      const formatedNumber = (strNumber) => {
        return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
      }

      onMounted( async () => {
        await load("users")
        getBons()
        getSalaires()
        //console.log(" fournisseurs : ", documents.value)
      })

      const filteredPersonnels = computed( () =>{
          return documents.value ? documents.value.filter( (personnel) => {
              return personnel.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
            }): []
      })
      
      const getBons = () => {
        const docRef = collection(db, "bons")
        const q = query(docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, snap => {
          listeBons.value = snap.docs.map(doc =>{
            return {...doc.data(), id:doc.id}
          })
        })
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
        return montanAntecedant

      }
      const getSalaire = (id) => {
        let montanAntecedant =0
        listeSalaires.value.map(salaire => {
          console.log("salaire : ", salaire)
          if(salaire.id == id) {
            salaireBase.value = formatedNumber(Number(salaire.salaireBase))
            indemnites.value =formatedNumber( Number(salaire.indemnites))
            salaireNet.value =formatedNumber( Number(salaire.salaireBase) + Number(salaire.indemnites) - antecedant.value)
          }
        })


      }

      const personnelSelected = (personnel) => {
        console.log("Personnel ", personnel)
        nom.value = personnel.nom
        contact.value = personnel.phoneNumber
        fonction.value = personnel.fonction
        antecedant.value = getAntecedants(personnel.id) ? getAntecedants(personnel.id) : 0
        getSalaire(personnel.id)
      }


      return {
        auth,
        documents,
        getError,
        searchQuery,
        filteredPersonnels,
        editPersonnelId,
        personnelSelected,
        salaireBase,
        indemnites,
        salaireNet,
        nom,
        contact,
        fonction,
        antecedant,

      }
    }
  }
</script>

<style>

</style>
