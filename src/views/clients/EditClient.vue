<template>
      <div class=" mx-auto" @click="hideModal">
        <div class="modal active">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="mb-2 font-semibold">EDITION CLIENT</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="nom"   class="uppercase" placeholder="Nom du client" required v-model="nom">
                <input type="text" name="prenom" placeholder="Prénom"   v-model="prenom">
                <input type="tel" name="contact"  placeholder="Contact ex: 620 010 010"  v-model="contact" required>
                <input type="text" name="adresse" placeholder="Adresse / Domicile"   v-model="adresse">
                <input type="email"  name="email" placeholder="example@gmail.com"   v-model="email">
                <button>Modifier</button>
                <p class="error">{{ geterror }}</p>
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
    props: [ 'editclientId'],
    setup(props) {
        const id = ref('')
        const nom = ref('')
        const prenom = ref('')
        const contact = ref('')
        const adresse = ref('')
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

                await load("clients",route.params.id)
                if( getError.value ) {geterror.value = "Enregistrement non trouvé ! "}

                if( document.value) {
                    //console.log("document : ", document)
                    id.value = document.value.id
                    nom.value = document.value.nom
                    prenom.value = document.value.prenom
                    adresse.value = document.value.adresse
                    contact.value = document.value.contact
                    email.value = document.value.email

                }
            }
        })
        const handleSubmit = async () => {

            const client = {
                //id: id.value,
                nom: nom.value,
                prenom: prenom.value,
                contact: contact.value,
                adresse: adresse.value,
                email: email.value,
                updatedAt: serverTimestamp()
            }
            await update("clients", client, id.value)
            if(!updateError.value){
                id.value =''
                nom.value=''
                prenom.value = ''
                contact.value=''
                adresse.value=''
                email.value= ''
                router.push( { name: "Clients", params : { token: auth.currentUser.accessToken}})

            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            id,
            nom,
            prenom,
            contact,
            adresse,
            email,
            hideModal,
            geterror,
            updateError,
            goBack

        }
    }
}
</script>

<style>

</style>
