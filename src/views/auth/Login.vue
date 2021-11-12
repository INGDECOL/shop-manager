<template>
    <div class="auth ">
      <div class="modal active">
        <h2 class="mb-2">CONNECTEZ VOUS</h2>
        <form class="login" @submit.prevent="handleSubmit">
          <input type="email" name="email" placeholder="Email" required v-model="email">
          <input type="password" name="password" placeholder="Password" required v-model="password">
          <button>Se connecter</button>
          <p class="error">{{ signError }}</p>
        </form>
        <div>
            No account? <a class="switch" @click="toggleForm">Register instead</a>
        </div>
      </div>
    <SignUp />
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import useSingIn from "../../controllers/useSignIn"
//import useSingUp from "../../controllers/useSignUp"
import { useRouter } from 'vue-router'
import SignUp from "./Signup.vue"
export default {
    components: { SignUp },
    setup() {
        const open = ref(true)
        const router = useRouter()
        const name = ref('')
        const email = ref(null)
        const password = ref(null)
        const { auth, signIn, signError} = useSingIn()


        const toggleForm = () => {
            document.querySelectorAll(".auth .modal").forEach(form => {
                form.classList.toggle("active")
            })
        }

        const handleSubmit = async () => {
            // console.log("email : ",email.value,password.value) 
            await signIn(email.value, password.value)

            if(!signError.value) {
                // console.log( "user logged In ...")
                // console.log("auth : ", auth.currentUser)
                 document.querySelectorAll(".auth form").forEach(form => form.reset())
                 document.querySelector(".auth").classList.remove("open")
                // router.push( { name: 'Home'})
            }else  console.log(" console.error() :" , signError.value)
        }


        return { open, handleSubmit, email, password,  signError, toggleForm }
    }
}
</script>

<style>

</style>
