import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from "../firebase/config";
import getUser from '../controllers/getUser'

//Components import
  import Home from '../views/Home.vue'
  import Profile from '../views/auth/Profile.vue'
  import Login from '../views/auth/Login.vue'

  import ListeFournisseur from "../views/fournisseurs/ListeFournisseur.vue"
  import EditFournisseur from "../views/fournisseurs/EditFournisseur.vue"
  import NewFournisseur from "../views/fournisseurs/NewFournisseur.vue"

  import ListeRayon from "../views/familles/ListeRayon.vue"
  import EditRayon from "../views/familles/EditRayon.vue"

  import ListeClient from "../views/clients/ListeClient.vue"
  import EditClient from "../views/clients/EditClient.vue"

  import ListeBoutique from "../views/boutiques/ListeBoutique.vue"
  import EditBoutique from "../views/boutiques/EditBoutique.vue"
  import NewBoutique from "../views/boutiques/NewBoutique.vue"

  import ListeProduit from "../views/produits/ListeProduit.vue"
  import NewProduit from "../views/produits/NewProduit.vue"
  import EditProduit from "../views/produits/EditProduit.vue"
  import Desintegration from "../views/produits/Desintegration.vue"
  import Reception from "../views/produits/Reception.vue"

  import Transfert from "../views/stocks/TransfertStock.vue"
  import ReceptionStock from "../views/stocks/ReceptionStock.vue"

  import NewVente from "../views/ventes/NewVente.vue"
  import ListeVente from "../views/ventes/ListeVente.vue"
  import DetailDette from "../views/ventes/DetailDetteClient.vue"
  import CompteClient from "../views/ventes/CompteClient.vue"
  import RemboursementClient from "../views/ventes/RemboursementClient.vue"

   import NewPersonnel from '../views/auth/Signup.vue'
  import ListePersonnel from "../views/personnels/ListePersonnel.vue"
  import Indemnite from "../views/personnels/Indemnite.vue"
  import Bon from "../views/personnels/Bon.vue"
  import Bulletin from "../views/personnels/BulletinSalaire.vue"
  import EditPersonnel from "../views/personnels/EditPersonnel.vue"

  import AdminListeVente from "../views/etats/AdminListeVente.vue"
  import AdminRapportBoutique from "../views/etats/AdminRapportBoutique.vue"
  import AdminInventaire from "../views/etats/Inventaire.vue"
  import AdminNewCommande from "../views/etats/CommandeFournisseurs.vue"
  import AdminListeCommandes from "../views/etats/AdminListeCommandes.vue"
  import AdminCompteFournisseur from "../views/etats/CompteFournisseur.vue"
  import AdminGrandLivre from "../views/etats/GrandLivre.vue"

  import AdminGestionCompte from "../views/comptes/GestionCompte.vue"
  import AdminOperations from "../views/comptes/Operations.vue"
  import AdminTransactions from "../views/comptes/ListeTransactions.vue"

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

  const requireUnauthenticated = ( to, from, next) =>{
    // console.log("reequireAuth");
    let user = auth.currentUser
    if(user){
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
      alert("Vous devriez vous connecter pour accéder à cette page !")
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
    path: '/Sign_in',
    name: 'Login',
    component: Login,
    beforeEnter: requireUnauthenticated
  },
  {
    path: '/profil/:token',
    name: 'Profil',
    component: Profile,
    beforeEnter: requireAuth
  },
  // Fournisseur
  {
    path: "/fournisseurs/:token",
    name: "Fournisseurs",
    component: ListeFournisseur,
    beforeEnter: requireAuth
  },
  {
    path: "/create_fournisseurs/:token",
    name: "NewFournisseur",
    component: NewFournisseur,
    beforeEnter: requireAuth
  },
  {
    path: "/fournisseur/edit/:token/:id",
    name: "EditFournisseur",
    component: EditFournisseur,
    beforeEnter: requireAuthAdmin
  },
  // Familles
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
  // Boutique
  {
    path: "/create_boutiques/:token",
    name: "NewBoutique",
    component: NewBoutique,
    beforeEnter: requireAuthAdmin
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
    beforeEnter: requireAuth
  },
  {
    path: "/article/reception/:token",
    name: "Reception",
    component: Reception,
    beforeEnter: requireAuth
  },
  // stocks
  {
    path: "/article/stock/transfert_stock/:token",
    name: "Transfert",
    component: Transfert,
    beforeEnter: requireAuth
  },
  {
    path: "/article/stock/reception_stock/:token",
    name: "Stockage",
    component: ReceptionStock,
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
  {
    path: "/vente/remboursement_client/:token/:id",
    name: "RemboursementClient",
    component: RemboursementClient,
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
  // Nouveau Personnel
  {
    path: "/admin/gestion_personnel/:token?",
    name: "AdminNewPersonnel",
    component: NewPersonnel,
    beforeEnter: requireAuthAdmin
  },
  // Liste personnels
  {
    path: "/personnels/listePersonnel/:token",
    name: "ListePersonnel",
    component: ListePersonnel,
    beforeEnter: requireAuthAdmin
  },
  // Indemnites
  {
    path: "/personnels/Indemnites/:token",
    name: "Indemnite",
    component: Indemnite,
    beforeEnter: requireAuthAdmin
  },
  // Bon
  {
    path: "/personnels/Bon/:token/:id",
    name: "Bon",
    component: Bon,
    props: true,
    beforeEnter: requireAuthAdmin
  },
  // Bulletin de Salaire
  {
    path: "/personnels/bulletin_de_salaire/:token",
    name: "Bulletin",
    component: Bulletin,
    beforeEnter: requireAuthAdmin
  },
  // Edit Infos
  {
    path: "/personnels/editInfo/:token/:id",
    name: "EditPersonnel",
    component: EditPersonnel,
    beforeEnter: requireAuthAdmin
  },

  // Etats
  {
    path: "/rapports/etats/liste_ventes/:token/",
    name: "AdminListeVente",
    component: AdminListeVente,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/rapports/etats/Rapport_boutique/:token/",
    name: "AdminRapportBoutique",
    component: AdminRapportBoutique,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/rapports/etats/Inventaire/:token/",
    name: "AdminInventaire",
    component: AdminInventaire,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/rapports/etats/GrandLivre_des_comptes/:token/",
    name: "AdminGrandLivre",
    component: AdminGrandLivre,
    beforeEnter: requireAuthAdmin
  },

// Etats fournisseurs
  {
    path: "/commandes/new_commande_fournisseur/:token/:id?",
    name: "AdminNewCommande",
    component: AdminNewCommande,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/rapports/etats/commandes_fournisseurs/:token/",
    name: "AdminListeCommandes",
    component: AdminListeCommandes,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/rapports/etats/comptes/comptes_fournisseurs/:token/",
    name: "AdminCompteFournisseur",
    component: AdminCompteFournisseur,
    beforeEnter: requireAuthAdmin
  },
// Compte auxilliaire
  {
    path: "/compte_auxilliaire/gestion/gestion_comptes/:token/",
    name: "AdminGestionCompte",
    component: AdminGestionCompte,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/compte_auxilliaire/gestion/new_transaction/:token/",
    name: "AdminOperations",
    component: AdminOperations,
    beforeEnter: requireAuthAdmin
  },
  {
    path: "/compte_auxilliaire/gestion/liste_transactions/:token/",
    name: "AdminTransactions",
    component: AdminTransactions,
    beforeEnter: requireAuthAdmin
  },




]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
