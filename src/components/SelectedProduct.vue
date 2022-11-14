<script setup>
import { computed, watch, ref } from "vue";
import { mdiClose } from "@mdi/js";
import { useMainStore } from "@/stores/main";

import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import Product from "@/components/Product.vue";
const mainStore = useMainStore();

const props = defineProps({
    button: {
        type: String,
        default: "info",
    },
    buttonLabel: {
        type: String,
        default: "Done",
    },
    hasCancel: Boolean,
    product: Object,
    modelValue: {
        type: [String, Number, Boolean],
        default: null,
    },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
    value.value = false;
    emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && value.value) {
        cancel();
    }
});

watch(ref(props.product), async (newQuestion, oldQuestion) => {
    console.log(props.product)
})

</script>

<template>
    <OverlayLayer v-show="value" @overlay-click="cancel">
        <CardBox v-show="value" class="shadow-lg max-h-[80vh] w-11/12 z-50" is-modal>
            <div v-if="product && value" class="overflow-scroll max-h-[60vh]">
                <div class="columns-2">
                    <img v-if="product.imagen" :src="product.imagen" class="w-1/5">
                    <div>
                        <h1><b>Nombre:</b> {{ product.nombre }}</h1>
                        <h2><b>Genero:</b> {{ product.genero == 'F' ? 'Femenino' : 'Masculino' }}</h2>
                        <h2><b>Modelo:</b> {{ product.modelo }}</h2>
                        <h2><b>Sku:</b> {{ product.sku }}</h2>
                    </div>
                </div>
                <Suspense>
                    <!-- component with nested async dependencies -->
                    <Product :product="product"></Product>
                    <!-- loading state via #fallback slot -->
                    <template #fallback>
                        Loading...
                    </template>
                </Suspense>

            </div>

            <template #footer>
                <BaseButtons>
                    <BaseButton :label="buttonLabel" :color="button" @click="confirm" />
                    <BaseButton v-if="hasCancel" label="Cancel" :color="button" outline @click="cancel" />
                </BaseButtons>
            </template>
        </CardBox>
    </OverlayLayer>
</template>
