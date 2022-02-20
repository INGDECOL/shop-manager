<template>
    <!-- <div class=" bg-blue-200 flex"> -->
    <div class=" ml-auto mr-auto mt-8">
      <!-- <div class="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5"> -->
      <div class="modal active  border-t-4 border-green-500">
          <div class="flex justify-between items-">
            <h2 class="mt-6 font-bold text-2xl text-green-600 font-JosefinI">CONNECTEZ VOUS</h2>
            <img src="@/assets/logo.png" alt="Logo" width="70" class="-mt-5 mb-2">

          </div>
        <form class="login" @submit.prevent="handleSubmit">
            <div class="flex justify-start items-center w-full   bg-white  rounded ">
              <span class="material-icons -mr-5 z-10">account_circle</span>
              <input type="email" name="email" placeholder="Emai" required v-model="email" class="pl-5">
            </div>
            <div class="flex justify-start items-center w-full   bg-white  rounded">
              <span class="material-icons -mr-5 z-10">key</span>
              <input type="password" name="password" placeholder="Password" required v-model="password" class="pl-5">
            </div>

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
