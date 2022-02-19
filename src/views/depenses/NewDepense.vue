<template>
      <div class="mx-auto w-3/4 " @click="hideModal">
        <div class="modal active">
            <h3 class="text-center font-bold uppercase text-xl my-2 ">Nouvelle depense</h3>
            <form  @submit.prevent="handleSubmit">
                <!-- <input type="hidden" name="id" v-model="id"> -->
                <input type="text" name="depenseDestinataire"   class="uppercase" placeholder="Demandeur" required v-model="depenseDestinataire" disabled>

                <input type="date" name="dateDepense" placeholder="dateDepense"  v-model="dateDepense">

                <input type="text" name="montantDepense"  placeholder="Montant"  v-model="montantDepense" required>

                <input type="text" name="intitule" placeholder="intitule"  v-model="intitule">
                <!-- <input type="email"  name="email" placeholder="example@gmail.com"   v-model="email"> -->
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
import { onMounted, onUnmounted, watch } from '@vue/runtime-core'
import { serverTimestamp } from '@firebase/firestore'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase/config'
export default {
    // props: [ 'editdepenseId'],
    setup(props) {
        const id = ref('')
        const depenseDestinataire = ref('')
        const dateDepense = ref('')
        const montantDepense = ref('')
        const intitule = ref('')
        const email = ref('')
        const router = useRouter()
        const { createError, create } = createDocument()

        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }
        const verfiDate = ()=> {
            // console.log(dateDepense.value)
        }
        onMounted( () => {
            depenseDestinataire.value = auth.currentUser.displayName
            let now = new Date()
            let month = (now.getMonth() + 1)
            let day = now.getDate()
            if (month < 10)
                month = "0" + month;
            if (day < 10)
                day = "0" + day
            let today = now.getFullYear() + '-' + month + '-' + day;
            dateDepense.value = today
            // console.log("today", dateDepense.value)
        })
        const handleSubmit = async () => {

            const depense = {
                depenseDestinataire: depenseDestinataire.value,
                dateDepense: dateDepense.value,
                montantDepense: Number(montantDepense.value),
                intitule: intitule.value,
                createdAt: serverTimestamp()
            }
            //console.log("depense : ", depense)
            await create("depenses", depense)
            if(!createError.value){
                alert("Sortie Enregistré avec succès !")
                // depenseDestinataire.value=''
                dateDepense.value = ''
                montantDepense.value=''
                intitule.value=''
                 router.push({ name: "ListeDepense", params: { token: auth.currentUser.accessToken}})
            }
        }
        watch( montantDepense, ()=> {
            // console.log(montantDepense.value)
            if( isNaN(montantDepense.value)) {
                alert("Saisi incorrect ! \n Le montant doit être un nombre entier positif")
            }
        })

        return {
            handleSubmit,
            verfiDate,
            id,
            depenseDestinataire,
            dateDepense,
            montantDepense,
            intitule,
            hideModal,
            createError,

        }
    }
}
</script>

<style>

</style>
