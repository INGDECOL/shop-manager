<template>
    <div class="mx-auto open" >
        <div class="modal active">
            <h2 class="font-bold ">FAIRE UN BON SUR SALAIRE</h2>
            <form class="register" @submit.prevent="handleSubmit">
            <input type="hidden" name="id" id="id" placeholder="Nom complet" v-model="id">
            <input type="text" name="name" id="name" placeholder="Nom complet" v-model="name" disabled>
            <input type="tel" name="phone" id="phone" placeholder="Contact" v-model="phone" disabled>
            <!-- <input type="email" name="email" id="email" placeholder="Email" v-model="email" disabled> -->
            <input type="text" name="fonction" id="fonction" placeholder="Fonction" required v-model="fonction" disabled>

            <hr>
            <input type="text" name="salaireBase" id="salaireBase" placeholder="Salaire de Base" v-model="salaireBase" class="text-center font-bold" disabled>
            <input type="text" name="indemnites" id="indemnites" placeholder="Indemnites" v-model="indemnites" class="text-center font-bold" disabled>
            <input type="text" name="salaireNet" id="salaireNet" placeholder="salaire Net" v-model="salaireNet" class="text-center font-bold" disabled>
            <input type="text" name="antecedant" id="antecedant" placeholder="antecedant" v-model="antecedant" class="text-center font-bold" disabled>
            <input type="text" name="montantDemande" id="montantDemande" placeholder="Montant Demande" v-model="montantDemande" class="text-center font-bold">
            <p class="error text-xs italic">Les antécédants et le montant démandé ne peuvent pas depasser les 50% du S. net
            </p>
            <button>Valider</button>
            <p class="error">{{ setError }}</p>
            </form>
            <!-- <div>Got an account? <a class="switch" @click="toggleForm">Login instead</a></div> -->
        </div>

    </div>

</template>

<script>

    import { useRoute, useRouter } from 'vue-router'
    import { ref } from '@vue/reactivity'
    import { onMounted } from '@vue/runtime-core'
    import { doc, getDoc, serverTimestamp } from '@firebase/firestore'
    import setDocument from '../../controllers/setDocument'
    import getDocument from '../../controllers/getDocument'
    import createDocument from '../../controllers/createDocument'
    import { collection, onSnapshot, orderBy, query,  } from '@firebase/firestore';
    import { auth, db } from '../../firebase/config'
    import { Listbox } from '@headlessui/vue'

    export default {

        setup(props) {

            const {  setError, insert} = setDocument()
            const { create, createError } = createDocument()
            const listeSalaires = ref(null)
            const listeBons = ref([])
            const route = useRoute()
            const router = useRouter()
            const id = ref('')
            const name = ref('')
            const email = ref('')
            const fonction = ref('')
            const phone = ref('')
            const salaireBase = ref()
            const indemnites = ref()
            const salaireNet = ref()
            const montantDemande = ref()
            const antecedant = ref()
             const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone:'UTC' }

            const formatedDate = (strDate) => {
            return new Date(strDate * 1000 ).toLocaleDateString(undefined, options)

            }
            const formatedNumber = (strNumber) => {
            return strNumber.toLocaleString('fr-fr', {style: "currency", currency: "GNF", minimumFractionDigits: 0})
            }

            const hideModal = (e) => {
                if(e.target.classList.contains("bon")){
                    document.querySelector(".bon").classList.toggle("open")
                }
            }

            const getSalaires =  async(id) => {
                const docRef = doc(db, "salaires", id)
                // const q = query(docRef, orderBy("createdAt", "desc"))
                const res = await getDoc(docRef)
                if(res.exists) {
                    listeSalaires.value = {...res.data(), id:res.id}

                }else console.log("Nooooo")
            }


            const getAntecedants = (id) => {
                let montanAntecedant =0
                listeBons.value.map(bon => {
                if(bon.personnelId == id) {
                    montanAntecedant += bon.montant
                }
                })
                return montanAntecedant > 0 ? montanAntecedant : 0

            }

            const getBons = () => {
            const docRef = collection(db, "bons")
            const q = query(docRef, orderBy("createdAt", "desc"))
            const res = onSnapshot(q, snap => {
                listeBons.value = snap.docs.map(doc =>{
                return {...doc.data(), id:doc.id}
                })
            })
            }

            onMounted( async ()=>{
                const { document, getError, load } = getDocument()
                 await load("users", route.params.id)
                getBons()
                await getSalaires(route.params.id)
                // console.log("route: ",route.params.id)
                if (document.value) {
                    name.value = document.value.nom
                    id.value =document.value.id
                    phone.value = document.value.phoneNumber
                    fonction.value = document.value.fonction
                    salaireBase.value = listeSalaires.value.salaireBase
                    indemnites.value = listeSalaires.value.indemnites
                    salaireNet.value = formatedNumber( Number(salaireBase.value) + Number(indemnites.value))
                    antecedant.value = getAntecedants(route.params.id)

                }else console.log("Not v")
            })

            const toggleForm = () => {
                document.querySelector(".create").classList.toggle("open")
            }

            const handleSubmit = async () => {
                // console.log(Number(montantDemande.value) + Number(antecedant.value)>(Number(salaireBase.value) + Number(indemnites.value) ) * 0.5 )
                // return false
                if(isNaN(montantDemande.value)){
                    alert("Saisie incorrect")
                    return
                }

                if(Number(montantDemande.value) + Number(antecedant.value)>(Number(salaireBase.value) + Number(indemnites.value) ) * 0.5) {
                    alert("Le montant demandé est supérieur aux 50 % du Salaire Net")
                    return
                }

                let bon = {
                    personnelId: id.value,
                    nom: name.value,
                    montant: Number(montantDemande.value),
                    createdAt: serverTimestamp()
                }
                await create("bons",bon)

                if(!setError.value) {
                    alert("Bon enregistré avec succès ! \n Le montant sera retenu sur la prochaine paie !")
                    id.value =''
                    name.value =''
                    email.value =''
                    fonction.value =''
                    phone.value =''
                    salaireBase.value =''
                    indemnites.value =''
                    salaireNet.value =''
                    montantDemande.value =''
                    antecedant.value =''
                    // toggleForm()
                    router.push( { name: 'ListePersonnel', params: { token: auth.currentUser.accessToken}})
                }else  console.log(" seterr Error :" , setError.value)
            }

            return {
                id,
                handleSubmit,
                email,
                name,
                phone,
                fonction,
                setError,
                toggleForm,
                hideModal,
                salaireBase,
                indemnites,
                salaireNet,
                antecedant,
                montantDemande,

            }


        }

    }
</script>

<style>

</style>
