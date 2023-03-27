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
          path: '/leverage',
        },
      ]"
    />
    <div class="table">
      <div class="table-titles w-100">
        <div class="table-titles-title">Time</div>
        <div class="table-titles-title">Own Amount</div>
        <div class="table-titles-title">Total Amount</div>
        <div style="width: 140px"></div>
      </div>
      <div v-if="finalArray.length" class="table-content">
        <table-item
          v-for="item in finalArray"
          :key="item.index"
          :event="item"
        ></table-item>
      </div>
      <div v-else class="loader">
        <img src="@/assets/images/loader.svg" alt="Loading" />
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
      eventEndArray: [],
      leverageLoader: false,
      eventLoader: false,
      isLoad: false,
      isLeverageLoad: false,
      finalArray: [],
      show: false,
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
      return sessionStorage.createdLeverageContractResult;
    },
    getHashesArray() {
      return sessionStorage.createdLeverageHashes;
    },
    getTransDataEvent() {
      return sessionStorage.endedEventContractResult;
    },
    getHashesArrayEvent() {
      return sessionStorage.endedEventHashes;
    },
  },
  watch: {
    async getPermissionToRequest() {
      console.log(this.getPermissionToRequest);
      if (this.getPermissionToRequest &&
              !this.leverageLoader && !this.isLeverageLoad) {
        console.log('getLeverageCreateOrders')
        await this.getLeverageCreateOrders()
      }
      if (
        this.getPermissionToRequest &&
         !this.eventLoader &&
        this.leverageLoader
              && !this.isLoad
      ) {
        console.log('getEndedEventsIds')

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
      this.isLoad = true
      await this.$store.dispatch("getEventLifeCycleTransaction");
      this.eventEndArray = this.getTransDataEvent
        ? JSON.parse(this.getTransDataEvent)
        : [];
      console.log(this.eventEndArray);
      const web3 = await checkAndInstantiateWeb3();
      this.loading = true;
      let hashes = this.getHashesArrayEvent
        ? JSON.parse(this.getHashesArrayEvent)
        : [];
      console.log(hashes);
      if (!hashes) {
        hashes = [];
      }
      if (!this.eventEndArray) {
        this.eventEndArray = [];
      }
      if (!this.getHashesArrayEvent || !hashes.length) {
        for (let i = 0; i < this.getEndedEvent.length; i++) {
          let endResultObj = {
            winner: "",
            eventId: "",
          };
          const dataTransaction = await web3.eth.getTransactionReceipt(
            this.getEndedEvent[i].hash
          );
          hashes.push({
            hash: this.getEndedEvent[i].hash,
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
              console.log(endResultObj);
              this.eventEndArray.push(endResultObj);
            }
          }
        }

        sessionStorage.endedEventContractResult = JSON.stringify(
          this.eventEndArray
        );
        sessionStorage.endedEventHashes = JSON.stringify(hashes);
      } else if (
        this.getHashesArrayEvent &&
        this.getHashesArrayEvent !== JSON.stringify(this.getEndedEvent)
      ) {
        this.eventEndArray = this.getTransDataEvent
          ? JSON.parse(this.getTransDataEvent)
          : this.eventEndArray;
        let arr = [];
        for (let i = 0; i < this.getEndedEvent.length; i++) {
          arr.push(
            this.containsObj(
              JSON.parse(this.getHashesArrayEvent),
              this.getEndedEvent[i]
            )
          );
        }
        arr = arr.filter((item) => item !== true);
        this.periodHashes = arr;
        hashes = JSON.parse(this.getHashesArrayEvent);
        this.eventEndArray = JSON.parse(this.getTransDataEvent);
        for (let i = 0; i < this.getEndedEvent.length; i++) {
          if (
            !this.contains(
              JSON.parse(this.getHashesArrayEvent),
              this.getEndedEvent[i]
            )
          ) {
            hashes.push(this.getEndedEvent[i]);
            this.count += 1;
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.getEndedEvent[i].hash
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
                this.eventEndArray.push(endResultObj);
              }
            }
          }
        }
        sessionStorage.endedEventContractResult = JSON.stringify(
          this.eventEndArray
        );
        sessionStorage.endedEventHashes = JSON.stringify(hashes);
      }
      this.renderComponent = false;
      this.loading = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
      let leverageOrders = JSON.parse(
        sessionStorage.createdLeverageContractResult
      );
      let endEvents = JSON.parse(sessionStorage.endedEventContractResult);
      let filteredArrays = [];
      for (let i = 0; i < leverageOrders.length; i++) {
        console.log(this.containsIds(endEvents, leverageOrders[i]));
        if (this.containsIds(endEvents, leverageOrders[i])) {
          filteredArrays.push(leverageOrders[i]);
        }
      }
      this.finalArray = filteredArrays.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
      this.eventLoader = true
      console.log(filteredArrays);
      this.isLoad = false

    },
    async getLeverageCreateOrders() {
      this.$store.commit("setPermissionToRequest", false);
      this.isLeverageLoad = true
      await this.$store.dispatch("getLeverageTransaction");
      const web3 = await checkAndInstantiateWeb3();

      this.ordersArray = this.getTransData ? JSON.parse(this.getTransData) : [];

      this.loading = true;

      let hashes = this.getHashesArray ? JSON.parse(this.getHashesArray) : [];
      if (!hashes) {
        hashes = [];
      }

      if (!this.ordersArray) {
        this.ordersArray = [];
      }
      if (!this.getHashesArray || !hashes.length) {
        if (!this.getTransData || !this.ordersArray.length) {
          for (let i = 0; i < this.getCreatedLeverage.length; i++) {
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.getCreatedLeverage[i].hash
            );
            hashes.push({
              hash: this.getCreatedLeverage[i].hash,
            });
            let decodeData;
            let leverageOrder = {
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
                  "0x6c44d5a5ba42c65c62519356afee52a821e2f1e1bdd2d825a769f11f060c3dda"
                ) {
                  try {
                    decodeData = await web3.eth.abi.decodeParameters(
                      [
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
                    leverageOrder.user = decodeData[0];
                    leverageOrder.maxLoss = decodeData[1];
                    leverageOrder.priceChangePart = decodeData[2];
                    leverageOrder.cross = decodeData[3];
                    leverageOrder.ownAmount = decodeData[4];
                    leverageOrder.orderAmount = decodeData[5];
                    leverageOrder.isWhite = decodeData[6];
                    leverageOrder.eventId = decodeData[7];
                    leverageOrder.timeStamp = this.transformDate(
                      this.getCreatedLeverage[i].timeStamp
                    );
                    leverageOrder.hash = this.getCreatedLeverage[i].hash;

                    console.log(leverageOrder);
                    this.ordersArray.push(leverageOrder);
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
            }
          }

          sessionStorage.createdLeverageContractResult = JSON.stringify(
            this.ordersArray
          );
          sessionStorage.createdLeverageHashes = JSON.stringify(hashes);
        }
      } else if (
        this.getHashesArray &&
        this.getHashesArray !== JSON.stringify(hashes)
      ) {
        this.ordersArray = this.getTransData
          ? JSON.parse(this.getTransData)
          : this.ordersArray;
        let arr = [];
        for (let i = 0; i < this.getCreatedLeverage.length; i++) {
          arr.push(
            this.containsObj(
              JSON.parse(this.getHashesArray),
              this.getCreatedLeverage[i]
            )
          );
        }
        arr = arr.filter((item) => item !== true);
        hashes = JSON.parse(this.getHashesArray);
        this.ordersArray = JSON.parse(this.getTransData);
        for (let i = 0; i < this.getCreatedLeverage.length; i++) {
          if (
            !this.contains(
              JSON.parse(this.getHashesArray),
              this.getCreatedLeverage[i]
            )
          ) {
            hashes.push(this.getCreatedLeverage[i]);
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.getCreatedLeverage[i].hash
            );
            hashes.push({
              hash: this.getCreatedLeverage[i].hash,
              // date: this.hashes[this.suitAddress][i].date,
            });
            let decodeData;
            let leverageOrder = {
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
                  "0x6c44d5a5ba42c65c62519356afee52a821e2f1e1bdd2d825a769f11f060c3dda"
                ) {
                  try {
                    decodeData = await web3.eth.abi.decodeParameters(
                      [
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
                    leverageOrder.user = decodeData[0];
                    leverageOrder.maxLoss = decodeData[1];
                    leverageOrder.priceChangePart = decodeData[2];
                    leverageOrder.cross = decodeData[3];
                    leverageOrder.ownAmount = decodeData[4];
                    leverageOrder.orderAmount = decodeData[5];
                    leverageOrder.isWhite = decodeData[6];
                    leverageOrder.eventId = decodeData[7];
                    leverageOrder.timeStamp =
                      this.getCreatedLeverage[i].timeStamp;
                    leverageOrder.hash = this.getCreatedLeverage[i].hash;

                    console.log(leverageOrder);
                    this.ordersArray.push(leverageOrder);
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
            }
          }
        }
        sessionStorage.createdLeverageContractResult = JSON.stringify(
          this.ordersArray
        );
        sessionStorage.createdLeverageHashes = JSON.stringify(hashes);
      } else {
        this.ordersArray = JSON.parse(this.getTransData);
      }
      this.renderComponent = false;
      this.loading = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
      this.leverageLoader = true;
      this.isLeverageLoad = false
    },
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
  &-content{
    background: #1c1c25;
    padding: 20px;
    border-radius: 20px;
    margin-top: 20px;
  }
  &-text {
    color: white;
    font-weight: 600;
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
</style>
