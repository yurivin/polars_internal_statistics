import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {
  DEFAULT_SCAN_LINK,
  LOCATION_NETWORK_ID,
  timeOutApi
} from "@/util/constants/scanConfigs";
import { debounce } from '@/util/helpers'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    createdSuits: [],
    fetch: () => console.log('fetch'),
    loader: null,

  },
  actions: {
     async initFetchTransaction (
        {commit},
        timer
    ) {
      const fetch = debounce(
          async () => {
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                  `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=0x28A764fB5eBECcf68d0Ea7Ee3eF8eb6799E347df&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                  (item) => item.methodId === "0xa58bb472" && +item.txreceipt_status
              );
              commit("setCreatedSuits", polygonResult);
              commit('setLoader', true)
            } catch (error) {
              console.log(error);
            }
          },
          timer === 0 ? timer : timeOutApi
      )
      commit('setFetchTransaction', fetch)
    },

    async getCreatedSuits({ state }) {
      await state.fetch()
    },
  },
  mutations: {
    setCreatedSuits(state, payload) {
      state.createdSuits = payload;
    },
    setFetchTransaction (state, payload) {
      state.fetch = payload
    },
    setLoader (state, payload) {
      state.loader = payload
    }
  },

  getters: {
    getSuits(state) {
      return state.createdSuits;
    },
    getFetch (state) {
      return state.fetch
    },
    getLoader (state) {
      return state.loader
    }
  },

  modules: {},
});
