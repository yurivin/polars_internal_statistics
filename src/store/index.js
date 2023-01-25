import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    createdSuits: []
  },
  actions: {
    async getCreatedSuits({commit}) {
        try {
            let {
                data: { result: polygonResult },
            } = await axios.get(
                'https://api.polygonscan.com/api?module=account&action=txlist&address=0x28A764fB5eBECcf68d0Ea7Ee3eF8eb6799E347df&startblock=1&endblock=99999999&sort=desc'
            )
            polygonResult = polygonResult.filter(item => item.methodId === '0xa58bb472' && +item.txreceipt_status
            )
            commit('setCreatedSuits', polygonResult)
        } catch (error) {
            console.log(error)
        }
    },
  },
  mutations: {
      setCreatedSuits(state, payload) {
          state.createdSuits = payload
      }
  },

  getters: {
      getSuits(state){
          return state.createdSuits
      }
  },

  modules: {},
});
