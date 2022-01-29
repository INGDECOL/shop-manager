<template>
    <div class="ml-auto mr-auto mt-8" @click="hideModal">
        <div class="border border-collapse rounded p-2">
            <h2 class="font-bold mb-2">GESTION DU MOT DE PASSE</h2>
            <form class="" @submit.prevent="resetPassword">
            <input type="text" name="name" placeholder="Nom complet" v-model="name" disabled>
            <input type="tel" name="phone" placeholder="Contact" v-model="phone" disabled>
            <input type="email" name="email" placeholder="Email" v-model="email" disabled>
            <!-- <select name="fonction" required v-model="fonction">
                <option value="" selected>Selectionner le type d'utilisateur</option>
                <option value="Administrateur" selected>Administrateur</option>
                <option value="Commercial" selected>Commercial</option>
                <option value="Utilisateur" selected>Utilisateur</option>
            </select>
            <hr>
            <input type="text" name="salaireBase" placeholder="Salaire de Base" v-model="salaireBase">
            <input type="text" name="indemnites" placeholder="Indemnites" v-model="indemnites"> -->
            <button class="bg-transparent border border-blue-400 hover:bg-blue-400 hover:text-gray-700" @click.prevent="resetPassword">Reinitialiser le password</button>
            <p class="error">{{ signUpError }}</p>
            </form>
        </div>

    </div>

</template>

<script>

    import useSingUp from "../../controllers/useSignUp"
    import { useRouter } from 'vue-router'
    import { ref } from '@vue/reactivity'
    import getUser from '../../controllers/getUser'
    import { onMounted } from '@vue/runtime-core'
    import { auth } from '../../firebase/config'
    import { getAuth, sendPasswordResetEmail } from "firebase/auth"
    export default {

        setup() {
            const { signUp, signUpError } = useSingUp()
            const name = ref('')
            const email = ref('')
            const password = ref('')
            const fonction = ref('')
            const phone = ref('')
            const confirmPassword  = ref('')
            const salaireBase = ref()
            const indemnites = ref()
            const salaireNet = ref()
            const { findUser, user } = getUser()

            const hideModal = (e) => {
                if(e.target.classList.contains("create")){
                    document.querySelector(".create").classList.toggle("open")
                }
            }

            const toggleForm = () => {
                document.querySelector(".create").classList.toggle("open")
            }

            const loadUser =async () => {
                await findUser(auth.currentUser.uid)
                if(user) {
                    // console.log(user.value)
                    name.value = user.value.nom
                    phone.value = user.value.phoneNumber
                    email.value = user.value.email
                }
            }

            onMounted(async () => {
                // console.log(auth.currentUser.uid)
                    findUser(auth.currentUser.uid)
                loadUser()

                console.log(name.value, phone.value, email.value)
            })

            const resetPassword = async () => {
                const auth = getAuth()
                auth.languageCode = 'fr'
                sendPasswordResetEmail(auth, auth.currentUser.email)
                .then(() => {
                    alert("L'email de reinitialisation du Mot de passe a été envoyé à votre addresse mail, \n Verifier votre boite de reception")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("error : ", errorCode, errorMessage)
                })

            }

            return {
                resetPassword,
                email,
                password,
                name,
                phone,
                fonction,
                confirmPassword,
                signUpError,
                toggleForm,
                hideModal,
                salaireBase,
                indemnites,
                salaireNet,

            }


        }

    }
</script>
