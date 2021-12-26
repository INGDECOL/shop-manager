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
import { serverTimestamp } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../../firebase/config'
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
        const geterror = ref('')
        const route = useRoute()
        const router = useRouter()
        const { updateError, update } = updateDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        onMounted( async () => {
            //console.log("onMounted ")

            if( route.params.id) {
                const { document, getError, load } = getDocument()
                geterror.value =null

                await load("users",route.params.id)
                if( getError.value ) {geterror.value = "Enregistrement non trouvé ! "}

                if( document.value) {
                    console.log("found : ", document.value)
                    id.value = document.value.id
                    nom.value = document.value.nom
                    // prenom.value = document.value.prenom
                    fonction.value = document.value.fonction
                    contact.value = document.value.phoneNumber
                    email.value = document.value.email

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
                email: email.value,
                updatedAt: serverTimestamp()
            }
            //console.log("fournisseur : ", fournisseur)
            await update("users", personnel, id.value)
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
