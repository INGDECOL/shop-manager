<template>
  <header class="header">
      <div class="flex justify-between items-center m-1">
          <img src="../assets/logo.png" alt="Logo"  width="50" srcset="" class="mr-1">
        <h1>Ets N'NAHAWA MS</h1>
      </div>
        <nav>
            <router-link :to="{ name: 'Home' }">Accueil</router-link>
            <router-link :to="{ name: 'Home' }" v-if="!user" @click="openLogin">Se connecter</router-link>
            <!-- <router-link :to="{ name: 'SignUp' }" v-else>Register</router-link> -->
            <router-link :to="{ name: 'Home'}" v-if="user">Enquetes</router-link>
            <span @click="signOut" v-if="user">Logout</span>
        </nav>
    </header>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter } from "vue-router";
import getToken from '../controllers/getToken'
import { auth } from '../firebase/config'
import useLogout from '../controllers/useLogout'
export default {
    setup (props, context) {
        const user = ref(auth.currentUser)
        const { logout, error } = useLogout()
        const  token = ref(null)
        const router = useRouter()
        const openLogin = () => {
            context.emit('open')
        }
        auth.onAuthStateChanged((_user) =>{
            user.value = _user
            token.value = user.value && user.value.accessToken
        })
        //console.log("accessToken : ", token.value)
        const signOut = async () =>{
            await logout()
            if(!error.value){
                router.push({ name: 'Home'})
            }else console.log(error.value)
        }
        return { token, user, signOut, openLogin}

    }

}
</script>

<style>

</style>
