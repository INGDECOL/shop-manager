<template>
    <div class=" ml-auto mr-auto mt-8">
      <div class="modal active">
        <h2 class="mb-2 font-bold text-lg">CONNECTEZ VOUS</h2>
        <form class="login" @submit.prevent="handleSubmit">
          <input type="email" name="email" placeholder="Email" required v-model="email">
          <input type="password" name="password" placeholder="Password" required v-model="password">
          <button>Se connecter</button>
          <p class="error">{{ signError }}</p>
        </form>
        <div class="font-semibold">
            No account? <a class="switch underline text-blue-400 hover:text-blue-500 cursor-pointer" @click="toggleForm">Register instead</a>
        </div>
      </div>
    <!-- <SignUp /> -->
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
            // document.querySelectorAll(".auth .modal").forEach(form => {
            //     form.classList.toggle("active")
            // })
            alert("Pour avoir un nouveau compte, veuillez contacter l'administrateur au : \n Tel : 622 22 91 14 \n Email : younoussa41@gmail.com")
        }

        const handleSubmit = async () => {
            // console.log("email : ",email.value,password.value)
            await signIn(email.value, password.value)

            if(!signError.value) {
                // console.log( "user logged In ...")
                // console.log("auth : ", auth.currentUser)
                 document.querySelectorAll(".auth form").forEach(form => form.reset())
                //  document.querySelector(".auth").classList.remove("open")
                router.push( { name: 'Home'})
            }else  console.log(" console.error() :" , signError.value)
        }


        return { open, handleSubmit, email, password,  signError, toggleForm }
    }
}
</script>

<style>

</style>
