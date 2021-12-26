<template>
  <Navbar @open="openLogin"/>
  <div class="flex">
  <sidebar v-if="!adminRoute" />
  <admin-sidebar v-else />
  <router-view/>

  </div>
</template>
<script>
  import Navbar from './components/Navbar.vue'
  import Sidebar from "./components/layouts/TheSidebar.vue"
  import AdminSidebar from "./components/layouts/AdminSidebar.vue"
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from '@vue/runtime-core'
  export default {
    components: { Navbar, Sidebar, AdminSidebar },
    setup() {
      const route = useRoute()
      const adminRoute = ref(false)
      const router = useRouter()
      const openLogin = () => {
      const loginForm = document.querySelector(".auth")
      loginForm.classList.toggle("open")
    }
    onMounted(() => {
      console.log("chemin ", route.name)
    })
    watch(route, () => {
      if(route.name == "Admin" || route.name == "ListePersonnel" || route.name == "Boutiques" || route.name == "Indemnite") {
        adminRoute.value = true
      } else adminRoute.value = false
      console.log("route changed to : ", route.name , adminRoute.value, route.redirectedFrom)

    })


    return { openLogin, adminRoute }
    },
  }
</script>
<style>
</style>
