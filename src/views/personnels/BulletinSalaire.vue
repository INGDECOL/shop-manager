<template>
        <div class="mx-auto w-4/5" >
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="produit border flex justify-center flex-col  gap-0.5 mt-0 p-2">
              <p class="text-center font-bold text-base mb-0"> BULLETIN DE SALAIRE</p>
              <p class="mb-0 p-0 font-bold">{{ nom +" "+ contact }}</p>
                <div class="produit  flex justify-center  gap-0.5 m-0 shadow-none">
                  <!-- cote gauche -->
                  <div class="rounded border mb-2 px-1 mx-1 overflow-scroll">
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
                                </tr>
                              </thead>
                              <tbody class="text-gray-700">
                                <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll" :class="{ striped : n % 2 ===0}" v-for="(personnel, n) in filteredPersonnels" :key="personnel.id">
                                  <td class="text-left py-3 px-3 text-xs uppercase underline hover:text-blue-400 cursor-pointer" @click="personnelSelected(personnel)">{{ personnel.nom}} </td>
                                  <td class="text-left py-3 px-3 text-xs">{{ personnel.phoneNumber}}</td>
                                  <!-- <td class="text-left py-3 px-3 text-xs">{{ personnel.fonction }}</td> -->
                                </tr>
                              </tbody>
                          </table>
                      </div>

                    </div>
                  </div>
                  <!-- cote droit -->
                    <div class="border rounded mb-2 px-1 mx-1  ">
                      <div class="input flex justify-between items-center m-1 gap-3 ">
                          <label for="moisAafficher">Mois</label>
                        <select name="moisAafficher" id="moisAafficher" v-model="moisAafficher" >
                            <option value="" selected>Selectionner le mois</option>
                            <option :value="mois" v-for="mois in listeMois" :key="mois">{{ mois }}</option>
                        </select>
                      </div>
                      <div class="border m-1 p-1 ">
                          <table class=" bg-white divider-y divide-gray-400">
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
                                <td class="text-left py-3 px-3 text-xs">{{ formatedNumber(0) }}</td>
                              </tr>
                              <!-- Indemnites -->
                              <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped"  >
                                <td class="text-left py-3 px-3 text-xs uppercase " >{{ 280 }} </td>
                                <td class="text-left py-3 px-3 text-xs">Indemnites</td>
                                <td class="text-left py-3 px-3 text-xs">{{ indemnites ? indemnites : "0 GNF" }}</td>
                                <td class="text-left py-3 px-3 text-xs">{{ formatedNumber(0) }}</td>
                              </tr>
                              <!-- Cotisations -->
                              <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll "  >
                                <td class="text-left py-3 px-3 text-xs uppercase " >{{ 707 }} </td>
                                <td class="text-left py-3 px-3 text-xs">Retenu pour cotisation sociale</td>
                                <td class="text-left py-3 px-3 text-xs">{{ formatedNumber(0) }}</td>
                                <td class="text-left py-3 px-3 text-xs">{{ cotisation ? cotisation : "0 GNF" }}</td>
                              </tr>
                              <!-- Bon et autre -->
                              <tr class="border-b border-gray-400 max-h-2 overflow-y-scroll striped"  >
                                <td class="text-left py-3 px-3 text-xs uppercase " >{{ 901 }} </td>
                                <td class="text-left py-3 px-3 text-xs">Retenu pour Bon et avance sur S</td>
                                <td class="text-left py-3 px-3 text-xs">{{ formatedNumber(0) }}</td>
                                <td class="text-left py-3 px-3 text-xs">{{ antecedant ? antecedant : "0 GNF" }}</td>
                              </tr>
                              <!-- TOTAL -->
                              <tr class="border-b  border-gray-500 max-h-2 overflow-y-scroll bg-gray-400"  >
                                <td class="text-left py-3 px-3 text-xs uppercase font-bold border-r border-gray-500" colspan="2">TOTAL </td>
                                <td class="text-left py-3 px-3 text-xs font-bold border-r border-gray-500">{{ mtTotal ? formatedNumber(mtTotal) : "0 GNF" }}</td>
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
                            </tbody>
                          </table>
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Nom</label>
                          <input type="text" name="nom" id="nom" placeholder="Nom complet" v-model="nom" disabled>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="contact">Contact</label>
                          <input type="text" name="contact" id="contact" placeholder="Contact" v-model="contact" disabled>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Salaire Base</label>
                          <input type="text" name="salaireBase" id="salaireBase" placeholder="Salaire de Base" v-model="salaireBase" disabled>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Primes</label>
                          <input type="text" name="indemnites" id="indemnites" placeholder="indemnites" v-model="indemnites" disabled>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Antecedant</label>
                          <input type="text" name="antecedant" id="antecedant" placeholder="antecedant" v-model="antecedant" disabled>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Mois à payer</label>
                          <select name="moisAafficher" id="moisAafficher" v-model="moisAafficher" required>
                            <option value="" selected>Selectionner le mois</option>
                            <option :value="mois" v-for="mois in listeMois" :key="mois">{{ mois }}</option>
                          </select>
                        </div> -->
                        <!-- <div class="input flex justify-between items-center m-1 gap-3">
                          <label for="nom">Montant Net</label>
                          <input type="text" name="salaireNet" id="salaireNet" placeholder="salaireNet" v-model="salaireNet" disabled>
                        </div> -->
                      <button class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-600 hover:text-gray-800">Imprimer</button>
                      <p class="error">{{ createError }}</p>
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
  import { onMounted, watch } from '@vue/runtime-core'
  import { auth, db } from "../../firebase/config"
  import createDocument from "../../controllers/createDocument"
import { collection, onSnapshot, orderBy, query, serverTimestamp } from '@firebase/firestore'
  export default {
    setup() {
      const router = useRouter()
      const {documents, getError, load} = getDocuments()
      const { createError, create} = createDocument()
      const searchQuery = ref("")
      const editPersonnelId = ref(null)
      const id = ref('')
      const nom = ref('')
      const contact = ref('')
      const fonction = ref('')
      const antecedant = ref()
      const ante = ref()
      const cotisation = ref()
      const cotis = ref()
      const salaireBase = ref()
      const salaireB = ref()
      const indemnites = ref()
      const indem = ref()
      const mtTotal = ref()
      const salaireNet = ref()
      const salaireN = ref()
      const moisAafficher = ref('')
      const listeBons = ref([])
      const listeSalaires = ref([])
      const listeMois = ref([])
      const listeBulletins = ref([])
      const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

      const formatedDate = (strDate) => {
        return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

      }

      const formatedNumber = (strNumber) => {
        return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
      }

      const getMois = () => {
        let months = ['Janv', 'Fevr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec']

        for (let i = 0; i < 31; i++) {
          let year = 2022 + i// new Date().getFullYear()
          months.map (month => {
              listeMois.value.push( month + " " + year)
            })
        }
      }

      onMounted( async () => {
        await load("users")
        // getBons()
        // getSalaires()
        getMois()
        getBulletins()
        //console.log(" fournisseurs : ", documents.value)
      })

      watch( moisAafficher, () => {
        console.log("mois watch : ", moisAafficher.value)
        if(moisAafficher.value == null) return
        salaireB.value = salaireBase.value = null
        indem.value = indemnites.value = null
        salaireNet.value = null
        if(id.value) {

          getBulletin()
        }
      })

      const filteredPersonnels = computed( () =>{
          return documents.value ? documents.value.filter( (personnel) => {
              return personnel.nom.toLowerCase().indexOf( searchQuery.value.toLowerCase()) != -1
            }): []
      })

      // const getBons = () => {
      //   const docRef = collection(db, "bons")
      //   const q = query(docRef, orderBy("createdAt", "desc"))
      //   const res = onSnapshot(q, snap => {
      //     listeBons.value = snap.docs.map(doc =>{
      //       return {...doc.data(), id:doc.id}
      //     })
      //   })
      // }
      const getBulletins = () => {
        const docRef = collection(db, "bulletins")
        const q = query(docRef, orderBy("createdAt", "desc"))
        const res = onSnapshot(q, snap => {
          listeBulletins.value = snap.docs.map(doc =>{
            return {...doc.data(), id:doc.id}
          })
        })
      }
      // const getSalaires = () => {
      //   const docRef = collection(db, "salaires")
      //   const q = query(docRef, orderBy("createdAt", "desc"))
      //   const res = onSnapshot(q, snap => {
      //     listeSalaires.value = snap.docs.map(doc =>{
      //       return {...doc.data(), id:doc.id}
      //     })
      //   })
      // }

      const getBulletin = () => {
          listeBulletins.value.forEach(salaire => {

            if(salaire.personnelId == id.value && salaire.mois == moisAafficher.value) {
              indemnites.value = formatedNumber (salaire.indemnites)
              antecedant.value = formatedNumber( salaire.antecedant)
              salaireNet.value = formatedNumber(salaire.montantNet)
              salaireBase.value = formatedNumber(salaire.salaireBase)
              mtTotal.value = formatedNumber((salaire.salaireBase)+(salaire.indemnites))
            }
        })
      }

      // const getAntecedants = (id) => {
      //   let montanAntecedant =0
      //   listeBons.value.map(bon => {
      //     if(bon.personnelId == id) {
      //       montanAntecedant += bon.montant
      //     }
      //   })
      //   return montanAntecedant

      // }
      // const getSalaire = (id) => {
      //   listeSalaires.value.map(salaire => {
      //     if(salaire.id == id) {
      //       // console.log("getSalaire compar : ", salaire.id , "=>", id)
      //       salaireB.value = Number(salaire.salaireBase)
      //       indem.value =Number(salaire.indemnites)
      //       salaireN.value = ((salaire.salaireBase) + (salaire.indemnites)) - (antecedant.value ? antecedant.value : 0)

      //       salaireBase.value = formatedNumber(salaireB.value)
      //       indemnites.value = formatedNumber(indem.value)
      //       salaireNet.value = formatedNumber(salaireN.value)
      //     }
      //   })
      // }

      const personnelSelected = (personnel) => {
        // console.log("Personnel ", personnel)
        salaireB.value = null
        salaireBase.value = null
        indem.value = null
        indemnites.value = null
        salaireNet.value = null
        mtTotal.value = null
        antecedant.value = null
        ante.value = null
        moisAafficher.value = null
        // getSalaire(personnel.id)
        // if(salaireBase.value == null) {
        //   alert("Ce personnel n'a aucun salaire de base defini !")
        //   return
        // }
        id.value = personnel.id
        nom.value = personnel.nom
        contact.value = personnel.phoneNumber
        fonction.value = personnel.fonction
        // ante.value = getAntecedants(personnel.id) ? getAntecedants(personnel.id) : 0
        // antecedant.value = formatedNumber(ante.value)

        //  salaireN.value = ((salaireB.value) + (indem.value)) - (ante.value ? ante.value : 0)
        // salaireNet.value = formatedNumber(salaireN.value)

      }

      const handleSubmit = async () => {
          alert("Fonctionnalité en cours de conception \n Veuillez réessayer ultérieurement !")
          return
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
          mois: moisAafficher.value,
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
        console.log("bulletin : ", bulletin)
        await create("bulletins", bulletin)
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
        cotisation,
        salaireNet,
        nom,
        contact,
        fonction,
        antecedant,
        listeMois,
        moisAafficher,
        formatedNumber,
        handleSubmit,
        mtTotal,

      }
    }
  }
</script>

<style>

</style>
