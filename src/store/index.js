import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {
    async getCreatedSuits() {
        try {
            const {
                data: { result: polygonResult },
            } = await axios.get(
                'https://api.polygonscan.com/api?module=account&action=tokentx&address=0xabc0000000000000000000000000000000000def&startblock=0&endblock=99999999&sort=asc'
            )
            console.log(polygonResult)
            // let value = 0
            // const burtTokenArray = [
            //     ...polygonResult,
            //     ...etherscanResult,
            //     ...bscscanResult,
            // ]

            // burtTokenArray.map((item) => (value += +item.value / Math.pow(10, 18)))
            // value += HECO_BURN_POL
            // localStorage.burnTokens = value
            // localStorage.burnedTimer = new Date().getTime()
            // commit('setBurnedTokens', value)
        } catch (error) {
            console.log(error)
        }
    },
  },
  mutations: {},

  getters: {},

  modules: {},
});
