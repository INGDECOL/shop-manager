<template>
      <div class="create " @click="hideModal">
        <div class="modal active">
            <h2 class="mb-2">NOUVEAU FOURNISSEUR</h2>
            <form  @submit.prevent="handleSubmit">
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <!-- <div class="form-field__control"> -->
                    <!-- <label for="nom" class="form-field__label" >Nom du fournisseur</label> -->
                    <input type="text" name="nom" id="nom" class="form-field__input uppercase" placeholder="Nom du fournisseur" required v-model="nom">
                <!-- </div> -->
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
export default {
    // props: [ 'editFournisseurId'],
    setup(props) {
        const id = ref('')
        const nom = ref('')
        const prenom = ref('')
        const contact = ref('')
        const adresse = ref('')
        const email = ref('')
        const { createError, create } = createDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const handleSubmit = async () => {

            const fournisseur = {
                nom: nom.value,
                prenom: prenom.value,
                contact: contact.value,
                adresse: adresse.value,
                email: email.value,
                createdAt: serverTimestamp()
            }
            // console.log("fournisseur : ", fournisseur)
            await create("fournisseurs", fournisseur)
            if(!createError.value){
                document.querySelector(".create form").reset()
                nom.value=''
                prenom.value = ''
                contact.value=''
                adresse.value=''
                email.value= ''
            }
        }
        // computed ( () => {
        //     console.log("computed")
        //     if(props.editFournisseurId ){
        //         console.log("props fournisseur : ", props.editFournisseurId)

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
