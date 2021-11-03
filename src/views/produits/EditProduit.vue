<template>
      <div class="mx-auto w-4/5" @click="hideModal">
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="-mb-6 font-bold text-center text-base">NOUVEL ARTICLE</h2>
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <div class="produit ">
                    <div class="border rounded mb-2 px-1">
                      <h6 class="text-center font-semibold"><p><small>Information sur l'article</small></p></h6>
                      <input type="text" name="designation"   class="uppercase" placeholder="Désignation de l'article" required v-model="designation">
                      <select name="codeFamille" v-model="codeFamille" required>
                        <option value="">Famille de l'article</option>
                        <option v-for="famille in familles" :key="famille.id" :value="famille.codeFamille">{{famille.codeFamille}}</option>
                      </select>
                      <input type="text" name="pau" placeholder="Prix d'achat"   v-model="pau" required>
                      <input type="text" name="pvu"  placeholder="Prix de vente"  v-model="pvu" required>
                      <input type="text" name="seuil"  placeholder="Seuil minimum"  v-model="seuil" >
                      <input type="date" name="expiration"  placeholder="Date d'expiration"  v-model="expiration" >
                      <select name="fournisseurId" v-model="fournisseurId" required>
                        <option value="">Selectionner le fournisseur</option>
                        <option v-for="fournisseur in fournisseurs" :key="fournisseur.id" :value="fournisseur.id">{{ fournisseur.nom }}  {{ fournisseur.prenom }}</option>
                      </select>

                    </div>
                    <!-- <div class="border rounded mb-2 px-1">
                      <h6 class="text-center font-semibold"><p><small>Information sur le fournisseur</small></p></h6>
                      <input type="text" name="nomFournisseur"  placeholder="Nom du fournisseur"  v-model="nomFournisseur" >
                      <input type="text" name="prenomFournisseur"  placeholder="Prenom du fournisseur"  v-model="prenomFournisseur" >
                      <input type="text" name="contactFournisseur"  placeholder="Contact du fournisseur"  v-model="contactFournisseur" >
                    </div> -->
                </div>

                <button>Enregistrer</button>
                <p class="error">{{ updateError }}</p>
                <p class="error">{{ getError }}</p>
            </form>
            <div>
            </div>
        </div>
    </div>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import updateDocument from "../../controllers/updateDocument"
import getDocuments from "../../controllers/getDocuments"
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { collection, getDocs, onSnapshot, serverTimestamp } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../../firebase/config'
import getDocument from '../../controllers/getDocument'
export default {
    // props: [ 'editFournisseurId'],
    setup(props) {
        const id = ref('')
        const designation = ref('')
        const pau = ref('')
        const pvu = ref('')
        const expiration = ref('')
        const codeFamille = ref('')
        const fournisseurId = ref('')
        const seuil = ref('')
        const nomFournisseur = ref('')
        const prenomFournisseur = ref('')
        const contactFournisseur = ref('')
        const familles = ref(null)
        const fournisseurs = ref(null)
        const router = useRouter()
        const route = useRoute()
        const getError = ref(null)
        //const email = ref('')
        const { updateError, update } = updateDocument()

        const getFamilles = async () => {
            const docRef = collection(db, "familles")
            const res = onSnapshot(docRef, (snap)=>{
                familles.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })

        }
        const getFournisseurs = async () => {
            const docRef = collection(db, "fournisseurs")
            const res = onSnapshot(docRef, (snap)=>{
                fournisseurs.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })

        }
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        onMounted( async () => {
            getFamilles()
            getFournisseurs()
            if( route.params.id) {
                const { document, getError, load } = getDocument()
                getError.value = null

                await load("produits",route.params.id)
                if( getError.value ) {getError.value = "Enregistrement non trouvé ! "}
                // getError.value = getError.value
                if( document.value) {
                  id.value = document.value.id
                  designation.value = document.value.designation
                  pau.value = document.value.pau
                  pvu.value = document.value.pvu
                  fournisseurId.value = document.value.fournisseurId
                  codeFamille.value = document.value.codeFamille
                  expiration.value = document.value.expiration
                  seuil.value = document.value.seuil
                }
            }
        })

        const handleSubmit = async () => {

            const produit = {
                designation: designation.value,
                pau: Number(pau.value),
                pvu: Number(pvu.value),
                fournisseurId: fournisseurId.value,
                codeFamille: codeFamille.value,
                expiration: expiration.value,
                seuil: Number(seuil.value),
                updatedAt: serverTimestamp()
            }
            // console.log("fournisseur : ", fournisseur)
            await update("produits", produit, route.params.id)
            if(!updateError.value){
                document.querySelector(".active form").reset()
                designation.value=''
                pau.value = ''
                pvu.value=''
                seuil.value=''
                fournisseurId.value=''
                codeFamille.value= ''
                goBack()
            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            id,
            designation,
            pau,
            pvu,
            codeFamille,
            fournisseurId,
            nomFournisseur,
            prenomFournisseur,
            contactFournisseur,
            expiration,
            seuil,
            familles,
            fournisseurs,
            hideModal,
            updateError,
            getError,
            goBack,

        }
    }
}
</script>

<style>

</style>
