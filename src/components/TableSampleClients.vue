<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import SelectedProduct from "@/components/SelectedProduct.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { supabase } from "@/supabase.js"
defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();
const tipos = computed(() => mainStore.tipos);
const { data, error } = await supabase

  .from('productos')

  .select()

const items = ref(data);

const selected = ref(null);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(20);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};

</script>

<template>
  <SelectedProduct v-model="isModalActive" :product="selected" />
  <table>
    <thead>
      <tr>
        <!-- <th v-if="checkable" />
        <th /> -->
        <th>SKU</th>
        <th>Nombre</th>
        <th>Tipo</th>
        <th>Genero</th>
        <th>Modelo</th>
        <th>Precio</th>


        <!-- <th>Company</th>
        <th>City</th>
        <th>Progress</th>
        <th>Created</th> -->
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <!-- <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :username="client.name" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td> -->
        <td>
          {{ client.sku }}
        </td>
        <td>
          {{ client.nombre }}
        </td>
        <td>
          {{ tipos[client.tipo] ? tipos[client.tipo] : client.tipo }}
        </td>
        <td>
          {{ client.genero == 'F' ? 'Femenino' : 'Masculino' }}
        </td>
        <td>
          {{ client.modelo }}
        </td>
        <td>
          {{ client.pricing    }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true; selected = client" />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
