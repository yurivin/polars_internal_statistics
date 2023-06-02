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
  LEVERAGE_CONTRACT_ADDRESS,
  EVENT_LIFE_CYCLE_CONTRACT_ADDRESS,
} from "@/util/constants/scanConfigs";
import COLLATERAL_ABI from "@/util/constants/contractsABI/usdcToken.json";
import ContractInstance from "@/util/ContractInstance";

// import { debounce } from "@/util/helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    createdSuits: localStorage.createdSuits
      ? JSON.parse(localStorage.createdSuits)
      : [],
    createdOrdersContract: localStorage.createdOrdersContract
      ? JSON.parse(localStorage.createdOrdersContract)
      : [],
    createdEventsContract: localStorage.createdEventsContract
      ? JSON.parse(localStorage.createdEventsContract)
      : [],
    createdLeverageContract: localStorage.createdLeverageContract
      ? JSON.parse(localStorage.createdLeverageContract)
      : {
          POL: [],
          USDC: [],
        },
    endedEventContract: localStorage.endedEventContract
      ? JSON.parse(localStorage.endedEventContract)
      : {
          POL: [],
          USDC: [],
        },
    fetch: () => console.log("fetch"),
    loader: null,
    createdOrdersLoader: null,
    createdEventsLoader: null,
    createdLeverageLoader: null,
    endedEventLoader: null,
    numbersOfTransOrderMade: localStorage.numbersOfTransOrderMade
      ? JSON.parse(localStorage.numbersOfTransOrderMade)
      : [],
    numbersOfTransStartEventMade: localStorage.numbersOfTransStartEventMade
      ? JSON.parse(localStorage.numbersOfTransStartEventMade)
      : [],
    finalResultOrders: localStorage.finalResultOrders
      ? JSON.parse(localStorage.finalResultOrders)
      : null,
    finalResultEvents: localStorage.finalResultEvents
      ? JSON.parse(localStorage.finalResultEvents)
      : null,
    canSendRequest: true,
    collateralContract: localStorage.collateralToken
      ? JSON.parse(localStorage.collateralToken)
      : null,
  },
  actions: {
    async getCollateralContract({ commit }, collateralTokenAddress) {
      let collateralObject = {
        [collateralTokenAddress]: { decimals: "", symbol: "" },
      };

      if (localStorage.collateralToken) {
        collateralObject = JSON.parse(localStorage.collateralToken);
        collateralObject[collateralTokenAddress] = { decimals: "", symbol: "" };
      }
      const collateralToken = new ContractInstance(
        COLLATERAL_ABI,
        collateralTokenAddress
      );
      const decimals = (await collateralToken.decimals()).data;
      const symbol = (await collateralToken.symbol()).data;
      collateralObject[collateralTokenAddress].decimals = decimals;
      collateralObject[collateralTokenAddress].symbol = symbol;
      localStorage.collateralToken = JSON.stringify(collateralObject);
      // let contractObject = {decimals,symbol}
      commit("setCollateralContract", collateralObject);
    },
    async getCreatedSuits({ commit }) {
      // await state.fetch({ type: "CreatedSuits" });
      try {
        let {
          data: { result: polygonResult },
        } = await axios.get(
          `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${SUITE_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
        );
        polygonResult = polygonResult.filter(
          (item) => item.methodId === "0xa58bb472" && +item.txreceipt_status
        );
        commit("setCreatedSuits", polygonResult);
        commit("setLoader", true);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getCreatedOrders({ commit }) {
      // await state.fetch({ type: "CreatedOrdersContract" });
      try {
        let {
          data: { result: polygonResult },
        } = await axios.get(
          `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${PENDING_ORDERS_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
        );
        polygonResult = polygonResult.filter(
          (item) => item.methodId === "0xe2d73ccd" && +item.txreceipt_status
        );
        commit("setCreatedOrdersContract", polygonResult);
        commit("setCreatedOrdersLoader", true);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getCreatedEvents({ commit }) {
      // await state.fetch({ type: "CreatedEventsContract" });
      try {
        let {
          data: { result: polygonResult },
        } = await axios.get(
          `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${EVENT_LIFE_CYCLE_FACTORY_ADDRESS[LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
        );
        polygonResult = polygonResult.filter(
          (item) => item.methodId === "0x3c46c43c" && +item.txreceipt_status
        );
        commit("setCreatedEventsContract", polygonResult);
        commit("setCreatedEventsLoader", true);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getTransactionOrders({ commit }, addresses) {
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
          (item) => item.methodId === "0xe44b2892" && +item.txreceipt_status
        );
        object[addresses.suitAddress][addresses.orderAddress] = polygonResult;
        commit("setNumbersOfTransOrderMade", object);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getTransactionEvents({ commit }, addresses) {
      // await state.fetch({ type: "AllEvents", addresses });
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
            (item.methodId === "0xe2fd38e9" ||
              item.methodId === "0xd24df289") &&
            +item.txreceipt_status
        );

        object[addresses.suitAddress][addresses.eventAddress] = polygonResult;
        // console.log(object)
        commit("setNumbersOfTransEventStartMade", object);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getLeverageTransaction({ commit }, platform) {
      // await state.fetch({ type: "CreatedOrdersContract" });
      let object = {
            'POL': [],
            'USDC': [],
          };
      try {
        let {
          data: { result: polygonResult },
        } = await axios.get(
          `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${LEVERAGE_CONTRACT_ADDRESS[platform][LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
        );

        polygonResult = polygonResult.filter(
          (item) =>
            item.methodId === "0x451db923" ||
            (item.methodId === "0x514fcac7" && +item.txreceipt_status)
        );
        object[platform] = polygonResult
        commit("setCreatedLeverageContract", object);
        commit("setCreatedLeverageLoader", true);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
    async getEventLifeCycleTransaction({ commit }, platform) {
      // await state.fetch({ type: "CreatedOrdersContract" });
      let object = {
            'POL': [],
            'USDC': [],
          };
      try {
        let {
          data: { result: polygonResult },
        } = await axios.get(
          `${DEFAULT_SCAN_LINK[LOCATION_NETWORK_ID]}?module=account&action=txlist&address=${EVENT_LIFE_CYCLE_CONTRACT_ADDRESS[platform][LOCATION_NETWORK_ID]}&startblock=1&endblock=99999999&sort=desc`
        );

        polygonResult = polygonResult.filter(
          (item) => item.methodId === "0xd24df289" && +item.txreceipt_status
        );
        object[platform] = polygonResult
        commit("setEndedEventContract", object);
        commit("setEndedEventLoader", true);
        setTimeout(() => commit("setPermissionToRequest", true), timeOutApi);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mutations: {
    setCollateralContract(state, payload) {
      state.collateralContract = payload;
    },
    setPermissionToRequest(state, payload) {
      state.canSendRequest = payload;
    },
    setNumbersOfTransEventStartMade(state, payload) {
      state.numbersOfTransStartEventMade.push(payload);
      localStorage.numbersOfTransStartEventMade = JSON.stringify(
        state.numbersOfTransStartEventMade
      );
      const obj = {};
      for (let i = 0; i < state.numbersOfTransStartEventMade.length; i++) {
        obj[Object.keys(state.numbersOfTransStartEventMade[i])] =
          state.numbersOfTransStartEventMade[i][
            Object.keys(state.numbersOfTransStartEventMade[i])
          ];
      }
      state.finalResultEvents = obj;
      localStorage.finalResultEvents = JSON.stringify(obj);
    },
    setNumbersOfTransOrderMade(state, payload) {
      state.numbersOfTransOrderMade.push(payload);
      localStorage.numbersOfTransOrderMade = JSON.stringify(
        state.numbersOfTransOrderMade
      );

      const obj = {};
      for (let i = 0; i < state.numbersOfTransOrderMade.length; i++) {
        obj[Object.keys(state.numbersOfTransOrderMade[i])] =
          state.numbersOfTransOrderMade[i][
            Object.keys(state.numbersOfTransOrderMade[i])
          ];
      }
      state.finalResultOrders = obj;
      localStorage.finalResultOrders = JSON.stringify(obj);
    },
    setCreatedLeverageContract(state, payload) {
      state.createdLeverageContract = payload;
      localStorage.createdLeverageContract = JSON.stringify(payload);
    },
    setCreatedEventsContract(state, payload) {
      state.createdEventsContract = payload;
      localStorage.createdEventsContract = JSON.stringify(payload);
    },
    setEndedEventContract(state, payload) {
      state.endedEventContract = payload;
    },
    setCreatedOrdersContract(state, payload) {
      state.createdOrdersContract = payload;
      localStorage.createdOrdersContract = JSON.stringify(payload);
    },
    setCreatedSuits(state, payload) {
      state.createdSuits = payload;
      localStorage.createdSuits = JSON.stringify(payload);
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
    setCreatedLeverageLoader(state, payload) {
      state.createdLeverageLoader = payload;
    },
    setEndedEventLoader(state, payload) {
      state.endedEventLoader = payload;
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
    getCreatedLeverage(state) {
      return state.createdLeverageContract;
    },
    getEndedEvent(state) {
      return state.endedEventContract;
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
    getEndedEventLoader(state) {
      return state.endedEventLoader;
    },
    getPermissionToRequest(state) {
      return state.canSendRequest;
    },
    getCollateralContract(state) {
      return state.collateralContract;
    },
  },
  modules: {},
});
