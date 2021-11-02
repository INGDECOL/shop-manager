<template>
      <div class="create " @click="hideModal">
          <span class="material-icons">close</span>
        <div class="modal active">
            <h2 class="mb-2">NOUVEAU RAYON</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="rayon"   class="uppercase" placeholder="Designation du rayon" required v-model="rayonN">
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
        const rayonN = ref('')
        const description = ref('')
        const { createError, create } = createDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const handleSubmit = async () => {

            const rayon = {
                rayon: rayonN.value,
                description: description.value,
                createdAt: serverTimestamp()
            }
            // console.log("rayon : ", rayon)
            await create("rayons", rayon)
            if(!createError.value){
                document.querySelector(".create form").reset()
                rayonN.value=''
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
            rayonN,
            description,
            hideModal,
            createError,

        }
    }
}
</script>

<style>

</style>
