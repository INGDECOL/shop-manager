<template>
    <Login />
    <div class="wrapper overflow-hidden">

    <div class="scroll-text">
    <!-- <div class="title text-center "> -->
      <h1 class="font-roboto">Ets N'NAHAWA MS</h1>

    <!-- </div> -->
      <p class="m-5">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis impedit debitis alias modi possimus enim consequuntur amet suscipit. Quidem aperiam id non accusamus vel, unde error omnis voluptatibus repellendus officiis, obcaecati, cupiditate quas praesentium impedit quibusdam aliquam minima ducimus rem quisquam laudantium expedita in! Quos impedit voluptatem hic dolor minima eaque pariatur quia et, ea eveniet, laudantium quas harum. Consequuntur voluptate necessitatibus error in quasi atque fugiat iure voluptates voluptas obcaecati. Laborum delectus reprehenderit excepturi provident harum cupiditate asperiores recusandae in fugit rerum. Accusamus quod rem exercitationem, harum nisi vero, earum officia soluta dolor, reprehenderit veritatis voluptate. Sed voluptates possimus aspernatur veritatis odio excepturi ea magni nulla, adipisci iure a officiis, esse ipsa! Sequi expedita deserunt doloribus sit eaque dolore perferendis officia, architecto soluta unde, quos sunt fuga reprehenderit aliquid dolores possimus velit sint ad nulla dolorum ea debitis. Tempora esse distinctio magni labore natus culpa laudantium sed quia adipisci reiciendis architecto repellat praesentium, odit corrupti exercitationem deleniti eveniet quasi dolorem rerum repellendus quam eaque ullam eius. Voluptatibus repellendus nemo vero perspiciatis eaque officia ex iusto quam expedita exercitationem, debitis quidem ipsum consectetur sunt doloribus ab excepturi fugit repudiandae voluptas. Libero impedit aperiam nobis, sunt eum amet illum iusto corrupti.
      </p>
      <p class="m-5">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, aut. Cum voluptatem similique pariatur laboriosam autem nam vero ratione totam tempore, quia beatae cupiditate iusto? Sed, illum! Cum tempora recusandae eum quidem iure labore fuga dolores debitis quaerat! Ipsam, eos quia distinctio consequuntur in voluptas exercitationem asperiores suscipit molestias harum dicta dolore animi impedit doloribus cumque cupiditate autem deserunt soluta ut eveniet natus dolorum. Vitae molestiae non voluptas iusto dolores incidunt soluta a eaque mollitia fuga optio ab magni, explicabo, vero sapiente ullam. Error labore possimus impedit beatae iure iste obcaecati assumenda totam, et nisi, quod exercitationem. Ad exercitationem at porro est cumque consequuntur sed, dolore consectetur ducimus fugit beatae esse ab voluptatem, tempora temporibus, tempore in! Et nemo mollitia adipisci molestias ab repudiandae numquam itaque, labore necessitatibus debitis ducimus voluptate veritatis omnis vitae quo fugit illum minus ipsa? Soluta delectus harum ducimus nobis consequatur accusamus obcaecati ea impedit rem?
      </p>
      <p class="m-5">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Suscipit, aut. Cum voluptatem similique pariatur laboriosam autem nam vero ratione totam tempore, quia beatae cupiditate iusto? Sed, illum! Cum tempora recusandae eum quidem iure labore fuga dolores debitis quaerat! Ipsam, eos quia distinctio consequuntur in voluptas exercitationem asperiores suscipit molestias harum dicta dolore animi impedit doloribus cumque cupiditate autem deserunt soluta ut eveniet natus dolorum. Vitae molestiae non voluptas iusto dolores incidunt soluta a eaque mollitia fuga optio ab magni, explicabo, vero sapiente ullam. Error labore possimus impedit beatae iure iste obcaecati assumenda totam, et nisi, quod exercitationem. Ad exercitationem at porro est cumque consequuntur sed, dolore consectetur ducimus fugit beatae esse ab voluptatem, tempora temporibus, tempore in! Et nemo mollitia adipisci molestias ab repudiandae numquam itaque, labore necessitatibus debitis ducimus voluptate veritatis omnis vitae quo fugit illum minus ipsa? Soluta delectus harum ducimus nobis consequatur accusamus obcaecati ea impedit rem?
      </p>

    </div>
  </div>

</template>

<script>
import { ref } from '@vue/reactivity'
// @ is an alias to /src
import Login from "./auth/Login.vue"
export default {
  name: 'Home',
  components: {
    Login
  },
  setup() {
    const open = ref(false)

    return { open }
  }
}
</script>
