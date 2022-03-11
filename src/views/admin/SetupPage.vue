<template>
      <div class="mx-auto " >
        <div class=" active">
            <form class="produit"  @submit.prevent="handleSubmit">
              <!-- Bouton fermer -->
            <div class="flex justify-center -mr-5  ml-auto">
                <span class="material-icons close row-auto mr-0 ml-auto pr-0" @click="goBack">close</span>
            </div>

            <div class=" justify-center items-center flex-col  gap-0.5 mt-0">
                <!-- Total de la facture -->
                <p class="mt-0 font-bold text-xl text-center uppercase">Reglages Info</p>
                <!-- <div class="flex justify-center  gap-0.5 m-0 shadow-none"> -->
                    <div class="border rounded mb-2 px-1 mx-1 w-full">
                        <!-- Mode reglement et validation -->
                        <!-- <div class="border m-1"> -->
                            <!-- <div class="mx-3 flex justify-center items-center gap-2" > -->
                                <div class=" justify-center items-center flex-col">
                                    <div class="flex justify-center my-2">
                                        <img src="@/assets/logo.png" alt="Logo de l'application "  width="80" height="50" class="rounded border border-gray-400">
                                    </div>
                                    <label class="text-left ">Logo</label>
                                    <input type="file" class=" border rounded  font-bold  text-center  pt-2 text-gray-500" @change="imgSelected" >
                                </div>
                            <!-- </div> -->
                            <div class="mx-3 flex justify-center gap-2" >
                                <label class="text-left ">Titre des documents</label>
                                <input type="text" class="border rounded h-9 font-bold  text-xl px-2  pt-2 text-gray-500" v-model="titre" >
                            </div>
                            <div class="mx-3 flex justify-center gap-2" >
                                <label class="text-left w-1/3 ">Adresse</label>
                                <input type="text" class="border rounded h-9 font-bold  text-xl px-2  pt-2 text-gray-500" v-model="adresse" >
                            </div>
                            <div class="mx-3 flex justify-center  gap-2">
                                <label class="text-left w-1/3">Numéros de téléphone</label>
                                <input type="text" class="border rounded h-9 font-bold  text-xl px-2  pt-2 text-gray-500" v-model="numeros" >
                            </div>
                            <div class="mx-3 flex justify-center  gap-2">
                                <label class="text-left w-1/3">Email</label>
                                <input type="email" class="border rounded h-9 font-bold  text-xl px-2 pt-2 text-gray-500" v-model="email" >
                            </div>

                        <!-- </div> -->
                        <h1 v-if="progress" class="font-bold text-center text-sm">Upload en cours... {{ progress }} %</h1>

                        <button v-if="!isPending" class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700 mb-2">Valider</button>
                        <button v-else class="border-2 border-green-600 bg-transparent  text-sm hover:bg-green-700 mb-2 " disabled>Enregistrement ...</button>
                        <div class="error">{{ setError}}</div>
                        <div class="error">{{ fileError}}</div>
                    </div>
                <!-- </div> -->
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import setDocument from '../../controllers/setDocument'
import { serverTimestamp } from '@firebase/firestore'
import { onMounted, watch } from '@vue/runtime-core'
import useStorage from "../../controllers/useStorage";



export default {
  setup () {
    const titre = ref('')
    const img = ref(null)
    const numeros = ref(null)
    const email = ref(null)
    const adresse = ref(null)
    const imgUrl = ref('')
    const file = ref(null)
    const fileError = ref(null)
    const { setError, insert } = setDocument()
    const isPending = ref(false)
    const { downloadUrl, filepath, uploadImage, progress} = useStorage()
    const fileType = ["image/png","image/jpeg",]
    //

        const router = useRouter()

        const goBack = () => {
            router.back()
        }

        watch(downloadUrl, ()=> {
            if(downloadUrl.value) {
                // console.log("chnged " , downloadUrl.value)
                imgUrl.value = downloadUrl.value
                let param = {
                    titre : titre.value.toUpperCase(),
                    numeros : numeros.value,
                    email : email.value,
                    adresse : adresse.value,
                    imgUrl :  downloadUrl.value,
                    updatedAt: serverTimestamp()
                }
                // console.log("App config : ", param)
                insert("reglages" , param, "NzMRN91Wh7NY82JauZk7M9ILV1D2")
                if(!setError.value) {
                    titre.value = ""
                    numeros.value =""
                    email.value =""
                    adresse.value =""
                    isPending.value = false
                    alert("Reglages enregistrés avec succès !")
                }
                isPending.value = false
            }
        })

        const imgSelected = (e) => {
            const selected = e.target.files[0]
            // console.log(selected) 
            if(selected && fileType.includes(selected.type)) {
                file.value = selected
                fileError.value = null
            }else {
                fileError.value = "Format non prise en charge (selement les fichiers png et jpg)"
                 file.value = null
            }
        }

        const handleSubmit = async () => {
            isPending.value = true
            setError.value =''
            if( titre.value == '') {
                alert("Veuillez definir un titre pour l'application")
                return
            }
            if(!file.value) {
                alert("Données invalides ! \n Vérifier que vous avez bien selectionné un logo et rempli le champ titre ")
                isPending.value = false
                return
            }
            await uploadImage(file.value)
            // isPending.value = false


        }


        return {
            titre,
            numeros,
            img,
            adresse,
            email,
            handleSubmit,
            imgSelected,
            goBack,
            fileError,
            setError,
            progress,
            downloadUrl,
            isPending,
        }
  }

}
</script>

<style>

</style>
