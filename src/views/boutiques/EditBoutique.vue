<template>
      <div class=" mx-auto" @click="hideModal">
        <div class="modal active">
            <div class="flex justify-end -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>
            <h2 class="mb-2 font-semibold">EDITION BOUTIQUE</h2>
            <form  @submit.prevent="handleSubmit">
                <input type="text" class="hidden" name="id" v-model="id">
                <input type="text" name="nom"   class="uppercase" placeholder="Designation de la boutique" required v-model="designationBoutique">
                <select name="gerant" v-model="gerantBoutique" required>
                    <option value="">Selectionnez le gerant principal</option>
                    <option v-for="gerant in listGerant " :key="gerant.email" :value="gerant.email">{{ gerant.email }} {{ gerant.phoneNumber }}</option>
                </select>
                <!-- <input type="tel" name="contact"  placeholder="Contact ex: 620 010 010"  v-model="contact" required>
                <input type="text" name="adresse" placeholder="Adresse / Domicile"   v-model="adresse">
                <input type="email"  name="email" placeholder="example@gmail.com"   v-model="email"> -->
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
import { collection, onSnapshot, serverTimestamp } from '@firebase/firestore'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../../firebase/config'
import getDocument from '../../controllers/getDocument'
export default {
    props: [ 'editboutiqueId'],
    setup(props) {
        const id = ref('')
        const designationBoutique = ref('')
        const gerantBoutique = ref('')
        const listGerant = ref(null)
        const geterror = ref('')
        const route = useRoute()
        const router = useRouter()
        const { updateError, update } = updateDocument()
        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const getGerants = async () => {
            const docRef = collection(db, "users")
            const res = onSnapshot(docRef, (snap)=>{
                listGerant.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })

        }

        onMounted( async () => {
           getGerants()

            if( route.params.id) {
                const { document, getError, load } = getDocument()
                geterror.value =null

                await load("boutiques",route.params.id)
                if( getError.value ) {geterror.value = "Enregistrement non trouvé ! "}

                if( document.value) {
                    //console.log("document : ", document)
                    id.value = document.value.id
                    gerantBoutique.value = document.value.gerantBoutique
                    designationBoutique.value = document.value.designationBoutique

                }
            }
        })

        const handleSubmit = async () => {

            const boutique = {
                //id: id.value,
                designationBoutique: designationBoutique.value,
                gerantBoutique: gerantBoutique.value,
                updatedAt: serverTimestamp()
            }
            await update("boutiques", boutique, id.value)
            if(!updateError.value){
                id.value =''
                designationBoutique.value=''
                gerantBoutique.value = ''
                router.push( { name: "Boutiques", params : { token: auth.currentUser.accessToken}})

            }
        }
        const goBack = () => {
            router.back()
        }

        return {
            handleSubmit,
            id,
            designationBoutique,
            gerantBoutique,
            listGerant,
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
