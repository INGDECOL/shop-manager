<template>
  <Navbar @open="openLogin"/>
  <div class="flex">
  <sidebar />
  <router-view/>

  </div>
</template>
<script>
  import Navbar from './components/Navbar.vue'
  import Sidebar from "./components/layouts/TheSidebar.vue"
  export default {
    components: { Navbar, Sidebar },
    setup() {
      const openLogin = () => {
        const loginForm = document.querySelector(".auth")
        loginForm.classList.toggle("open")
      }
      return { openLogin }
    },
  }
</script>
<style>
</style>
