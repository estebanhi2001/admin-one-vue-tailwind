import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";
import "./css/main.css";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import axios, { Axios } from 'axios'
import VueAxios from 'vue-axios'
import ContextMenu from '@imengyu/vue3-context-menu'
/* Init Pinia */
const pinia = createPinia();

let apiaxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API
})


/* Create Vue app */
createApp(App)
  .use(router)
  .use(pinia)
  .use(VueAxios, apiaxios)
  .use(ContextMenu)        
  .provide('apiaxios', apiaxios)
  .mount("#app");

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
mainStore.updateTipos(false);
mainStore.updateColores(false);

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "Admin One Vue 3 Tailwind";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
