<template>
      <div class="create " @click="hideModal">
        <div class="modal active">
            <h2 class="mb-2">NOUVELLE BOUTIQUE</h2>
            <form  @submit.prevent="handleSubmit">
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <input type="text" name="nom"   class="uppercase" placeholder="Designation de la boutique" required v-model="designationBoutique">
                <select name="gerant" v-model="gerantBoutique" required>
                    <option value="">Selectionnez le gerant principal</option>
                    <option v-for="gerant in listGerant " :key="gerant.email" :value="gerant.email">{{ gerant.email }} {{ gerant.phoneNumber }}</option>
                </select>
                <!-- <input type="tel" name="contact"  placeholder="Contact ex: 620 010 010"  v-model="contact" required>
                <input type="text" name="adresse" placeholder="Adresse / Domicile"   v-model="adresse">
                <input type="email"  name="email" placeholder="example@gmail.com"   v-model="email"> -->
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
import getDocuments from "../../controllers/getDocuments"
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { collection, onSnapshot, serverTimestamp } from '@firebase/firestore'
import { db } from '../../firebase/config'
export default {
    // props: [ 'editclientId'],
    setup(props) {
        const id = ref('')
        const designationBoutique = ref('')
        const gerantBoutique = ref('')
        const listGerant = ref(null)
        const adresse = ref('')
        const email = ref('')
        const { createError, create } = createDocument()
        const { documents, getError, load } = getDocuments()

        const getGerants = async () => {
            const docRef = collection(db, "users")
            const res = onSnapshot(docRef, (snap)=>{
                listGerant.value = snap.docs.map(doc => {
                    // console.log("snap doc : ", doc.data());
                    return {...doc.data(), id: doc.id}
                })
            })

        }

        onMounted( async () =>{
            getGerants()
        })

        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const handleSubmit = async () => {

            const boutique = {
                designationBoutique: designationBoutique.value,
                gerantBoutique: gerantBoutique.value,
                createdAt: serverTimestamp()
            }
            //console.log("client : ", client)
            await create("boutiques", boutique)
            if(!createError.value){
                document.querySelector(".create form").reset()
                designationBoutique.value=''
                gerantBoutique.value = ''
                
            }
        }
        return {
            handleSubmit,
            id,
            designationBoutique,
            gerantBoutique,
            listGerant,
            hideModal,
            createError,

        }
    }
}
</script>

<style>

</style>
