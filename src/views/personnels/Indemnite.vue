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
                            <label for="nom">Mois à payer</label>
                            <select name="moisApayer" id="moisApayer" v-model="moisApayer" required>
                              <option value="" selected>Selectionner le mois</option>
                              <option :value="mois" v-for="mois in listeMois" :key="mois">{{ mois }}</option>
                            </select>
                          </div>
                          <div class="input flex justify-between items-center m-1 gap-3">
                            <label for="nom">Montant Net</label>
                            <input type="text" name="salaireNet" id="salaireNet" placeholder="salaireNet" v-model="salaireNet" disabled>
                          </div>
                        <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-600 hover:text-gray-800">Payer</button>
                        <p class="error">{{ createError }}</p>
                        </div>
                    </div>
                </div>
                <!-- Liste à Imprimer -->
                <div v-if="documents.length" class="hidden">
                    <table class="min-w-full bg-white divider-y divide-gray-400" id="bulletin">
                      <thead class="bg-gray-800 text-white">
                        <tr >
                          <th class="text-left py-3 px-3 uppercase  text-xs">Code</th>
                          <th class="text-left py-3 px-3 uppercase  text-xs">Libelle</th>
                          <th class="text-left py-3 px-3 uppercase  text-xs">MT Gain</th>
                          <th class="text-left py-3 px-3 uppercase  text-xs">MT Retenu</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-700">
                        <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll"  >
                          <td class="text-left py-3 px-3 text-xs uppercase " >{{ 102 }} </td>
                          <td class="text-left py-3 px-3 text-xs">Salaire de base indiciaire</td>
                          <td class="text-left py-3 px-3 text-xs">{{ salaireBase ? salaireBase : "0 GNF" }}</td>
                          <td class="text-left py-3 px-3 text-xs">{{ numberFormatter.format(0) }}</td>
                        </tr>
                        <!-- Indemnites -->
                        <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped"  >
                          <td class="text-left py-3 px-3 text-xs uppercase " >{{ 280 }} </td>
                          <td class="text-left py-3 px-3 text-xs">Indemnites</td>
                          <td class="text-left py-3 px-3 text-xs">{{ indemnites ? indemnites : "0 GNF" }}</td>
                          <td class="text-left py-3 px-3 text-xs">{{ numberFormatter.format(0) }}</td>
                        </tr>
                        <!-- Cotisations -->
                        <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll "  >
                          <td class="text-left py-3 px-3 text-xs uppercase " >{{ 707 }} </td>
                          <td class="text-left py-3 px-3 text-xs">Retenu pour cotisation sociale</td>
                          <td class="text-left py-3 px-3 text-xs">{{ numberFormatter.format(0) }}</td>
                          <td class="text-left py-3 px-3 text-xs">{{ cotisation ? cotisation : "0 GNF" }}</td>
                        </tr>
                        <!-- Bon et autre -->
                        <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped"  >
                          <td class="text-left py-3 px-3 text-xs uppercase " >{{ 901 }} </td>
                          <td class="text-left py-3 px-3 text-xs">Retenu pour Bon et avance sur S</td>
                          <td class="text-left py-3 px-3 text-xs">{{ numberFormatter.format(0) }}</td>
                          <td class="text-left py-3 px-3 text-xs">{{ antecedant ? antecedant : "0 GNF" }}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <!-- TOTAL -->
                        <tr class="border-b  border-gray-500 max-h-2 overflow-y-scroll bg-gray-400"  >
                          <td class="text-left py-3 px-3 text-xs uppercase font-bold border-r border-gray-500" colspan="2">TOTAL </td>
                          <td class="text-left py-3 px-3 text-xs font-bold border-r border-gray-500">{{ mtTotal ? numberFormatter.format(mtTotal) : "0 GNF" }}</td>
                          <td class="text-left py-3 px-3 text-xs font-bold ">{{ antecedant ? antecedant : "0 GNF" }}</td>
                        </tr>
                        <tr class="border-b  border-gray-500 max-h-2 overflow-y-scroll bg-gray-400"  >
                          <td class="text-left py-3 px-3 text-xs uppercase font-bold border-r border-gray-500" colspan="2"> </td>
                          <td class="text-left py-3 px-3 text-xs font-bold border-r border-gray-500">IMPOSABLE</td>
                          <td class="text-left py-3 px-3 text-xs font-bold ">NET A PAYER</td>
                        </tr>
                        <tr class="border-b  border-gray-500 max-h-2 overflow-y-scroll bg-gray-400"  >
                          <td class="text-left py-3 px-3 text-xs uppercase font-bold border-r border-gray-500" colspan="2"> </td>
                          <td class="text-left py-3 px-3 text-xs font-bold border-r border-gray-500">{{ salaireBase }}</td>
                          <td class="text-left py-3 px-3 text-xs font-bold ">{{ salaireNet ? salaireNet : "0 GNF"}}</td>
                        </tr>
                      </tfoot>
                    </table>
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
  import destroyDocument from '../../controllers/destroyDocument'
  import { onMounted } from '@vue/runtime-core'
  import { auth, db } from "../../firebase/config"
  import createDocument from "../../controllers/createDocument"
import { collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
import genererPDF from '../../controllers/genererPDF'
  export default {
    setup() {
      const router = useRouter()
      const {documents, getError, load} = getDocuments()
      const { createError, create} = createDocument()
      const {  destroy } = destroyDocument()
      const searchQuery = ref("")
      const editPersonnelId = ref(null)
      const id = ref('')
      const nom = ref('')
      const contact = ref('')
      const fonction = ref('')
      const antecedant = ref()
      const ante = ref()
      const salaireBase = ref()
      const salaireB = ref()
      const indemnites = ref()
      const indem = ref()
      const salaireNet = ref()
      const salaireN = ref()
      const cotisation = ref()
      const mtTotal = ref()
      const moisApayer = ref()
      const listeBons = ref([])
      const listeBonsId = ref(new Set())
      const listeSalaires = ref([])
      const listeMois = ref([])
      const listeBulletins = ref([])
      const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }
      const { makeBulletin } = genererPDF()

      const formatedDate = (strDate) => {
        return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

      }
      const formatedNumber = (strNumber) => {
        return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
      }

      const numberFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'GNF',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      })

      const getMois = () => {
        let months = ['Janv', 'Fevr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec']
        let year = new Date().getFullYear()
        listeMois.value = months.map (month => {
          return month + " " + year
        })
      }

      onMounted( async () => {
        await load("users")
        getBons()
        getSalaires()
        getMois()
        moisApayer.value = listeMois.value[new Date().getMonth()]
        getBulletins()
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
      const getBulletins = () => {
        const docRef = collection(db, "bulletins")
        const q = query(docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, snap => {
          listeBulletins.value = snap.docs.map(doc =>{
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
          if(bon.personnelId === id) {
            montanAntecedant += bon.montant
            listeBonsId.value.add(bon.id)
          }
        })
        return montanAntecedant

      }
      const getSalaire = (id) => {
        listeSalaires.value.map(salaire => {
          if(salaire.id == id) {
            // console.log("getSalaire compar : ", salaire.id , "=>", id)
            salaireB.value = Number(salaire.salaireBase)
            indem.value =Number(salaire.indemnites)
            salaireN.value = ((salaire.salaireBase) + (salaire.indemnites)) - (antecedant.value ? antecedant.value : 0)

            salaireBase.value = numberFormatter.format(salaireB.value)
            indemnites.value = numberFormatter.format(indem.value)
            salaireNet.value = numberFormatter.format(salaireN.value)
          }
        })
      }

      const personnelSelected = (personnel) => {
        // console.log("Personnel ", personnel)
        salaireB.value = salaireBase.value = null
        indem.value = indemnites.value = null
        salaireNet.value = null
        getSalaire(personnel.id)
        if(salaireBase.value == null) alert("Ce personnel n'a aucun salaire de base defini !")
        id.value = personnel.id
        nom.value = personnel.nom
        contact.value = personnel.phoneNumber
        fonction.value = personnel.fonction
        ante.value = getAntecedants(personnel.id) ? getAntecedants(personnel.id) : 0
        antecedant.value = numberFormatter.format(ante.value)
        // console.log("ids : ", listeBonsId.value)

         salaireN.value = ((salaireB.value) + (indem.value)) - (ante.value ? ante.value : 0)
        salaireNet.value = numberFormatter.format(salaireN.value)
        mtTotal.value = (salaireB.value) + (indem.value)

      }

      const handleSubmit = async () => {
        if(salaireB.value == null || isNaN(salaireB.value)) {
          alert("Ce personnel n'a aucun salaire de base defini !")
          return
        }
        const bulletin = {
          personnelId : id.value,
          nom: nom.value,
          fonction: fonction.value,
          salaireBase: salaireB.value,
          indemnites: indem.value,
          antecedant: Number(ante.value ? ante.value : 0),
          montantNet: salaireN.value,
          mois: moisApayer.value,
          createdAt: serverTimestamp()
        }
        let percu = false
        listeBulletins.value.forEach(salaire => {
          // console.log(salaire.personnelId, salaire.mois, "=>", bulletin.personnelId, bulletin.mois, salaire.mois == bulletin.mois)

          if(salaire.personnelId == bulletin.personnelId && salaire.mois == bulletin.mois) {
            percu = true
            return
          }
        })
        if (percu) {
          alert("Ce personnel a déjà perçu son salaire du mois selectionné !")
          return
        }
        // console.log("bulletin : ", bulletin)
        await create("bulletins", bulletin)
        listeBonsId.value.forEach(async id => {
          await destroy("bons", id)

        })

        /// Generation du bulletin de salaire pdf
        let options = {
          personnelId : id.value,
          nom: nom.value,
          fonction: fonction.value,
          mois: moisApayer.value,
          contact: contact.value,
              // dateA: dateA,
              // facture: factureSelected.value,
          gerant: auth.currentUser.displayName
        }
        makeBulletin({title : 'BULLETIN DE SALAIRE  '  , orientation : "p", format : "a4", id : 'bulletin', option: options})


        /// Fin Generation du pdf
        if(!createError.value) {
          alert("Payement effectué avec succès !")
          id.value =null
          nom.value = null
          fonction.value = null
          contact.value = null
          salaireB.value = salaireBase.value = null
          indemnites.value = indem.value = null
          salaireN.value = salaireBase.value = null
          ante.value = antecedant.value = null
          salaireN.value = salaireNet.value = null
        }

      }

      const exportPDF = () => {
        /// Generate facture in pdf
          // let dateDe= dateDebut.value
          // let dateA = dateFin.value
          let options = {
              // totalTTC : totalTTC.value.toString(),
              // totalPAU : totalPAU.value,
              // totalQte : totalQte.value,
              // dateDe: dateDe,
              // dateA: dateA,
              // facture: factureSelected.value,
              gerant: auth.currentUser.displayName
          }
          makeDocument({title : 'LISTE DU PERSONNEL  '  , orientation : "p", format : "a4", id : 'personnel', option: options})
            /// End of Generate facture in pdf
        }


      return {
        auth,
        documents,
        getError,
        createError,
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
        listeMois,
        moisApayer,
        handleSubmit,
        numberFormatter,
        exportPDF,
        cotisation,
        mtTotal,

      }
    }
  }
</script>

<style>

</style>
