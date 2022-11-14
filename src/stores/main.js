import { defineStore } from "pinia";
import { useLocalStorage } from '@vueuse/core'
import { supabase } from "../supabase";

window.supabase = supabase
export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
    wcproducts: { "ho": "hola" },
    tipos: useLocalStorage('tipos', {}),
    colores: useLocalStorage('colores', {})

  }),
  getters: {
    // automatically infers the return type as a number
    doubleCount(state) {
      return state.count * 2
    },
  },
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
    },
    updateTipos(force) {
      if (Object.keys(this.tipos).length == 0 || force)
        supabase
          .from('tipos')
          .select()
          .then((result) => {
            const { data, error } = result
            this.tipos = {}
            for (let tipo of data) {
              this.tipos[tipo.id] = tipo.slug
            }
          })
    },
    updateColores(force) {
      if (Object.keys(this.colores).length == 0 || force)
        supabase
          .from('colores')
          .select()
          .then((result) => {
            const { data, error } = result
            console.log(data)
            this.colores = {}
            for (let color of data) {
              this.colores[color.id] = color.slug
            }
          })
    },
  },
});
