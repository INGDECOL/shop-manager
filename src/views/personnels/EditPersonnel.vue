<template>
      <div class=" mx-auto" @click="hideModal">
        <div class="modal active">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="mb-2 font-semibold">MODIFICATION INFO PERSONNEL</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="name" placeholder="Nom complet" v-model="nom">
                <input type="tel" name="phone" placeholder="Contact" v-model="contact">
                <input type="email" name="email" placeholder="Email" v-model="email">
                <!-- <input type="password" name="password" placeholder="Mot de passe" v-model="password">
                <input type="password" name="confirmPassword" placeholder="Confirmez le mot de passe" v-model="confirmPassword"> -->
                <select name="fonction" required v-model="fonction">
                    <option value="" selected>Selectionner le type d'utilisateur</option>
                    <option value="Administrateur" selected>Administrateur</option>
                    <option value="Commercial" selected>Commercial</option>
                    <option value="Utilisateur" selected>Utilisateur</option>
                </select>
                <hr>
                <input type="text" name="salaireBase" placeholder="Salaire de Base" v-model="salaireBase" title="Salaire de base">
                <input type="text" name="indemnites" placeholder="Indemnites" v-model="indemnites" title="Indemnités">
                <button>Modifier</button>
                <p class="error">{{ geterror }}</p>
                <p class="error">{{ updateError }}</p>
            </form>
            <div>
            </div>
        </div>
    </div>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import updateDocument from "../../controllers/updateDocument"
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../../firebase/config'
import getDocument from '../../controllers/getDocument'
export default {
    props: [ 'editFournisseurId'],
    setup(props) {
        const id = ref('')
        const nom = ref('')
        const prenom = ref('')
        const contact = ref('')
        const fonction = ref('')
        const email = ref('')
        const salaireBase = ref()
        const indemnites = ref()
        const salaireNet = ref()
        const geterror = ref('')
        const listeSalaires = ref()
        const route = useRoute()
        const router = useRouter()
        const { updateError, update } = updateDocument()

        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const getSalaires = async(id) => {
            const docRef = doc(db, "salaires", id)
            const q = await getDoc(docRef)//, orderBy("createdAt", "desc"))
            if(q.exists()){
                console.log("q : ", q.data())
                salaireBase.value = q.data().salaireBase
                indemnites.value = q.data().indemnites

            }else {
                indemnites.value = "Indefinies"
                salaireBase.value ="Indefini"
            }
            // const res = onSnapshot(q, snap => {
            // listeSalaires.value = snap.docs.map(doc =>{
            //     return {...doc.data(), id:doc.id}
            // })
            // })
      }

        onMounted( async () => {
            //console.log("onMounted ")

            if( route.params.id) {
                const { document, getError, load } = getDocument()
                geterror.value =null

                await load("users",route.params.id)
                if( getError.value ) {geterror.value = "Enregistrement non trouvé ! "}

                if( document.value) {
                    // console.log("found : ", document.value)
                    id.value = document.value.id
                    nom.value = document.value.nom
                    // prenom.value = document.value.prenom
                    fonction.value = document.value.fonction
                    contact.value = document.value.phoneNumber
                    email.value = document.value.email
                    getSalaires(id.value)

                }
            }
        })

        const handleSubmit = async () => {

            const personnel = {
                //id: id.value,
                nom: nom.value,
                // prenom: prenom.value,
                phoneNumber: contact.value,
                fonction: fonction.value,
                // email: email.value,
                updatedAt: serverTimestamp()
            }
            //MODIFICATION DES INFOS
            await update("users", personnel, id.value)
            if(isNaN(salaireBase.value) || isNaN(indemnites.value)) {
                alert("Saisie incorrecte salaire de base ou indemnités incorrect")
                console.log("salaire : ", salaireBase.value, "indem : ", indemnites.value)
                return
            }
            // MODIFICATION OU CREATION DU SALAIRE
            const salaire = {
                salaireBase : Number(salaireBase.value),
                indemnites : Number(indemnites.value),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()

            }
            try {
                await update("salaires", salaire, id.value)
                if(updateError.value) throw new Error(updateError.value)
            } catch (error) {
                if(error.toString().indexOf("No document") !== -1) {
                    updateError.value=null
                    const salaireRef = doc(db, "salaires", id.value)
                    await setDoc(salaireRef, salaire)
                }

            }

            if(!updateError.value){
                id.value =''
                nom.value=''
                fonction.value = ''
                contact.value=''
                // adresse.value=''
                email.value= ''
                router.push( { name: "ListePersonnel", params : { token: auth.currentUser.accessToken}})

            }
        }

        const goBack = () => {
            router.back()
        }


        return {
            handleSubmit,
            id,
            nom,
            fonction,
            contact,
            email,
            indemnites,
            salaireBase,
            hideModal,
            geterror,
            updateError,
            goBack,

        }
    }
}
</script>

<style>

</style>
