<template>
    <div class="create" @click="hideModal">
        <div class="modal active">
            <h2>Nouveau Personnel</h2>
            <form class="register" @submit.prevent="handleSignUp">
            <input type="text" name="name" placeholder="Nom complet" v-model="name">
            <input type="tel" name="phone" placeholder="Contact" v-model="phone">
            <input type="email" name="email" placeholder="Email" v-model="email">
            <input type="password" name="password" placeholder="Mot de passe" v-model="password">
            <input type="password" name="confirmPassword" placeholder="Confirmez le mot de passe" v-model="confirmPassword">
            <select name="fonction" required v-model="fonction">
                <option value="" selected>Selectionner le type d'utilisateur</option>
                <option value="Administrateur" selected>Administrateur</option>
                <option value="Commercial" selected>Commercial</option>
                <option value="Utilisateur" selected>Utilisateur</option>
            </select>
            <button>Register</button>
            <p class="error">{{ signUpError }}</p>
            </form>
            <div>Got an account? <a class="switch" @click="toggleForm">Login instead</a></div>
        </div>

    </div>

</template>

<script>

    import useSingUp from "../../controllers/useSignUp"
    import { useRouter } from 'vue-router'
import { ref } from '@vue/reactivity'
    export default {

        setup() {
            const { signUp, signUpError } = useSingUp()
            const name = ref('')
            const email = ref('')
            const password = ref('')
            const fonction = ref('')
            const phone = ref('')
            const confirmPassword  = ref('')

        const hideModal = (e) => {
            if(e.target.classList.contains("create")){
                document.querySelector(".create").classList.toggle("open")
            }
        }

        const toggleForm = () => {
            document.querySelector(".create").classList.toggle("open")
        }

            const handleSignUp = async () => {
                signUpError.value =''
                if( password.value !== confirmPassword.value ) {
                    signUpError.value = "Les deux mots de passe ne sont pas identiques"
                    return
                }
                let data = {
                    displayName: name.value,
                    email: email.value,
                    password: password.value,
                    fonction: fonction.value,
                    phoneNumber: phone.value,
                }
                const res = await signUp(data)

                if(!signUpError.value) {
                    email.value = ''
                    password.value = ''
                    name.value = ''
                    phone.value = ''
                    fonction.value = ''
                    confirmPassword.value = ''
                    toggleForm()
                    // router.push( { name: 'Home'})
                }else  console.log(" SignUp Error :" , signUpError.value)
            }

            return {  handleSignUp, email, password, name, phone, fonction, confirmPassword, signUpError, toggleForm, hideModal }


        }

    }
</script>

<style>

</style>
