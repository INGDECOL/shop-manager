<template>
    <div class="create bon -mt-8" @click="hideModal">
        <div class="modal active">
            <h2 class="font-bold ">FAIRE UN BON SUR SALAIRE</h2>
            <form class="register" @submit.prevent="handleSignUp">
            <input type="hidden" name="id" id="id" placeholder="Nom complet" v-model="id">
            <input type="text" name="name" id="name" placeholder="Nom complet" v-model="name" disabled>
            <input type="tel" name="phone" id="phone" placeholder="Contact" v-model="phone" disabled>
            <!-- <input type="email" name="email" id="email" placeholder="Email" v-model="email" disabled> -->
            <input type="text" name="fonction" id="fonction" placeholder="Fonction" required v-model="fonction" disabled>

            <hr>
            <input type="text" name="salaireBase" id="salaireBase" placeholder="Salaire de Base" v-model="salaireBase" class="text-center font-bold" disabled>
            <input type="text" name="indemnites" id="indemnites" placeholder="Indemnites" v-model="indemnites" class="text-center font-bold" disabled>
            <input type="text" name="salaireNet" id="salaireNet" placeholder="salaire Net" v-model="salaireNet" class="text-center font-bold" disabled>
            <input type="text" name="antecedant" id="antecedant" placeholder="antecedant" v-model="antecedant" class="text-center font-bold" disabled>
            <input type="text" name="montantDemande" id="montantDemande" placeholder="Montant Demande" v-model="montantDemande" class="text-center font-bold">
            <p class="error text-xs italic">Les antécédants et le montant démandé ne peuvent pas depasser les 50% du S. net
            </p>
            <button>Valider</button>
            <p class="error">{{ setError }}</p>
            </form>
            <!-- <div>Got an account? <a class="switch" @click="toggleForm">Login instead</a></div> -->
        </div>

    </div>

</template>

<script>

    import { useRouter } from 'vue-router'
    import { ref } from '@vue/reactivity'
    import { onMounted } from '@vue/runtime-core'
    import { serverTimestamp } from '@firebase/firestore'
    import setDocument, { } from '../../controllers/setDocument'
    export default {

        setup() {
            const {  setError, insert} = setDocument()
            const id = ref('')
            const name = ref('')
            const email = ref('')
            const fonction = ref('')
            const phone = ref('')
            const salaireBase = ref()
            const indemnites = ref()
            const salaireNet = ref()
            const montantDemande = ref()
            const antecedant = ref()

            const hideModal = (e) => {
                if(e.target.classList.contains("bon")){
                    document.querySelector(".bon").classList.toggle("open")
                }
            }
            onMounted(()=>{
              name.value = "valuer essai"
            })

            const toggleForm = () => {
                document.querySelector(".create").classList.toggle("open")
            }

            const handleSignUp = async () => {

                let bon = {
                    personnelId: id.value,
                    nom: name.value,
                    montant: Number(montantDemande.value),
                    createdAt: serverTimestamp()
                }
                await insert("bons",bon, id.value)

                if(!setError.value) {
                    alert("Bon enregistré avec succès ! \n Le montant sera retenu sur la prochaine paie !")
                    id.value =''
                    name.value =''
                    email.value =''
                    fonction.value =''
                    phone.value =''
                    salaireBase.value =''
                    indemnites.value =''
                    salaireNet.value =''
                    montantDemande.value =''
                    antecedant.value =''
                    toggleForm()
                    // router.push( { name: 'Home'})
                }else  console.log(" seterr Error :" , setError.value)
            }

            return {
                id,
                handleSignUp,
                email,
                name,
                phone,
                fonction,
                setError,
                toggleForm,
                hideModal,
                salaireBase,
                indemnites,
                salaireNet,
                antecedant,
                montantDemande,

            }


        }

    }
</script>

<style>

</style>
