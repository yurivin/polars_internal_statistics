<template>
  <div>
    <div class="event-list">
      <div class="title">
        <div>CREATED SUITS</div>
      </div>

      <div class="menu-list">
        <div class="row menu-list-title">
          <span class="col-4">LAST MONTH</span>
          <span class="col-4">LAST 3 MONTH </span>
          <span class="col-4">LAST YEAR </span>
        </div>
        <div v-if="storeLoader || localLoader" class="row menu-list-body">
          <span class="col-4"> {{ lastMonthSuits.length }}</span>
          <span class="col-4"> {{ lastThreeMonthSuits.length }} </span>
          <span class="col-4"> {{ lastYearSuits.length }} </span>
        </div>
        <div v-else class="loader">
          <img src="../assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
    </div>
    <AmountOrdersStatTable
      class="mt-5"
      v-if="finalResultOrders && finalResultEvents"
      :rows="filteredSuitAddressesArray"
      :contractItemObject="contractsAddressesBySuitArray"
      :itemObject="finalResultOrders"
      :eventItemObject="finalResultEvents"
      @sortBy3MonthOrder="sortBy3MonthOrder"
      @sortByMonthOrder="sortByMonthOrder"
      @sortBy3MonthEvent="sortBy3MonthEvent"
      @sortByMonthEvent="sortByMonthEvent"
    />
    <div v-else class="loader">
      <img src="../assets/images/loader.svg" alt="Loading" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkAndInstantiateWeb3 } from "@/util/web3";
import AmountOrdersStatTable from "@/components/tables/AmountOrdersStatTable";

export default {
  name: "suit-statistic",
  components: { AmountOrdersStatTable },
  data() {
    return {
      localLoader: false,
      lastMonthSuits: [],
      lastThreeMonthSuits: [],
      lastYearSuits: [],
      allSuitsAddressesArray: [],
      allContractsBySuitsArray: [],
      filteredSuitAddressesArray: localStorage.filteredAddressesSuits
        ? JSON.parse(localStorage.filteredAddressesSuits)
        : [],
      contractsAddressesBySuitArray: localStorage.allSuitsContracts
        ? JSON.parse(localStorage.allSuitsContracts)
        : {},
      renderComponent: true,
      isReadyOrders: false,
      isReadyEvents: false
    };
  },
  computed: {
    ...mapGetters({
      createdSuits: "getSuits",
      storeLoader: "getLoader",
      createdOrders: "getCreatedOrders",
      storeCreatedOrdersLoader: "getCreatedOrdersLoader",
      createdEvents: "getCreatedEvents",
      storeCreatedEventsLoader: "getCreatedEventsLoader",
      finalResultOrders: "getFinalResultOrders",
      finalResultEvents: "getFinalResultEvents",
      getPermissionToRequest: "getPermissionToRequest",
    }),
  },
  watch: {
    isReadyEvents(){
      this.getCreatedEventsBySuits();
    },
    isReadyOrders(){
      this.getCreatedOrdersBySuits();
    },
    storeLoader() {
      this.culcSuitsByDate();
    },
    createdSuits() {
      this.getAllSuitAddresses();
    },
    storeCreatedOrdersLoader() {
      this.setOrdersContracts();
    },
    storeCreatedEventsLoader() {
      this.setEventsContracts();
    },
    contractsAddressesBySuitArray() {
      this.getAllTransactionOfSuits();
    },
    async getPermissionToRequest() {
      if (
        this.getPermissionToRequest &&
        !this.storeLoader &&
        !localStorage.createdSuits
      ) {
        await this.getSuits();
      }
      if (this.getPermissionToRequest && !this.storeCreatedOrdersLoader) {
       await this.getCreatedOrdersBySuits();
      }
      if (
        this.getPermissionToRequest &&
        this.storeCreatedOrdersLoader &&
        !this.storeCreatedEventsLoader
      ) {
        await this.getCreatedEventsBySuits();
      }
      if (
        this.getPermissionToRequest &&
        this.contractsAddressesBySuitArray[this.filteredSuitAddressesArray[0]]
      ) {
        await this.getAllTransactionOfSuits();
      }
    },
  },
  methods: {
    getAllTransactionOfSuits() {
      for (let i = 0; i < this.filteredSuitAddressesArray.length; i++) {
        if (
          this.getPermissionToRequest &&
          (!localStorage.finalResultOrders ||
            !JSON.parse(localStorage.finalResultOrders)[
              this.filteredSuitAddressesArray[i]
            ])
        ) {
          this.$store.commit("setPermissionToRequest", false);

          this.$store.dispatch(
            "getTransactionOrders",
            this.contractsAddressesBySuitArray[
              this.filteredSuitAddressesArray[i]
            ]
          );
        }
        if (
          this.getPermissionToRequest &&
          (!localStorage.finalResultEvents ||
            !JSON.parse(localStorage.finalResultEvents)[
              this.filteredSuitAddressesArray[i]
            ])
        ) {
          this.$store.commit("setPermissionToRequest", false);

          this.$store.dispatch(
            "getTransactionEvents",
            this.contractsAddressesBySuitArray[
              this.filteredSuitAddressesArray[i]
            ]
          );
        }
      }
    },
    contains(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
          return true;
        }
      }
      return false;
    },
    sortBy3MonthEvent() {
      let arr = [];
      let sorted = Object.keys(this.finalResultEvents)
        .sort(
          (b, a) =>
            this.finalResultEvents[a][
              this.contractsAddressesBySuitArray[a].eventAddress
            ].length -
            this.finalResultEvents[b][
              this.contractsAddressesBySuitArray[b].eventAddress
            ].length
        )
        .reduce(
          (rslt, key) => rslt.set(key, this.finalResultEvents[key]),
          new Map()
        );
      for (let address of sorted.keys()) {
        arr.push(address);
      }
      for (let i = 0; i < this.filteredSuitAddressesArray.length; i++) {
        if (!this.contains(arr, this.filteredSuitAddressesArray[i])) {
          arr.push(this.filteredSuitAddressesArray[i]);
        }
      }

      // if (this.filteredSuitAddressesArray.length <= arr.length) {
      this.filteredSuitAddressesArray = arr;
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
      // }
    },
    sortByMonthEvent() {
      let arr = [];
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;

      let sorted = Object.keys(this.finalResultEvents)
        .sort(
          (b, a) =>
            this.finalResultEvents[a][
              this.contractsAddressesBySuitArray[a].eventAddress
            ].filter((item) => item.timeStamp * 1000 >= lastMonthDate).length -
            this.finalResultEvents[b][
              this.contractsAddressesBySuitArray[b].eventAddress
            ].filter((item) => item.timeStamp * 1000 >= lastMonthDate).length
        )
        .reduce(
          (rslt, key) => rslt.set(key, this.finalResultEvents[key]),
          new Map()
        );
      for (let address of sorted.keys()) {
        arr.push(address);
      }
      for (let i = 0; i < this.filteredSuitAddressesArray.length; i++) {
        if (!this.contains(arr, this.filteredSuitAddressesArray[i])) {
          arr.push(this.filteredSuitAddressesArray[i]);
        }
      }

      // if (this.filteredSuitAddressesArray.length <= arr.length) {
      this.filteredSuitAddressesArray = arr;
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
      // }
    },
    sortBy3MonthOrder() {
      let arr = [];
      let sorted = Object.keys(this.finalResultOrders)
        .sort(
          (b, a) =>
            this.finalResultOrders[a][
              this.contractsAddressesBySuitArray[a].orderAddress
            ].length -
            this.finalResultOrders[b][
              this.contractsAddressesBySuitArray[b].orderAddress
            ].length
        )
        .reduce(
          (rslt, key) => rslt.set(key, this.finalResultOrders[key]),
          new Map()
        );
      for (let address of sorted.keys()) {
        arr.push(address);
      }
      for (let i = 0; i < this.filteredSuitAddressesArray.length; i++) {
        if (!this.contains(arr, this.filteredSuitAddressesArray[i])) {
          arr.push(this.filteredSuitAddressesArray[i]);
        }
      }

      // if (this.filteredSuitAddressesArray.length <= arr.length) {
      this.filteredSuitAddressesArray = arr;
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
      // }
    },
    sortByMonthOrder() {
      let arr = [];
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;

      let sorted = Object.keys(this.finalResultOrders)
        .sort(
          (b, a) =>
            this.finalResultOrders[a][
              this.contractsAddressesBySuitArray[a].orderAddress
            ].filter((item) => item.timeStamp * 1000 >= lastMonthDate).length -
            this.finalResultOrders[b][
              this.contractsAddressesBySuitArray[b].orderAddress
            ].filter((item) => item.timeStamp * 1000 >= lastMonthDate).length
        )
        .reduce(
          (rslt, key) => rslt.set(key, this.finalResultOrders[key]),
          new Map()
        );
      for (let address of sorted.keys()) {
        arr.push(address);
      }
      for (let i = 0; i < this.filteredSuitAddressesArray.length; i++) {
        if (!this.contains(arr, this.filteredSuitAddressesArray[i])) {
          arr.push(this.filteredSuitAddressesArray[i]);
        }
      }

      // if (this.filteredSuitAddressesArray.length <= arr.length) {
      this.filteredSuitAddressesArray = arr;
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
      // }
    },
    async setEventsContracts() {
      let hashesCreatedOrders = [];
      let suitAddressesArray = [];
      const web3 = await checkAndInstantiateWeb3();

      for (let i = 0; i < this.createdEvents.length; i++) {
        const dataTransaction = await web3.eth.getTransactionReceipt(
          this.createdEvents[i].hash
        );
        hashesCreatedOrders.push({
          hash: this.createdEvents[i].hash,
          date: this.createdEvents[i].date,
        });
        let addressesObject;
        if (dataTransaction) {
          for (let j = 0; j < dataTransaction.logs.length; j++) {
            if (
              dataTransaction.logs[j].topics[0] ===
              "0xd127e714d98e23e914e6659df0aa28a12758da7c47219dbcc981d617de644b13"
            ) {
              const decodeSuitAddress = await web3.eth.abi.decodeParameters(
                ["address", "address", "string"],
                dataTransaction.logs[j].data
              )[0];
              const decodeEventAddress = await web3.eth.abi.decodeParameters(
                ["address", "address", "string"],
                dataTransaction.logs[j].data
              )[1];
              addressesObject = {
                suitAddress: decodeSuitAddress,
                eventAddress: decodeEventAddress,
              };
            }
          }
        }
        suitAddressesArray.push(addressesObject);
      }
      let arr = {};
      for (let i = 0; i < this.allContractsBySuitsArray.length; i++) {
        for (let j = 0; j < suitAddressesArray.length; j++) {
          if (
            this.allContractsBySuitsArray[i].suitAddress ===
            suitAddressesArray[j].suitAddress
          ) {
            arr[this.allContractsBySuitsArray[i].suitAddress] = {
              suitAddress: this.allContractsBySuitsArray[i].suitAddress,
              orderAddress: this.allContractsBySuitsArray[i].orderAddress,
              collateralToken: this.allContractsBySuitsArray[i].collateralToken,
              eventAddress: suitAddressesArray[j].eventAddress,
            };
            break;
          }
        }
      }
      this.contractsAddressesBySuitArray = arr;
      localStorage.allSuitsContracts = JSON.stringify(arr);
      this.isReadyEvents = true

    },
    async setOrdersContracts() {
      let hashesCreatedOrders = [];
      let suitAddressesArray = [];
      let filteredAddressesSuits = [];
      const web3 = await checkAndInstantiateWeb3();

      for (let i = 0; i < this.createdOrders.length; i++) {
        const dataTransaction = await web3.eth.getTransactionReceipt(
          this.createdOrders[i].hash
        );

        hashesCreatedOrders.push({
          hash: this.createdOrders[i].hash,
          date: this.createdOrders[i].date,
        });
        let decodeCollateralAddress;
        for (let j = 0; j < this.createdSuits.length; j++) {
          const dataTransaction = await web3.eth.getTransactionReceipt(
                  this.createdSuits[j].hash
          );
          let decodeData = await web3.eth.abi.decodeParameters(
            ["address"],
            this.createdOrders[i].input.substr(10)
          )[0];
          let decodeSuitAddress;
          for (let k = 0; k < dataTransaction.logs.length; k++) {
            if (
              dataTransaction.logs[k].topics[0] ===
              "0x13e0e1a18ac52721beead955fbb43c6d8a06b370ebf65012590dfc740e08dbf4"
            ) {
              decodeSuitAddress = await web3.eth.abi.decodeParameters(
                ["string","address", "address"],
                dataTransaction.logs[k].data
              )[1];
            }
          }
          if (decodeData && decodeData === decodeSuitAddress) {
            decodeCollateralAddress = await web3.eth.abi.decodeParameters(
              ["string", "address"],
              this.createdSuits[j].input.substr(10)
            )[1];
          }
        }
        let addressesObject;
        if (dataTransaction) {
          for (let j = 0; j < dataTransaction.logs.length; j++) {
            if (
              dataTransaction.logs[j].topics[0] ===
              "0xd127e714d98e23e914e6659df0aa28a12758da7c47219dbcc981d617de644b13"
            ) {
              const decodeSuitAddress = await web3.eth.abi.decodeParameters(
                ["address", "address", "string"],
                dataTransaction.logs[j].data
              )[0];
              const decodeOrderAddress = await web3.eth.abi.decodeParameters(
                ["address", "address", "string"],
                dataTransaction.logs[j].data
              )[1];
              addressesObject = {
                suitAddress: decodeSuitAddress,
                orderAddress: decodeOrderAddress,
                collateralToken: decodeCollateralAddress,
              };
              filteredAddressesSuits.push(decodeSuitAddress);
            }
          }
        }
        suitAddressesArray.push(addressesObject);

      }
      this.filteredSuitAddressesArray = filteredAddressesSuits;
      localStorage.filteredAddressesSuits = JSON.stringify(
        filteredAddressesSuits
      );
      this.allContractsBySuitsArray = suitAddressesArray;
      this.isReadyOrders = true
      await this.setEventsContracts();
    },
    culcSuitsByDate() {
      let currentTime = new Date().getTime();
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;
      const lastThreeMonthDate = new Date().getTime() - 92 * 24 * 3600 * 1000;
      const lastYearDate = new Date().getTime() - 365 * 24 * 3600 * 1000;
      let lastMonthSuits = []
      let lastThreeMonthSuits = []
      let lastYearSuits = []
      for (let i = 0; i < this.createdSuits.length; i++) {
        const date = this.createdSuits[i].timeStamp * 1000;
        const transactionDate = new Date(date).getTime();
        if (
          transactionDate <= currentTime &&
          transactionDate >= lastMonthDate
        ) {
          lastMonthSuits.push(this.createdSuits[i]);
          this.lastMonthSuits = lastMonthSuits
        }
        if (
          transactionDate <= currentTime &&
          transactionDate >= lastThreeMonthDate
        ) {
          lastThreeMonthSuits.push(this.createdSuits[i]);
          this.lastThreeMonthSuits = lastThreeMonthSuits
        }
        if (transactionDate <= currentTime && transactionDate >= lastYearDate) {
          lastYearSuits.push(this.createdSuits[i]);
          this.lastYearSuits = lastYearSuits
        }
      }
    },
    async getSuits() {
      if (!localStorage.createdSuits) {
        if (this.getPermissionToRequest) {
          this.$store.commit("setPermissionToRequest", false);
          await this.$store.dispatch("getCreatedSuits");
        }
      } else {
        this.localLoader = true;
        this.culcSuitsByDate();
      }
    },
    async getAllSuitAddresses() {
      let suitAddressesArray = [];
      let hashesCreatedSuits = [];
      const web3 = await checkAndInstantiateWeb3();

      for (let i = 0; i < this.createdSuits.length; i++) {
        const dataTransaction = await web3.eth.getTransactionReceipt(
          this.createdSuits[i].hash
        );
        hashesCreatedSuits.push({
          hash: this.createdSuits[i].hash,
          date: this.createdSuits[i].date,
        });
        let suitAddress;
        if (dataTransaction) {
          for (let j = 0; j < dataTransaction.logs.length; j++) {
            if (
              dataTransaction.logs[j].topics[0] ===
              "0xb1b338517bbceffa1a2fe820ed40bd898c364fb0cd3d98c304b8b84e71bd2838"
            ) {
              const decodeData = await web3.eth.abi.decodeParameters(
                ["address", "address"],
                dataTransaction.logs[j].data
              )[0];
              suitAddress = decodeData;
            }
          }
        }
        suitAddressesArray.push(suitAddress);
      }
      this.allSuitsAddressesArray = suitAddressesArray;
    },
    async getCreatedOrdersBySuits() {
      if (
        this.getPermissionToRequest &&
        (!localStorage.createdOrdersContract ||
          +localStorage.timer + 24 * 3600 * 1000 < new Date().getTime())
      ) {
        this.$store.commit("setPermissionToRequest", false);
        await this.$store.dispatch("getCreatedOrders");
        await this.getCreatedEventsBySuits()
      }
    },
    async getCreatedEventsBySuits() {
      if (
        this.getPermissionToRequest &&
        (!localStorage.createdEventsContract ||
          +localStorage.timer + 24 * 3600 * 1000 < new Date().getTime())
      ) {
        this.$store.commit("setPermissionToRequest", false);
        await this.$store.dispatch("getCreatedEvents");
      }
    },
  },
  async mounted() {
    if (localStorage.createdSuits) {
      this.localLoader = true;
      this.culcSuitsByDate();
    }
    if (
      !localStorage.timer ||
      +localStorage.timer + 24 * 3600 * 1000 < new Date().getTime()
    ) {

      await this.getSuits();
      await this.getCreatedOrdersBySuits();
      await this.getCreatedEventsBySuits();
    }
    if (localStorage.finalResultOrders) {
      this.getAllTransactionOfSuits();
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  .title {
    display: flex;
    text-align: left;
    flex-direction: column;

    .hi {
      font-size: 26px;
      line-height: 92%;
      color: white;
    }

    .name {
      font-weight: 600;
      font-size: 42px;
      line-height: 92%;
      color: white;
    }
  }
}

.header {
  width: 100%;
  max-width: 690px;
  margin: 0 auto;
}
.header_wrapper {
  width: 673px;
  max-width: 690px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 1199px) {
    justify-content: center;
  }
}
.content-mobile {
  margin: 0;
  @media (max-width: 768px) {
    margin-top: -80px;
  }
}
.event-list {
  position: relative;
  z-index: 100;
  background: #2b2b37;
  max-width: 690px;
  width: 100%;
  overflow: visible;
  border-radius: 35px;
  margin: auto;
  height: auto;
  padding: 27px 10px 10px 10px;

  .title {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 698px;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 92.3%;
    padding: 5px 20px 0 50px;
    color: white;
    margin-left: -23px;
  }
}
.dates {
  /*position: absolute;*/
  /*top: 0;*/
  /*right: 15px;*/

  max-width: 330px;
  /*width: 330px;*/
  height: 33px;
  .text {
    padding: 6px 10px;
    font-size: 16px;
    color: white;
    margin-left: 10px;
    @media (max-width: 440px) {
      margin-left: 0;
    }
  }
  .date {
    width: 80px;
  }
}
.btn {
  @media (max-width: 768px) {
    margin: 20px 0 0 0;
  }
}
.dates_btn {
  height: 40px;
  margin-top: 20px;
  background: white;
  align-items: center;
  border-radius: 13px;
  @media (max-width: 768px) {
    height: auto;
    padding: 20px;
  }
}
.dates_input {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: flex-start;
  @media (max-width: 1300px) {
    max-width: 75%;
  }
  @media (max-width: 768px) {
    max-width: 100%;
    justify-content: space-between;
  }
}
.input {
  margin-left: 15px;
  margin-top: 1px;
  padding: 10px 15px 5px;
  background: #2b2b37;
  border: none;
  height: 33px;
  color: white;
  border-radius: 11px;
  font-size: 13px;
  outline: none;
  max-width: 400px;
  width: 100%;
}
.input_error {
  margin-left: 15px;
  margin-top: 1px;
  padding: 10px 15px 5px;
  background: #2b2b37;
  /*border: none;*/
  height: 33px;
  color: white;
  border-radius: 11px;
  font-size: 13px;
  outline: none;
  max-width: 400px;
  width: 100%;
  border: red 1px solid;
}
.text_error {
  color: red;
  position: absolute;
  left: 35px;
  margin-top: 2px;
  font-size: 12px;
}
.wallet {
  margin-left: 5px;
  margin-right: 5px;
  .text {
    padding: 6px 10px;
    font-size: 16px;
    color: white;
    margin-left: 10px;
    @media (max-width: 440px) {
      margin-left: 0;
    }
  }
}
.trade-top {
  max-width: 690px;
  padding: 20px 0 14px 10px;
  background: gray;
  border-radius: 24px 24px 0 0;
  margin: 35px auto 0;

  @media (max-width: 768px) {
    width: 93vw;
    margin-top: -60px;
  }
}
.loader {
  animation: rotate 2s linear infinite;
  margin: 20px auto;
  filter: invert(0%) sepia(0%) saturate(7486%) hue-rotate(179deg)
    brightness(111%) contrast(100%);
  animation-name: loader;
  @keyframes loader {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}

.selector {
  margin: 0 0 20px 15px !important;
}
.burned {
  margin: 50px 0;
  font-size: 16px;
}
.menu-list {
  position: relative;
  padding: 15px 25px 10px 25px;
  background: #1c1c25;
  border-radius: 30px;
  width: 100%;
  max-height: 497px;
  margin-top: 20px;
  height: auto;

  .menu-list-title {
    padding-bottom: 10px;
    font-style: normal;
    font-weight: normal;
    line-height: 92.3%;
    color: #5a5e66;
    font-size: 12px;
    text-align: center;
  }
}
.menu-list-body {
  color: white;
  padding-top: 20px;
  padding-bottom: 15px;
  background: #2b2b37;
  border-radius: 30px;
  text-align: center;
}

.menu-list-body-list {
  padding-bottom: 20px;
  font-style: normal;
  font-weight: normal;
  line-height: 92.3%;
  color: white;
  font-size: 12px;
}
</style>
