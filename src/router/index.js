import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from "../firebase/config";
import getUser from '../controllers/getUser'

//Components import
  import Home from '../views/Home.vue'

  import ListeFournisseur from "../views/fournisseurs/ListeFournisseur.vue"
  import EditFournisseur from "../views/fournisseurs/EditFournisseur.vue"

  import ListeRayon from "../views/familles/ListeRayon.vue"
  import EditRayon from "../views/familles/EditRayon.vue"

  import ListeClient from "../views/clients/ListeClient.vue"
  import EditClient from "../views/clients/EditClient.vue"

  import ListeBoutique from "../views/boutiques/ListeBoutique.vue"
  import EditBoutique from "../views/boutiques/EditBoutique.vue"

  import ListeProduit from "../views/produits/ListeProduit.vue"
  import NewProduit from "../views/produits/NewProduit.vue"
  import EditProduit from "../views/produits/EditProduit.vue"
  import Desintegration from "../views/produits/Desintegration.vue"
  import Reception from "../views/produits/Reception.vue"

  import NewVente from "../views/ventes/NewVente.vue"
  import ListeVente from "../views/ventes/ListeVente.vue"
  import DetailDette from "../views/ventes/DetailDetteClient.vue"
  import CompteClient from "../views/ventes/CompteClient.vue"

  import ListePersonnel from "../views/personnels/ListePersonnel.vue"
  import Indemnite from "../views/personnels/Indemnite.vue"
  import Bon from "../views/personnels/Bon.vue"
  import EditPersonnel from "../views/personnels/EditPersonnel.vue"

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
    path: "/familles/:token",
    name: "Familles",
    component: ListeRayon,
    beforEnter: requireAuth
  },
  {
    path: "/familles/edit/:token/:id",
    name: "EditFamille",
    component: EditRayon,
    beforEnter: requireAuthAdmin
  },

  {
    path: "/boutiques/:token",
    name: "Boutiques",
    component: ListeBoutique,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/boutiques/edit/:token/:id",
    name: "EditBoutique",
    component: EditBoutique,
    beforEnter: requireAuthAdmin
  },
// clients
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
  // Articles
  {
    path: "/articles/create/:token",
    name: "NewProduit",
    component: NewProduit,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/articles/:token",
    name: "Produits",
    component: ListeProduit,
    beforEnter: requireAuth
  },
  {
    path: "/articles/edit/:token/:id",
    name: "EditProduit",
    component: EditProduit,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/article/detailplus/:token/",
    name: "Desintegration",
    component: Desintegration,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/article/reception/:token",
    name: "Reception",
    component: Reception,
    beforEnter: requireAuth
  },
   // Ventes
  {
    path: "/vente/newvente/:token/:id?",
    name: "Vente",
    component: NewVente,
    beforEnter: requireAuth
  },
  {
    path: "/vente/listeVente/:token",
    name: "ListeVente",
    component: ListeVente,
    beforEnter: requireAuth
  },
  {
    path: "/vente/detailDetteClient/:id/:token",
    name: "DetailDette",
    component: DetailDette,
    beforEnter: requireAuth
  },
  {
    path: "/vente/listeCompteClient/:token",
    name: "CompteClient",
    component: CompteClient,
    beforEnter: requireAuth
  },

  // Admin Routes
  // Personnel
  {
    path: "/admin/:token?",
    name: "Admin",
    component: Home,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/personnels/listePersonnel/:token",
    name: "ListePersonnel",
    component: ListePersonnel,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/personnels/Indemnites/:token",
    name: "Indemnite",
    component: Indemnite,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/personnels/Bon/:token",
    name: "Bon",
    component: Bon,
    beforEnter: requireAuthAdmin
  },
  {
    path: "/personnels/editInfo/:token/:id",
    name: "EditPersonnel",
    component: EditPersonnel,
    beforEnter: requireAuthAdmin
  },




]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
