<template>
        <div class="mx-auto w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
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
                                  <th class="text-left py-3 px-4 uppercase  text-xs">Nom Complet</th>
                                  <th class="text-left py-3 px-4 uppercase  text-xs">Contact</th>
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Adresse</th> -->
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th> -->
                                  <th class="text-left py-3 px-4 uppercase  text-xs">Fonction</th>
                                  <!-- <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th> -->
                                </tr>
                              </thead>
                              <tbody class="text-gray-700">
                                <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(personnel, n) in filteredPersonnels" :key="personnel.id">
                                  <td class="text-left py-3 px-4 text-xs uppercase underline hover:text-blue-400 cursor-pointer">{{ personnel.nom}} </td>
                                  <td class="text-left py-3 px-4 text-xs">{{ personnel.phoneNumber}}</td>
                                  <!-- <td class="text-left py-3 px-4">{{ personnel.adresse}}</td> -->
                                  <!-- <td class="text-left py-3 px-4 text-blue-400 underline cursor-pointer">{{ personnel.email }}</td> -->
                                  <td class="text-left py-3 px-4 text-xs">{{ personnel.fonction }}</td>
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
                    <div class="border rounded mb-2 px-1 mx-1 w-full">
                        <div class="border m-1 p-1 max-h-48 overflow-y-scroll overflow-x-scroll">
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
                        </div>
                        <!-- Mode reglement et validation -->
                        <!-- <div class="border m-1">
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label for="">Règlement </label>
                                <select name="modeReglement" id="modeReglement" required class="h-6 text-xs py-0">
                                    <option value="Espece">Espèce</option>
                                    <option value="Virement">Virement</option>
                                </select>

                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total TTC </label>
                                <input type="text" name="montanttotalttc" id="montanttotalttc" class="h-1" v-model="totalTTC" disabled>
                            </div>
                            <div class="input flex justify-between items-center m-1 gap-3">
                                <label class="w-1/2">Montant Total Règlé </label>
                                <input type="text" name="montanttotal" id="montanttotal" class="h-1" v-model="montantRegle">

                            </div>
                        </div> -->
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700">Enregistrer</button>
                        <p class="error">{{  }}</p>
                        <!-- Montant restant ou Montant à rendre -->
                        <!-- <div class="flex justify-center ">
                            <span class="flex justify-center gap-4 bg-green-300 text-gray-600 text-base font-bold  mb-2  rounded-md cursor-pointer hover:bg-green-200" :class="{ 'text-red-500' : (totalTTC - montantRegle)>0 }" >
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}"> {{ montantRegle ? (totalTTC - montantRegle)>0 ? "Reste dû " : "Monnaie à rendre" : "Monnaie à rendre"}}</span>
                            <span class="mx-3 my-4" :class="{'text-gray-600' : !montantRegle}">{{montantRegle ? (totalTTC - montantRegle).toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})  : 0 +"  GNF "}}</span>
                            </span>
                        </div> -->

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
  import { auth } from "../../firebase/config"
  import getUser from "../../controllers/getUser"
  export default {
    setup() {
      const router = useRouter()
      const {documents, getError, load} = getDocuments()
      const searchQuery = ref("")
      const editPersonnelId = ref(null)

      onMounted( async () => {
        await load("users")
        //console.log(" fournisseurs : ", documents.value)
      })

      const filteredPersonnels = computed( () =>{
        return documents.value ? documents.value.filter( (personnel) => {
          return personnel.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
        }): []
    })


      return {
        auth,
        documents,
        getError,
        searchQuery,
        filteredPersonnels,
        editPersonnelId,

      }
    }
  }
</script>

<style>

</style>
