<template>
      <div class="mx-auto w-3/4 " @click="hideModal">
        <div class="modal active">
            <h2 class="mb-2">NOUVEAU CLIENT</h2>
            <form  @submit.prevent="handleSubmit">
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <input type="text" name="nom"   class="uppercase" placeholder="Nom du client" required v-model="nom">
                <input type="text" name="prenom" placeholder="Prénom"   v-model="prenom">
                <input type="tel" name="contact"  placeholder="Contact ex: 620 010 010"  v-model="contact" required>
                <input type="text" name="adresse" placeholder="Adresse / Domicile"   v-model="adresse">
                <input type="email"  name="email" placeholder="example@gmail.com"   v-model="email">
                <button>Enregistrer</button>
                <p class="error">{{ createError }}</p>
            </form>
            <div>
            </div>
        </div>
    </div>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import createDocument from "../../controllers/createDocument"
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { serverTimestamp } from '@firebase/firestore'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase/config'
export default {
    // props: [ 'editclientId'],
    setup(props) {
        const id = ref('')
        const nom = ref('')
        const prenom = ref('')
        const contact = ref('')
        const adresse = ref('')
        const email = ref('')
        const router = useRouter()
        const { createError, create } = createDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const handleSubmit = async () => {

            const client = {
                nom: nom.value,
                prenom: prenom.value,
                contact: contact.value,
                adresse: adresse.value,
                email: email.value,
                createdAt: serverTimestamp()
            }
            //console.log("client : ", client)
            await create("clients", client)
            if(!createError.value){
                // document.querySelector(".create form").reset()
                nom.value=''
                prenom.value = ''
                contact.value=''
                adresse.value=''
                email.value= ''
                 router.push({ name: "Clients", params: { token: auth.currentUser.accessToken}})
            }
        }
        // computed ( () => {
        //     console.log("computed")
        //     if(props.editclientId ){
        //         console.log("props client : ", props.editclientId)

        //     }
        // })

        return {
            handleSubmit,
            id,
            nom,
            prenom,
            contact,
            adresse,
            email,
            hideModal,
            createError,

        }
    }
}
</script>

<style>

</style>
