import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import {
  DEFAULT_SCAN_LINK,
  LOCATION_NETWORK_ID,
  timeOutApi,
  SUITE_FACTORY_ADDRESS,
  PENDING_ORDERS_FACTORY_ADDRESS,
  EVENT_LIFE_CYCLE_FACTORY_ADDRESS,
} from "@/util/constants/scanConfigs";
// import SUITE_ABI from '@/util/constants/contractsABI/suite2.json'
// import ContractInstance from '@/util/ContractInstance'

import { debounce } from "@/util/helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    createdSuits: localStorage.createdSuits ? JSON.parse(localStorage.createdSuits) : [],
    createdOrdersContract: localStorage.createdOrdersContract ? JSON.parse(localStorage.createdOrdersContract) : [],
    createdEventsContract: localStorage.createdEventsContract ? JSON.parse(localStorage.createdEventsContract) : [],
    fetch: () => console.log("fetch"),
    loader: null,
    createdOrdersLoader: null,
    createdEventsLoader: null,
    numbersOfTransOrderMade: localStorage.numbersOfTransOrderMade ? JSON.parse(localStorage.numbersOfTransOrderMade):[],
    numbersOfTransStartEventMade: localStorage.numbersOfTransStartEventMade ? JSON.parse(localStorage.numbersOfTransStartEventMade): [],
    finalResultOrders: localStorage.finalResultOrders ? JSON.parse(localStorage.finalResultOrders): null,
    finalResultEvents: localStorage.finalResultEvents ? JSON.parse(localStorage.finalResultEvents): null,
    canSendRequest: false,
  },
  actions: {
    async initFetchTransaction({ commit }, timer) {
      const fetch = debounce(
        async ({ type, addresses }) => {
          if (type === "CreatedSuits") {
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${SUITE_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                (item) =>
                  item.methodId === "0xa58bb472" && +item.txreceipt_status
              );
              commit("setCreatedSuits", polygonResult);
              commit("setLoader", true);
            } catch (error) {
              console.log(error);
            }
          }
          if (type === "CreatedOrdersContract") {
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${PENDING_ORDERS_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                (item) =>
                  item.methodId === "0xe2d73ccd" && +item.txreceipt_status
              );
              commit("setCreatedOrdersContract", polygonResult);
              commit("setCreatedOrdersLoader", true);
              console.log(polygonResult);
            } catch (error) {
              console.log(error);
            }
          }
          if (type === "CreatedEventsContract") {
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${EVENT_LIFE_CYCLE_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                (item) =>
                  item.methodId === "0x3c46c43c" && +item.txreceipt_status
              );
              commit("setCreatedEventsContract", polygonResult);
              commit("setCreatedEventsLoader", true);
              console.log(polygonResult);
            } catch (error) {
              console.log(error);
            }
          }
          if (type === "AllOrders") {
            let object = {
              [addresses.suitAddress]: { [addresses.orderAddress]: {} },
            };
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${addresses.orderAddress}&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                (item) =>
                  item.methodId === "0xe44b2892" && +item.txreceipt_status
              );
              // commit('setCreatedEventsLoader', true)
              object[addresses.suitAddress][addresses.orderAddress] =
                polygonResult;
              // console.log(object)
              commit("setNumbersOfTransOrderMade", object);
            } catch (error) {
              console.log(error);
            }
          }
          if (type === "AllEvents") {
            let object = {
              [addresses.suitAddress]: { [addresses.eventAddress]: {} },
            };
            try {
              let {
                data: { result: polygonResult },
              } = await axios.get(
                `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${addresses.eventAddress}&startblock=1&endblock=99999999&sort=desc`
              );
              polygonResult = polygonResult.filter(
                (item) =>
                  item.methodId === "0xe2fd38e9" && +item.txreceipt_status
              );
              // commit('setCreatedEventsLoader', true)
              object[addresses.suitAddress][addresses.eventAddress] =
                polygonResult;
              // console.log(object)
              commit("setNumbersOfTransEventStartMade", object);
            } catch (error) {
              console.log(error);
            }
          }
        },
        timer === 0 ? timer : timeOutApi
      );
      commit("setFetchTransaction", fetch);
    },

    async getCreatedSuits({ state }) {
      await state.fetch({ type: "CreatedSuits" });
    },
    async getCreatedOrders({ state }) {
      await state.fetch({ type: "CreatedOrdersContract" });
    },
    async getCreatedEvents({ state }) {
      await state.fetch({ type: "CreatedEventsContract" });
    },
    async getTransactionOrders({ state }, addresses) {
      await state.fetch({ type: "AllOrders", addresses });
    },
    async getTransactionEvents({ state }, addresses) {
      await state.fetch({ type: "AllEvents", addresses });
    },
  },
  mutations: {
    setPermissionToRequest(state, payload){
      state.canSendRequest = payload
    },
    setNumbersOfTransEventStartMade(state, payload) {
      state.numbersOfTransStartEventMade.push(payload);
      localStorage.numbersOfTransStartEventMade = JSON.stringify(state.numbersOfTransStartEventMade)
      const obj = {};
      for (let i = 0; i < state.numbersOfTransStartEventMade.length; i++) {
        obj[Object.keys(state.numbersOfTransStartEventMade[i])] =
          state.numbersOfTransStartEventMade[i][
            Object.keys(state.numbersOfTransStartEventMade[i])
          ];
      }
      state.finalResultEvents = obj;
      localStorage.finalResultEvents = JSON.stringify(obj)
      console.log(obj);
    },
    setNumbersOfTransOrderMade(state, payload) {
      state.numbersOfTransOrderMade.push(payload);
      localStorage.numbersOfTransOrderMade = JSON.stringify(state.numbersOfTransOrderMade)

      const obj = {};
      for (let i = 0; i < state.numbersOfTransOrderMade.length; i++) {
        obj[Object.keys(state.numbersOfTransOrderMade[i])] =
          state.numbersOfTransOrderMade[i][
            Object.keys(state.numbersOfTransOrderMade[i])
          ];
      }
      state.finalResultOrders = obj;
      localStorage.finalResultOrders = JSON.stringify(obj)
    },
    setCreatedEventsContract(state, payload) {
      state.createdEventsContract = payload;
      localStorage.createdEventsContract = JSON.stringify(payload)
    },
    setCreatedOrdersContract(state, payload) {
      state.createdOrdersContract = payload;
      localStorage.createdOrdersContract = JSON.stringify(payload)
    },
    setCreatedSuits(state, payload) {
      state.createdSuits = payload;
      localStorage.createdSuits = JSON.stringify(payload)
    },
    setFetchTransaction(state, payload) {
      state.fetch = payload;
    },
    setLoader(state, payload) {
      state.loader = payload;
    },
    setCreatedOrdersLoader(state, payload) {
      state.createdOrdersLoader = payload;
    },
    setCreatedEventsLoader(state, payload) {
      state.createdEventsLoader = payload;
    },
  },

  getters: {
    getFinalResultEvents(state) {
      return state.finalResultEvents;
    },
    getFinalResultOrders(state) {
      return state.finalResultOrders;
    },
    getCreatedEvents(state) {
      return state.createdEventsContract;
    },
    getCreatedOrders(state) {
      return state.createdOrdersContract;
    },
    getSuits(state) {
      return state.createdSuits;
    },
    getFetch(state) {
      return state.fetch;
    },
    getLoader(state) {
      return state.loader;
    },
    getCreatedOrdersLoader(state) {
      return state.createdOrdersLoader;
    },
    getCreatedEventsLoader(state) {
      return state.createdEventsLoader;
    },
    getPermissionToRequest(state){
      return state.canSendRequest
    }
  },
  modules: {},
});
