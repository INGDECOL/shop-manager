import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from "../firebase/config";
import getUser from '../controllers/getUser'

//Components import
  import Home from '../views/Home.vue'

  import ListeFournisseur from "../views/fournisseurs/ListeFournisseur.vue"
  import EditFournisseur from "../views/fournisseurs/EditFournisseur.vue"

  import ListeRayon from "../views/rayons/ListeRayon.vue"
  import EditRayon from "../views/rayons/EditRayon.vue"

  import ListeClient from "../views/clients/ListeClient.vue"
  import EditClient from "../views/clients/EditClient.vue"

  import ListeProduit from "../views/produits/ListeProduit.vue"
  import EditProduit from "../views/produits/EditProduit.vue"
  import Desintegration from "../views/produits/Desintegration.vue"
  import Reception from "../views/produits/Reception.vue"

//End of Components import

//auth guard
  const requireAuth = ( to, from, next) =>{
    let user = auth.currentUser
    if(!user){
      next({ name: 'Home'})
    } else {
      next()
    }
    //console.log(" current : ", user.accessToken)
  }

  const requireAuthAdmin = async ( to, from, next) =>{
    const { findUser, error, user } = getUser()
    let _user = auth.currentUser
    //console.log("userssss : ", _user.uid)
    if(_user) {
        await findUser(_user.uid)

          console.log("requireAuthAdmin : ", user.value.fonction)
        if(user.value.fonction != 'Administrateur'){
          alert("Vous n'êtes pas autorisé à aller sur cette page ")
          next({ name: 'Home'})
        } else {
          next()
        }
      }else {
        next({ name: 'SignIn'})
      }

  }

//End auth guard

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: "/fournisseurs/:token",
    name: "Fournisseurs",
    component: ListeFournisseur,
    beforEnter: requireAuth
  },
  {
    path: "/fournisseur/edit/:token/:id",
    name: "EditFournisseur",
    component: EditFournisseur,
    beforEnter: requireAuthAdmin
  },

  {
    path: "/rayons/:token",
    name: "Rayons",
    component: ListeRayon,
    beforEnter: requireAuth
  },
  {
    path: "/rayons/edit/:token/:id",
    name: "EditRayon",
    component: EditRayon,
    beforEnter: requireAuthAdmin
  },

  {
    path: "/clients/:token",
    name: "Clients",
    component: ListeClient,
    beforEnter: requireAuth
  },
  {
    path: "/clients/edit/:token/:id",
    name: "EditClient",
    component: EditClient,
    beforEnter: requireAuthAdmin
  },

  {
    path: "/produits/:token",
    name: "Produits",
    component: ListeProduit,
    beforEnter: requireAuth
  },
  {
    path: "/produits/edit/:token/:id",
    name: "EditProduit",
    component: EditProduit,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/vente/detailplus/:token/",
    name: "Desintegration",
    component: Desintegration,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/vente/reception/:token/",
    name: "Reception",
    component: Reception,
    beforEnter: requireAuth
  },



]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
