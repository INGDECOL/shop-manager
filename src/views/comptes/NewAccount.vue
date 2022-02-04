<template>
      <div class="create uto mr-auto" @click="hideModal">
          <span class="material-icons">close</span>
        <div class="modal active">
            <h2 class="mb-2 font-bold">NOUVEAU COMPTE AUXILLIAIRE</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="nom"   class="uppercase" placeholder="Nom" required v-model="nom">
                <input type="text" name="prenom"   class="uppercase" placeholder="Prenoms" v-model="prenom">
                <input type="text" name="contact" placeholder="Telephone"   v-model="contact" required>
                <input type="text" name="fondDepart" placeholder="Fond de depart"   v-model="fondDepart" required>

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
import destroyDocument from '../../controllers/destroyDocument'
export default {
    //props: [ 'editrayonId'],
    setup(props) {
        const id = ref('')
        const nom = ref('')
        const prenom = ref('')
        const contact = ref('')
        const fondDepart = ref('')
        const { createError, create } = createDocument()
        const { destroy } = destroyDocument()

        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }

        const handleSubmit = async () => {

            const compte = {
                nom: nom.value.toUpperCase(),
                prenom: prenom.value,
                contact: contact.value,
                fondDepart: Number( fondDepart.value),
                createdAt: serverTimestamp()
            }
            // console.log("rayon : ", rayon)
            let res = await create("comptes", compte)
            console.log("result : ", res)
            const mouvement = {
                compteId : res.id,
                operation: "Versement",
                montant: Number(fondDepart.value),
                createdAt: serverTimestamp()
            }
            // console.log("mouvement : ", mouvement)
            await create("mouvements", mouvement)
            if(!createError.value){
                document.querySelector(".create form").reset()
                nom.value=''
                prenom.value=''
                contact.value = ''
            }
        }

        return {
            handleSubmit,
            id,
            nom,
            prenom,
            contact,
            fondDepart,
            hideModal,
            createError,
            destroy,

        }
    }
}
</script>

<style>

</style>
