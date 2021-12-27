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
    // console.log("reequireAuth");
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
    if(_user) {
        await findUser(_user.uid)
        // console.log("requireAuthAdmin : ", user.value.fonction)
        if(user.value.fonction != 'Administrateur'){
          alert("Vous n'êtes pas autorisé à aller sur cette page ")
          next({ name: 'Home'})
        } else {
          next()
        }
    }else {
      alert("Vous devriez vous connecter d'abord !")
      next({ name: 'Home'})
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
    beforeEnter: requireAuth
  },
  {
    path: "/fournisseur/edit/:token/:id",
    name: "EditFournisseur",
    component: EditFournisseur,
    beforeEnter: requireAuthAdmin
  },

  {
    path: "/familles/:token",
    name: "Familles",
    component: ListeRayon,
    beforeEnter: requireAuth
  },
  {
    path: "/familles/edit/:token/:id",
    name: "EditFamille",
    component: EditRayon,
    beforeEnter: requireAuth
  },

  {
    path: "/boutiques/:token",
    name: "Boutiques",
    component: ListeBoutique,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/boutiques/edit/:token/:id",
    name: "EditBoutique",
    component: EditBoutique,
    beforeEnter: requireAuthAdmin
  },
// clients
  {
    path: "/clients/:token",
    name: "Clients",
    component: ListeClient,
    beforeEnter: requireAuth
  },
  {
    path: "/clients/edit/:token/:id",
    name: "EditClient",
    component: EditClient,
    beforeEnter: requireAuthAdmin
  },
  // Articles
  {
    path: "/articles/create/:token",
    name: "NewProduit",
    component: NewProduit,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/articles/:token",
    name: "Produits",
    component: ListeProduit,
    beforeEnter: requireAuth
  },
  {
    path: "/articles/edit/:token/:id",
    name: "EditProduit",
    component: EditProduit,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/article/detailplus/:token/",
    name: "Desintegration",
    component: Desintegration,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/article/reception/:token",
    name: "Reception",
    component: Reception,
    beforeEnter: requireAuth
  },
   // Ventes
  {
    path: "/vente/newvente/:token/:id?",
    name: "Vente",
    component: NewVente,
    beforeEnter: requireAuth
  },
  {
    path: "/vente/listeVente/:token",
    name: "ListeVente",
    component: ListeVente,
    beforeEnter: requireAuth
  },
  {
    path: "/vente/detailDetteClient/:id/:token",
    name: "DetailDette",
    component: DetailDette,
    beforeEnter: requireAuth
  },
  {
    path: "/vente/listeCompteClient/:token",
    name: "CompteClient",
    component: CompteClient,
    beforeEnter: requireAuth
  },

  // Admin Routes
  // Personnel
  {
    path: "/admin/:token?",
    name: "Admin",
    component: Home,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/personnels/listePersonnel/:token",
    name: "ListePersonnel",
    component: ListePersonnel,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/personnels/Indemnites/:token",
    name: "Indemnite",
    component: Indemnite,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/personnels/Bon/:token",
    name: "Bon",
    component: Bon,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/personnels/editInfo/:token/:id",
    name: "EditPersonnel",
    component: EditPersonnel,
    beforeEnter: requireAuthAdmin
  },




]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
