<template>
      <div class=" mx-auto" @click="hideModal">
        <div class="modal active">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="mb-2 font-semibold">EDITION RAYON</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="nom"   class="uppercase" placeholder="Designation du rayon" required v-model="rayonN">
                <input type="text" name="Description du rayon" placeholder="Prénom"   v-model="description">

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
    props: [ 'editrayonId'],
    setup(props) {
        const id = ref('')
        const rayonN = ref('')
        const description = ref('')
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
            // console.log("onMounted ")

            if( route.params.id) {
                const { document, getError, load } = getDocument()
                geterror.value =null
                await load("rayons",route.params.id)
                if( getError.value ) {geterror.value = "Enregistrement non trouvé ! "}

                if( document.value) {
                    //console.log("document : ", document)
                    id.value = document.value.id
                    rayonN.value = document.value.rayon
                    description.value = document.value.description


                }
            }
        })
        const handleSubmit = async () => {

            const rayon = {
                //id: id.value,
                rayon: rayonN.value,
                description: description.value,
                updatedAt: serverTimestamp()
            }
            // console.log("rayon : ", rayon)
            await update("rayons", rayon, id.value)
            if(!updateError.value){
                id.value =''
              rayonN.value = ""
              description.value = ''
                router.push( { name: "rayons", params : { token: auth.currentUser.accessToken}})

            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            id,
            rayonN,
            description,
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
