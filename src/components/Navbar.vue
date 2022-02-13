<template>
  <header class="header">
      <div class="flex justify-between items-center m-1 ">
          <img src="../assets/logo.png" alt="Logo"  width="50" srcset="" class="mr-1" id="navLogo">
        <h1>Ets N'NAHAWA MS</h1>
      </div>
        <nav>
            <router-link :to="{ name: 'Home' }" class="headerLink">Accueil</router-link>
            <router-link :to="{ name: 'Home' }" v-if="!user" @click="openLogin" class="headerLink">Se connecter</router-link>
            <!-- <router-link :to="{ name: 'SignUp' }" v-else>Register</router-link> -->
            <a  v-if="user" class="mr-0 menu headerLink">
                Ventes
                <span class="material-icons text-xs border-none ml-0">arrow_forward_ios</span>
                <div class="dropdown-popover z-10 w-auto ml-10  mt-1.5">
                    <div class="options">
                        <ul>
                            <router-link :to="{ name: 'Vente', params: { token: user.accessToken}}" >
                                <li>Nouvelle vente</li>
                            </router-link>
                            <router-link :to="{ name: 'ListeVente', params: { token: user.accessToken}}">
                                <li>Liste des ventes</li>
                            </router-link>
                            <router-link :to="{ name: 'CompteClient', params: { token: user.accessToken }}">
                                <li>Compte Client</li>
                            </router-link>
                        </ul>

                    </div>
                </div>
            </a>
            <!-- <a  v-if="user && isAdmin" class="mr-0 menu headerLink">
                Personnels
                <span class="material-icons text-xs border-none ml-0">arrow_forward_ios</span>
                <div  class="dropdown-popover z-10 w-auto ml-40  mt-1.5">
                    <div class="options">
                        <ul>
                            <router-link :to="{ name: 'ListePersonnel', params: { token: user.accessToken}}" >
                                <li>Liste du Personnel</li>
                            </router-link>
                            <router-link :to="{ name: 'ListeVente', params: { token: user.accessToken}}">
                                <li>Indeminites...</li>
                            </router-link>
                            <router-link :to="{ name: 'CompteClient', params: { token: user.accessToken }}">
                                <li>Faire un Bon</li>
                            </router-link>
                        </ul>

                    </div>
                </div>
            </a> -->
            <span @click="signOut" v-if="user" class="pl-0">

                <span class="material-icons border-none -mb-8 mr-0  pb-0 text-sm">logout</span> Logout
            </span>
        </nav>
    </header>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter } from "vue-router";
import getToken from '../controllers/getToken'
import { auth } from '../firebase/config'
import useLogout from '../controllers/useLogout'
import getUser from '../controllers/getUser'
export default {
    setup (props, context) {
        const user = ref(auth.currentUser)
        const { logout, error } = useLogout()
        const  token = ref(null)
        const router = useRouter()
        const openLogin = () => {
            // context.emit('open')
            router.push({ name: 'Login'})
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
        const isAdmin = () => {
            const { findUser, error, user } = getUser()
            let _user = auth.currentUser
            //console.log("userssss : ", _user.uid)
            if(_user) {
                 findUser(_user.uid)

                // console.log("requireAuthAdmin : ", user.value.fonction)
                if(user.value.fonction == 'Administrateur'){
                    console.log("isAdmin : ", user.value.fonction)
                    return true
                } else {
                    console.log("not Admin : ", user.value.fonction)
                    return false
                }
                }
        }
        return { token, user, signOut, openLogin, isAdmin}

    }

}
</script>

<style>

</style>
