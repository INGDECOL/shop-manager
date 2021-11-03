<template>
      <div class="create " @click="hideModal">
          <span class="material-icons">close</span>
        <div class="modal active">
            <h2 class="mb-2">NOUVELLE FAMILLE DE PRODUIT</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="codeFamille"   class="uppercase" placeholder="Code Famille" required v-model="codeFamille">
                <input type="text" name="nomFamille"   class="uppercase" placeholder="Nom complet Famille" required v-model="nomFamille">
                <input type="text" name="description" placeholder="Description du rayon"   v-model="description">

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
    //props: [ 'editrayonId'],
    setup(props) {
        const id = ref('')
        const codeFamille = ref('')
        const nomFamille = ref('')
        const description = ref('')
        const { createError, create } = createDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const handleSubmit = async () => {

            const rayon = {
                codeFamille: codeFamille.value.toUpperCase(),
                nomFamille: nomFamille.value,
                description: description.value,
                createdAt: serverTimestamp()
            }
            // console.log("rayon : ", rayon)
            await create("familles", rayon)
            if(!createError.value){
                document.querySelector(".create form").reset()
                codeFamille.value=''
                nomFamille.value=''
                description.value = ''
            }
        }
        // computed ( () => {
        //     console.log("computed")
        //     if(props.editrayonId ){
        //         console.log("props rayon : ", props.editrayonId)

        //     }
        // })

        return {
            handleSubmit,
            id,
            codeFamille,
            nomFamille,
            description,
            hideModal,
            createError,

        }
    }
}
</script>

<style>

</style>
