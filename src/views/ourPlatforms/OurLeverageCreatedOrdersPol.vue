<template>
  <div>
    <ActionSelector
      class="selector"
      :text="[
        {
          title: 'Suit Statistic',
          path: '/suit-statistic',
        },
        {
          title: `Our Leverage`,
          path: '/leverage/pol',
        },
      ]"
    />
    <ActionSelector
      class="selector"
      :text="[
        {
          title: 'POL',
          path: '/leverage/pol',
        },
        {
          title: `USDC`,
          path: '/leverage/usdc',
        },
      ]"
    />

    <div class="table">
      <div class="table-titles w-100">
        <div class="table-titles-title">Time</div>
        <div class="table-titles-title">Hash</div>
        <div class="table-titles-title">Own Amount</div>
        <div class="table-titles-title">Total Amount</div>
        <div style="width: 140px"></div>
      </div>
      <div v-if="finalArray.length" class="table-content">
        <table-item
          v-for="item in finalArray"
          :key="item.index"
          :event="item"
          :token="platform"
          :decimals="decimals"
        ></table-item>
      </div>
      <div
        v-else-if="
          !finalArray.length && eventLoader && !isLeverageLoad && !isLoad
        "
        class="table-empty"
      >
        Nothing to show
      </div>
      <div v-else style="position: relative">
        <div class="countdown">{{ countDown === 0 ? '...' : countDown}}</div>
        <div class="loader">
          <img src="@/assets/images/loader.svg" alt="Loading" />
        </div>
        <div style="color: white">
          {{
            isLeverageLoad
              ? "Leverage transactions loading"
              : "Event transactions loading"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionSelector from "@/components/tabs/ActionSelector";
import { mapGetters } from "vuex";
import { checkAndInstantiateWeb3 } from "@/util/web3";
import TableItem from "@/components/TableItem";

export default {
  name: "OurLeverageCreatedOrders",
  components: { TableItem, ActionSelector },
  data() {
    return {
      suitAddress: "0x0DAE2F8D931e6710cB5233ffEAabF554b43e1e67",
      ordersArray: [],
      cancelArray: [],
      eventEndArray: [],
      leverageLoader: false,
      eventLoader: false,
      isLoad: false,
      isLeverageLoad: false,
      finalArray: [],
      show: false,
      countDown: "",
      count: 0,
      hashes: 0,
      platform: "POL",
      decimals: 18,
    };
  },
  computed: {
    ...mapGetters({
      getCreatedLeverage: "getCreatedLeverage",
      getEndedEventLoader: "getEndedEventLoader",
      getEndedEvent: "getEndedEvent",
      getPermissionToRequest: "getPermissionToRequest",
    }),
    getTransData() {
      return localStorage.createdLeverageContractResult;
    },
    getHashesArray() {
      return localStorage.createdLeverageHashes;
    },
    getTransDataEvent() {
      return localStorage.endedEventContractResult;
    },
    getHashesArrayEvent() {
      return localStorage.endedEventHashes;
    },
    getCanceledDataResult() {
      return localStorage.canceledLeverageContractResult;
    },
  },
  watch: {
    async getPermissionToRequest() {
      if (
        this.getPermissionToRequest &&
        !this.leverageLoader &&
        !this.isLeverageLoad
      ) {
        await this.getLeverageCreateOrders();
      }
      if (
        this.getPermissionToRequest &&
        !this.eventLoader &&
        this.leverageLoader &&
        !this.isLoad
      ) {
        await this.getEndedEventsIds();
      }
    },
    async leverageLoader() {
      if (this.getPermissionToRequest) {
        await this.getEndedEventsIds();
      }
    },
  },
  methods: {
    contains(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hash === elem.hash) {
          return true;
        }
      }
      return false;
    },
    containsObj(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hash === elem.hash) {
          return true;
        }
      }
      return elem;
    },
    containsIds(arr, item) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].eventId === item.eventId) {
          return false;
        }
      }
      return item;
    },
    containsOrdersIds(arr, item) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item.orderId) {
          return false;
        }
      }
      return item;
    },
    transformDate(date) {
      let newDate;
      if (date) {
        newDate = new Date(date * 1000);
      } else {
        newDate = new Date();
      }
      return `${newDate.getFullYear()}-${
        newDate.getMonth().toString().length > 1 ||
        newDate.getMonth().toString() === "9"
          ? newDate.getMonth() + 1
          : "0" + (newDate.getMonth() + 1)
      }-${
        newDate.getDate().toString().length > 1
          ? newDate.getDate()
          : "0" + newDate.getDate()
      } ${newDate.toString().split(" ")[4]}`;
    },
    async getEndedEventsIds() {
      this.$store.commit("setPermissionToRequest", false);
      this.isLoad = true;
      await this.$store.dispatch("getEventLifeCycleTransaction", this.platform);
      this.eventEndArray = this.getTransDataEvent
        ? JSON.parse(this.getTransDataEvent)
        : {
            ["POL"]: [],
            ["USDC"]: [],
          };
      const web3 = await checkAndInstantiateWeb3();
      this.loading = true;
      let hashes = this.getHashesArrayEvent
        ? JSON.parse(this.getHashesArrayEvent)
        : {
            ["POL"]: [],
            ["USDC"]: [],
          };
      if (!hashes[this.platform]) {
        hashes[this.platform] = [];
      }
      if (!this.eventEndArray[this.platform]) {
        this.eventEndArray[this.platform] = [];
      }
      this.hashes = this.getEndedEvent[this.platform].length;
      this.count = 0;
      if (!hashes || !hashes[this.platform] || !hashes[this.platform].length) {
        for (let i = 0; i < this.getEndedEvent[this.platform].length; i++) {
          let endResultObj = {
            winner: "",
            eventId: "",
          };
          const dataTransaction = await web3.eth.getTransactionReceipt(
            this.getEndedEvent[this.platform][i].hash
          );
          hashes[this.platform].push({
            hash: this.getEndedEvent[this.platform][i].hash,
            // date: this.hashes[this.suitAddress][i].date,
          });
          let decodeData;
          for (let j = 0; j < dataTransaction.logs.length; j++) {
            if (
              dataTransaction.logs[j].topics[0] ===
              "0xc708083d98e4717d42ca18ffc5618bfabdc6fb2f04e8c403d2edc8eed2e6ceab"
            ) {
              decodeData = await web3.eth.abi.decodeParameters(
                ["int8", "uint256"],
                dataTransaction.logs[j].data
              );
              endResultObj.eventId = decodeData[1];
              endResultObj.winner = decodeData[0];
              this.eventEndArray[this.platform].push(endResultObj);
            }
          }
          this.count += 1;
          localStorage.endedEventContractResult = JSON.stringify(
            this.eventEndArray
          );
          localStorage.endedEventHashes = JSON.stringify(hashes);
        }
      } else if (
        this.getHashesArrayEvent &&
        JSON.parse(this.getHashesArrayEvent)[this.platform] &&
        JSON.stringify(JSON.parse(this.getHashesArrayEvent)[this.platform]) !==
          JSON.stringify(this.getEndedEvent[this.platform])
      ) {
        this.eventEndArray = this.getTransDataEvent[this.platform]
          ? JSON.parse(this.getTransDataEvent)[this.platform]
          : this.eventEndArray;
        let arr = [];
        for (let i = 0; i < this.getEndedEvent[this.platform].length; i++) {
          arr.push(
            this.containsObj(
              JSON.parse(this.getHashesArrayEvent)[this.platform],
              this.getEndedEvent[this.platform][i]
            )
          );
        }
        arr = arr.filter((item) => item !== true);
        hashes = JSON.parse(this.getHashesArrayEvent);
        this.eventEndArray = this.getTransDataEvent
                ? JSON.parse(this.getTransDataEvent)
                : {
                  ["POL"]: [],
                  ["USDC"]: [],
                };
        this.hashes = arr.length;
        this.count = 0;
        for (let i = 0; i < this.getEndedEvent[this.platform].length; i++) {
          if (
            !this.contains(
              JSON.parse(this.getHashesArrayEvent)[this.platform],
              this.getEndedEvent[this.platform][i]
            )
          ) {
            hashes[this.platform].push(this.getEndedEvent[this.platform][i]);
            this.count += 1;
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.getEndedEvent[this.platform][i].hash
            );
            let decodeData;
            let endResultObj = {
              winner: "",
              eventId: "",
            };
            for (let j = 0; j < dataTransaction.logs.length; j++) {
              if (
                dataTransaction.logs[j].topics[0] ===
                "0xc708083d98e4717d42ca18ffc5618bfabdc6fb2f04e8c403d2edc8eed2e6ceab"
              ) {
                decodeData = await web3.eth.abi.decodeParameters(
                  ["int8", "uint256"],
                  dataTransaction.logs[j].data
                );
                endResultObj.eventId = decodeData[1];
                endResultObj.winner = decodeData[0];
                this.eventEndArray[this.platform].push(endResultObj);
              }
            }
          }
          localStorage.endedEventContractResult = JSON.stringify(
            this.eventEndArray
          );
          localStorage.endedEventHashes = JSON.stringify(hashes);
        }
      }
      this.renderComponent = false;
      this.loading = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
      let leverageOrders = JSON.parse(
        localStorage.createdLeverageContractResult
      );
      let cancelOrders = JSON.parse(
        localStorage.canceledLeverageContractResult
      );
      let endEvents = JSON.parse(localStorage.endedEventContractResult);
      let filteredArrays = [];
      let finalArray = [];
      for (let i = 0; i < leverageOrders[this.platform].length; i++) {
        if (this.containsIds(endEvents[this.platform], leverageOrders[this.platform][i])) {
          filteredArrays.push(leverageOrders[this.platform][i]);
        }
      }
      for (let i = 0; i < filteredArrays.length; i++) {
        if (this.containsOrdersIds(cancelOrders[this.platform], filteredArrays[i])) {
          finalArray.push(filteredArrays[i]);
        }
      }

      this.finalArray = finalArray.sort(
        (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
      );
      this.eventLoader = true;
      this.isLoad = false;
    },
    async getLeverageCreateOrders() {
      this.$store.commit("setPermissionToRequest", false);
      this.isLeverageLoad = true;
      await this.$store.dispatch("getLeverageTransaction", this.platform);
      const web3 = await checkAndInstantiateWeb3();

      this.ordersArray = this.getTransData
        ? JSON.parse(this.getTransData)
        : {
            ["POL"]: [],
            ["USDC"]: [],
          };
      this.cancelArray = this.getCanceledDataResult
              ? JSON.parse(this.getCanceledDataResult)
              : {
                ["POL"]: [],
                ["USDC"]: [],
              };
      this.loading = true;

      let hashes = this.getHashesArray
        ? JSON.parse(this.getHashesArray)
        : {
            ["POL"]: [],
            ["USDC"]: [],
          };
      if (!hashes[this.platform]) {
        hashes[this.platform] = [];
      }

      if (!this.ordersArray[this.platform]) {
        this.ordersArray[this.platform] = [];
      }
      if (
        !this.getHashesArray ||
        !hashes[this.platform] ||
        !hashes[this.platform].length
      ) {
        if (
          (!this.getTransData &&
            (!this.getTransData || !JSON.parse(this.getTransData)[this.platform])) ||
          !this.ordersArray[this.platform].length
        ) {
          this.hashes = this.getCreatedLeverage[this.platform].length;
          this.count = 0;
          for (let i = 0; i < this.getCreatedLeverage[this.platform].length; i++) {
            if (this.getCreatedLeverage[this.platform][i].methodId === "0x451db923") {
              const dataTransaction = await web3.eth.getTransactionReceipt(
                this.getCreatedLeverage[this.platform][i].hash
              );
              hashes[this.platform].push({
                hash: this.getCreatedLeverage[this.platform][i].hash,
              });
              let decodeData;
              let leverageOrder = {
                orderId: "",
                user: "",
                maxLoss: "",
                priceChangePart: "",
                cross: "",
                ownAmount: "",
                orderAmount: "",
                isWhite: "",
                eventId: "",
                timeStamp: "",
                hash: "",
              };
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                    dataTransaction.logs[j].topics[0] ===
                    "0x51610765805cefc1b0a9f3b3e6e4bc23351ef418ea471bc5c40f6f31b8c06069"
                  ) {
                    try {
                      decodeData = await web3.eth.abi.decodeParameters(
                        [
                          "uint256",
                          "address",
                          "uint256",
                          "uint256",
                          "uint256",
                          "uint256",
                          "uint256",
                          "bool",
                          "uint256",
                        ],
                        dataTransaction.logs[j].data
                      );
                      leverageOrder.orderId = decodeData[0];
                      leverageOrder.user = decodeData[1];
                      leverageOrder.maxLoss = decodeData[2];
                      leverageOrder.priceChangePart = decodeData[3];
                      leverageOrder.cross = decodeData[4];
                      leverageOrder.ownAmount = decodeData[5];
                      leverageOrder.orderAmount = decodeData[6];
                      leverageOrder.isWhite = decodeData[7];
                      leverageOrder.eventId = decodeData[8];
                      leverageOrder.timeStamp = this.transformDate(
                        this.getCreatedLeverage[this.platform][i].timeStamp
                      );
                      leverageOrder.hash = this.getCreatedLeverage[this.platform][i].hash;

                      this.ordersArray[this.platform].push(leverageOrder);
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }
              }
            } else {
              const dataTransaction = await web3.eth.getTransactionReceipt(
                this.getCreatedLeverage[this.platform][i].hash
              );
              hashes[this.platform].push({
                hash: this.getCreatedLeverage[this.platform][i].hash,
              });
              let decodeData;
              let cancelOrder = {
                orderId: "",
              };
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                    dataTransaction.logs[j].topics[0] ===
                    "0x9384174c8517f5537b08e79211fc039e8a098571a3a2b4cb21dfa6f3237e8de1"
                  ) {
                    try {
                      decodeData = await web3.eth.abi.decodeParameters(
                        ["uint256", "address"],
                        dataTransaction.logs[j].data
                      );
                      cancelOrder.orderId = decodeData[0];
                      this.cancelArray[this.platform].push(cancelOrder.orderId);
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }
              }
            }
            localStorage.createdLeverageContractResult = JSON.stringify(
              this.ordersArray
            );
            localStorage.canceledLeverageContractResult = JSON.stringify(
              this.cancelArray
            );
            localStorage.createdLeverageHashes = JSON.stringify(hashes);
            this.count += 1;
          }
        }
      } else if (
        this.getHashesArray &&
        JSON.stringify(hashes[this.platform]) &&
              JSON.stringify(hashes[this.platform]) !== JSON.stringify(this.getCreatedLeverage[this.platform])
      ) {
        this.ordersArray = this.getTransData
          ? JSON.parse(this.getTransData)
          : this.ordersArray;
        let arr = [];
        for (let i = 0; i < this.getCreatedLeverage[this.platform].length; i++) {
          arr.push(
            this.containsObj(
                    hashes[this.platform],
              this.getCreatedLeverage[this.platform][i]
            )
          );
        }
        arr = arr.filter((item) => item !== true);
        this.ordersArray = JSON.parse(this.getTransData);
        this.count = 0;
        this.hashes = this.getCreatedLeverage[this.platform].length - hashes[this.platform].length
        for (let i = 0; i < this.getCreatedLeverage[this.platform].length; i++) {
          if (
            !this.contains(
              hashes[this.platform],
              this.getCreatedLeverage[this.platform][i]
            )
          ) {

            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.getCreatedLeverage[this.platform][i].hash
            );

            hashes[this.platform].push({
              hash: this.getCreatedLeverage[this.platform][i].hash,
              // date: this.hashes[this.suitAddress][i].date,
            });

            if (this.getCreatedLeverage[this.platform][i].methodId === "0x451db923") {
              let decodeData;
              let leverageOrder = {
                orderId: "",
                user: "",
                maxLoss: "",
                priceChangePart: "",
                cross: "",
                ownAmount: "",
                orderAmount: "",
                isWhite: "",
                eventId: "",
                timeStamp: "",
                hash: "",
              };
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                    dataTransaction.logs[j].topics[0] ===
                    "0x51610765805cefc1b0a9f3b3e6e4bc23351ef418ea471bc5c40f6f31b8c06069"
                  ) {
                    try {
                      decodeData = await web3.eth.abi.decodeParameters(
                        [
                          "uint256",
                          "address",
                          "uint256",
                          "uint256",
                          "uint256",
                          "uint256",
                          "uint256",
                          "bool",
                          "uint256",
                        ],
                        dataTransaction.logs[j].data
                      );
                      leverageOrder.orderId = decodeData[0];
                      leverageOrder.user = decodeData[1];
                      leverageOrder.maxLoss = decodeData[2];
                      leverageOrder.priceChangePart = decodeData[3];
                      leverageOrder.cross = decodeData[4];
                      leverageOrder.ownAmount = decodeData[5];
                      leverageOrder.orderAmount = decodeData[6];
                      leverageOrder.isWhite = decodeData[7];
                      leverageOrder.eventId = decodeData[8];
                      leverageOrder.timeStamp = this.transformDate(
                        this.getCreatedLeverage[this.platform][i].timeStamp
                      );
                      leverageOrder.hash = this.getCreatedLeverage[this.platform][i].hash;

                      this.ordersArray[this.platform].push(leverageOrder);
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }
              }
            } else {
              const dataTransaction = await web3.eth.getTransactionReceipt(
                this.getCreatedLeverage[this.platform][i].hash
              );
              let decodeData;
              let cancelOrder = {
                orderId: "",
              };
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                    dataTransaction.logs[j].topics[0] ===
                    "0x9384174c8517f5537b08e79211fc039e8a098571a3a2b4cb21dfa6f3237e8de1"
                  ) {
                    try {
                      decodeData = await web3.eth.abi.decodeParameters(
                        ["uint256", "address"],
                        dataTransaction.logs[j].data
                      );
                      cancelOrder.orderId = decodeData[0];
                      this.cancelArray[this.platform].push(cancelOrder.orderId);
                      localStorage.canceledLeverageContractResult =
                        JSON.stringify(this.cancelArray);
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }
              }
            }
          }
          this.count += 1;

          localStorage.createdLeverageContractResult = JSON.stringify(
            this.ordersArray
          );
          localStorage.createdLeverageHashes = JSON.stringify(hashes);
        }
      } else {
        this.ordersArray = JSON.parse(this.getTransData);
      }
      this.count = 0;

      this.renderComponent = false;
      this.loading = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
      this.leverageLoader = true;
      this.isLeverageLoad = false;
    },
    countDownTimer() {
        this.countDown = Math.floor((this.hashes - this.count) / 5);
      if (this.countDown < 0){
        clearInterval(this.updateInterval)
        this.countDown = '...'
      }
    },
  },
  created() {
    this.updateInterval = setInterval(this.countDownTimer, 500)
  },
  beforeDestroy() {
    clearInterval(this.updateInterval)

    // this.countDown = -1;
  },
  mounted() {
    if (this.getPermissionToRequest) {
      this.getLeverageCreateOrders();
    }
  },
};
</script>

<style lang="scss" scoped>
.selector {
  margin: 30px auto;
}
.table {
  max-width: 800px;
  background: #2b2b37;
  padding: 20px;
  border-radius: 30px;
  width: 100%;
  margin: auto;
  &-titles {
    display: flex;
    justify-content: space-between;
    &-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      color: white;
    }
  }
  &-content {
    background: #1c1c25;
    padding: 20px;
    border-radius: 20px;
    margin-top: 20px;
  }
  &-text {
    color: white;
    font-weight: 600;
  }
  &-empty {
    color: white;
    font-size: 20px;
    margin: 20px 0 10px;
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
.countdown {
  position: absolute;
  z-index: 100;
  top: 25px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 20px;
  color: white;
}
</style>