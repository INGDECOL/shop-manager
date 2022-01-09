<template>
  <aside class="hidden w-52 bg-gray-800 sm:block">
    <div class="py-3 text-2xl uppercase text-center tracking-widest bg-gray-900 border-b-2 border-gray-800 mb-3" id="enteteNav">
      <router-link to="/" class="text-white">Administration</router-link>
    </div>
    <!-- Close boutton -->
    <div class="flex justify-end pr-1 m-0">
      <span class="material-icons nav hidden" title="Afficher le menu" @click="toggleNav">view_headline</span>
      <span class="material-icons nav " title="Masquer le menu" @click="toggleNav">close</span>
    </div>

    <nav class="text-sm text-gray-300" id="nav2">
      <ul class="flex flex-col">
        <li class="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">Menus</li>

        <router-link v-slot="{ isExactActive, href, navigate }" to="/" custom>
          <li class="px-4 cursor-pointer" :class="[isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700']">
            <a class="py-3 flex items-center" :href="href" @click="navigate">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Retour a l'appli
            </a>
          </li>
        </router-link>
        <!-- Personnel -->
        <li>
          <Disclosure v-slot="{ open }" :default-open="isUserManagementActive">
            <DisclosureButton
              class="disclosure rounded-none px-4 py-1 flex items-center w-full hover:bg-gray-700 hover:rounded-2xl"
              :class="open ? 'open' : ''"
            >
              <span class="material-icons  w-5 mr-2">
                contacts
              </span>

              Personnel
              <span class="ml-auto material-icons"  :class="open ? 'transform rotate-90' : ''">
                arrow_forward_ios
              </span>
            </DisclosureButton>
            <DisclosurePanel>
              <ul>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'ListePersonnel', params: { token: auth.currentUser.accessToken}}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">manage_accounts</span>Gerer
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'Indemnite', params: { token: auth.currentUser.accessToken }}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">monetization_on</span>Indemnites
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'Bulletin', params: { token: auth.currentUser.accessToken}}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">checklist</span>Bulletin de salaire
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </li>
        <!-- FAMILLES -->
        <li v-if="isAdmin">
          <Disclosure v-slot="{ open }" :default-open="isUserManagementActive">
            <DisclosureButton
              class="disclosure rounded-none px-4 py-1 flex items-center w-full hover:bg-gray-700"
              :class="open ? 'open': ''"
            >
              <span class="material-icons  w-5 mr-2">
                spoke
              </span>

              Familles
              <span class="ml-auto material-icons"  :class="open ? 'transform rotate-90' : ''">
                arrow_forward_ios
              </span>
            </DisclosureButton>
            <DisclosurePanel>
              <ul>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'Familles', params: { token: auth.currentUser.accessToken}}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">settings_suggest</span>Gerer
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </li>
        <!-- BOUTIQUES -->
        <li v-if="isAdmin">
          <Disclosure v-slot="{ open }" :default-open="isUserManagementActive">
            <DisclosureButton
              class="disclosure rounded-none px-4 py-1 flex items-center w-full hover:bg-gray-700"
              :class="open ? 'open': ''"
            >
              <span class="material-icons  w-5 mr-2">
                store
              </span>

              Boutiques
              <span class="ml-auto material-icons"  :class="open ? 'transform rotate-90' : ''">
                arrow_forward_ios
              </span>
            </DisclosureButton>
            <DisclosurePanel>
              <ul>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'Boutiques', params: { token: auth.currentUser.accessToken}}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">settings_suggest</span>Gerer
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </li>
        <!-- ETATS -->
        <li v-if="isAdmin">
          <Disclosure v-slot="{ open }" :default-open="isUserManagementActive">
            <DisclosureButton
              class="disclosure rounded-none px-4 py-1 flex items-center w-full hover:bg-gray-700"
              :class="open ? 'open': ''"
            >
              <span class="material-icons  w-5 mr-2">
                store
              </span>

              Etats
              <span class="ml-auto material-icons"  :class="open ? 'transform rotate-90' : ''">
                arrow_forward_ios
              </span>
            </DisclosureButton>
            <DisclosurePanel>
              <ul>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <router-link :to="{ name: 'AdminListeVente', params: { token: auth.currentUser.accessToken}}">
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">format_list_numbered</span>Liste des ventes
                          </p>
                        </router-link>

                  </Disclosure>
                </li>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <!-- <router-link :to="{ name: 'Boutiques', params: { token: auth.currentUser.accessToken}}"> -->
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">summarize</span>Rapport boutique
                          </p>
                        <!-- </router-link> -->

                  </Disclosure>
                </li>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <!-- <router-link :to="{ name: 'Boutiques', params: { token: auth.currentUser.accessToken}}"> -->
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">inventory</span>Inventaire
                          </p>
                        <!-- </router-link> -->

                  </Disclosure>
                </li>
                <li>
                  <Disclosure v-slot="{ open }" :default-open="isUserActive">
                        <!-- <router-link :to="{ name: 'Boutiques', params: { token: auth.currentUser.accessToken}}"> -->
                          <p
                            class="pl-6 pr-4  flex items-center w-full hover:bg-gray-700"
                            :class="open ? 'open': ''"
                          >
                          <span class="material-icons w-5 mr-2">settings_suggest</span>Etats client
                          </p>
                        <!-- </router-link> -->

                  </Disclosure>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </li>

        <!-- Calendar -->
        <li class="px-4 cursor-pointer hover:bg-gray-700">
          <a href="#" class="py-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Calendar
          </a>
        </li>

        <!-- <li class="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">UI Elements</li> -->

        <!-- <li class="px-4 cursor-pointer hover:bg-gray-700">
          <router-link :to="{ name: 'Home' }" class="py-2 flex items-center">
            <svg class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
                fill="currentColor"
              />
              <path
                d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
                fill="currentColor"
              />
              <path
                d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
                fill="currentColor"
              />
              <path
                d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
                fill="currentColor"
              />
            </svg>
            Card
          </router-link>
        </li>
        <li class="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">Pages</li> -->

        <!-- <li class="px-4 cursor-pointer hover:bg-gray-700">
          <router-link :to="{ name: 'Home' }" class="py-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Login
          </router-link>
        </li> -->
      </ul>
    </nav>
  </aside>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { auth } from "../../firebase/config";
import getUser from '../../controllers/getUser';
export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

      const isAdmin = ref(async () =>{
        const { findUser, error, user } = getUser()
        let _user = auth.currentUser
        console.log("current user uid : ", _user.uid)
        if(_user) {
            await findUser(_user.uid)
            // console.log("requireAuthAdmin : ", user)
            if(user.value.fonction != 'Administrateur'){
              // alert("Vous n'êtes pas autorisé à aller sur cette page ")
              return false

            } else {
              return true
            }
          }else {
            router.push({ name: "Home"})
          }

    })



    const isUserManagementActive = computed(() => {
      const names = ['user-list', 'user-detail', 'roles', 'permissions']

      return names.includes(route.name)
    })

    const isUserActive = computed(() => {
      const names = ['user-list', 'user-detail']

      return names.includes(route.name)
    })

    const toggleNav = () => {
      let nav = document.querySelectorAll(".nav")
      nav.forEach(element => {
        element.classList.toggle("hidden")
      });
      document.querySelector("aside").classList.toggle("tog")
        document.querySelector("#enteteNav").classList.toggle("hidden")
        document.querySelector("#nav2 ul").classList.toggle("hidden")
    }
    return {
      route,
      toggleNav,
      isAdmin,
      isUserManagementActive,
      isUserActive,
      auth
    }
  },
}
</script>
