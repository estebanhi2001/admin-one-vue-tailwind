<script setup>
import { reactive, computed, inject, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { supabase } from "@/supabase.js"
import ContextMenu from '@imengyu/vue3-context-menu'

const mainStore = useMainStore();
const apiaxios = inject('apiaxios')  // inject axios

const colores = computed(() => mainStore.colores);
const props = defineProps({
    product: Object
});
const copia = reactive({
    tipo: null,
    value: null
})

const { product } = props
const { tipo, genero, modelo, wordpressparent } = product

const variantes = reactive({ data: [], wc: {} })

var cache = sessionStorage.getItem('variant' + tipo + genero + modelo);
if (cache) {
    variantes.data = JSON.parse(cache)
} else {
    const { data, error } = await supabase
        .from('variantes')
        .select()
        .eq('tipo', tipo)
        .eq('genero', genero)
        .eq('modelo', modelo)
    variantes.data = data
    sessionStorage.setItem('variant' + tipo + genero + modelo, JSON.stringify(data))
}
cache = sessionStorage.getItem('variantwc' + tipo + genero + modelo);
if (cache) {
    variantes.wc = JSON.parse(cache)
} else {
    let response = await apiaxios.get("/wc/product/" + wordpressparent + "/getVariants")
    variantes.wc = response.data.variantes
    sessionStorage.setItem('variantwc' + tipo + genero + modelo, JSON.stringify(response.data.variantes))

}

function onContextMenu(e, sitio = "todo", data) {
    e.preventDefault();
    let items = [
        {
            label: "Precio",
            children: [
                { label: "Editar" },
                {
                    label: "Copiar",
                    onClick: () => {
                        copia.tipo = "Precio"
                        copia.value = data.pricing;
                    }
                },
            ]
        },
        {
            label: "SKU",
            children: [
                { label: "Editar" },
                {
                    label: "Copiar", onClick: () => {
                        copia.tipo = "SKU"
                        copia.value = data.sku;
                    }
                },
            ]
        },
    ]
    ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items
    });
}

</script>

<template>
    <div>
        {{ JSON.stringify(copia) }}
        <h1 class="py-4 text-3xl">Variantes</h1>
        <table class="table-fixed">
            <tr>
                <th>Base de datos</th>
                <th><a :href="'https://www.miura.cl/?post_type=product&p=' + product.wordpressparent">WooCommerce</a>
                </th>
                <th>Shopify</th>
                <th>Mercado Libre</th>
                <th>Falabella</th>
                <th>Dafiti</th>

            </tr>
            <tr v-for="variante of variantes.data" class="border-stone-700 border-1">
                <td @contextmenu="onContextMenu($event, 'variante', variante)">
                    <h2><b>SKU: </b>{{ variante.sku }}</h2>
                    <h2><b>Precio: </b><span :class="[
                        copia.tipo == 'Precio' && copia.value != variante.pricing ? 'text-green-600' : ''
                    ]">{{
        variante.pricing
}}</span></h2>
                    <img v-if="variante.imagen" :src="variante.imagen" class="w-16">
                    <h2><b>Color: </b> {{ colores[variante.color] ? colores[variante.color] : variante.color }}
                    </h2>
                    <h2 v-if="variante.talla"><b>Talla: </b>{{ variante.talla }}</h2>
                    <h2><b>Stock: </b>N/D</h2>
                </td>
                <td>
                    <h2><b>SKU: </b>{{ variantes.wc?.[variante.wordpressvariable].sku }}</h2>
                    <h2><b>Precio: </b>{{ variantes.wc?.[variante.wordpressvariable].price }}</h2>

                    <img v-if="variantes.wc?.[variante.wordpressvariable]?.image?.sourceUrl"
                        :src="variantes.wc[variante.wordpressvariable].image.sourceUrl" class="w-16">
                    <h2 v-if="variantes.wc[variante.wordpressvariable].Color"><b>Color: </b> {{
                            variantes.wc[variante.wordpressvariable].Color
                    }}
                    </h2>
                    <h2 v-if="variantes.wc[variante.wordpressvariable].Talla"><b>Talla: </b> {{
                            variantes.wc[variante.wordpressvariable].Talla
                    }}
                    </h2>
                    <h2 v-if="variantes.wc[variante.wordpressvariable].stockQuantity"><b>Stock: </b> {{
                            variantes.wc[variante.wordpressvariable].stockQuantity
                    }}
                    </h2>
                </td>
                <td>
                    <span>No Disponible</span>
                </td>
                <td>
                    <span>No Disponible</span>
                </td>
                <td>
                    <span>No Disponible</span>
                </td>
                <td>
                    <span>No Disponible</span>
                </td>
            </tr>
        </table>

    </div>

</template>
