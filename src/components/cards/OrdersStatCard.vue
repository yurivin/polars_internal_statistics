<template>
  <div>
    <div
      v-if="((!loading && !loadingEvents) || (custom && !calc)) && collateralContract"
      class="menu-list"
    >
      <div class="row menu-list-title">
        <span class="col-6">TOKEN</span>
        <span class="col-6">AMOUNT </span>
      </div>
      <div class="menu-list-body">
        <div
          v-for="item in (!calc && custom) || !isOrderContract
            ? emptyTrading
            : sumArray"
          :key="item.name"
          class="row menu-list-body-list"
        >
          <span class="col-6"
            >{{ item.name }}
            {{ item.name === "TOTAL AMOUNT" ? collateralContract[collateralAddress].symbol : "" }}</span
          >
          <span class="col-6">{{ item.amount ? item.amount : 0 }}</span>
        </div>
      </div>
    </div>
    <div v-else class="menu-list">
      <div class="countdown">{{ countDown }}</div>
      <div class="loader">
        <img src="@/assets/images/loader.svg" alt="Loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkAndInstantiateWeb3 } from "@/util/web3";

export default {
  name: "TradingStatisticCard",
  props: {
    coefficient: Number,
    allHashes: Array,
    startEventAllHashes: Array,
    sinceDate: String,
    forDate: String,
    load: Boolean,
    custom: Boolean,
    calc: Boolean,
    tabName: String,
    collateralAddress: String,
  },
  data() {
    return {
      ordersArray: {},
      hashes: {},
      startEventHashes: {},
      countDown: "",
      loading: false,
      sumArray: [],
      count: 0,
      loadingEvents: false,
      arr: [],
      emptyTrading: [
        { name: "TOTAL AMOUNT", amount: 0 },
        { name: "ORDERS", amount: 0 },
        { name: "USERS", amount: 0 },
      ],
      periodHashes: [],
      periodEventHashes: [],
      isOrderContract: true,
    };
  },
  asyncComputed: {},
  computed: {
    ...mapGetters({
      collateralContract: 'getCollateralContract'
    }),
    collateralToken() {
      return sessionStorage.colleteralName;
    },
    getTransData() {
      return sessionStorage.transactionOrders;
    },
    getHashesArray() {
      return sessionStorage.transactionHashOrders;
    },
    getEventStartTransData() {
      return sessionStorage.eventStartTransactions;
    },
    getEventStartHashesArray() {
      return sessionStorage.eventStartTransactionHash;
    },
    suitAddress() {
      return this.$route.path.split("/")[
        this.$route.path.split("/").length - 1
      ];
    },
  },
  created() {
    this.countDownTimer();
  },
  async mounted() {
    await this.getAmountTokensInEvents();
    await this.getValueOrdersTransaction();
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
    containsOrders(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].orderId === elem.orderId) {
          return true;
        }
      }
      return false;
    },
    containsEvents(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].eventId === elem.eventId) {
          return true;
        }
      }
      return false;
    },
    async getAmountTokensInEvents() {
      if (this.collateralContract[this.collateralAddress]) {
        this.loadingEvents = true;
        this.periodHashes = this.allHashes.concat(
                this.startEventAllHashes
        ).length;
        const web3 = await checkAndInstantiateWeb3();
        this.eventStartArray = this.getEventStartTransData
                ? JSON.parse(this.getEventStartTransData)
                : {[this.suitAddress]: []};
        this.startEventHashes[this.suitAddress] = this.startEventAllHashes;
        let hashesEventStart = this.getEventStartHashesArray
                ? JSON.parse(this.getEventStartHashesArray)
                : {[this.suitAddress]: []};
        if (!hashesEventStart[this.suitAddress]) {
          hashesEventStart[this.suitAddress] = [];
        }
        if (!this.eventStartArray[this.suitAddress]) {
          this.eventStartArray[this.suitAddress] = [];
        }
        if (
                !this.getEventStartHashesArray ||
                !hashesEventStart[this.suitAddress].length
        ) {
          if (
                  !this.getEventStartTransData ||
                  !this.eventStartArray[this.suitAddress].length
          ) {
            let arrayEventStart = [];
            // let canceledArrayOrder = []
            // let idArray = []

            for (
                    let i = 0;
                    i < this.startEventHashes[this.suitAddress].length;
                    i++
            ) {
              let priceObj;
              const dataTransaction = await web3.eth.getTransactionReceipt(
                      this.startEventHashes[this.suitAddress][i].hash
              );
              hashesEventStart[this.suitAddress].push({
                hash: this.startEventHashes[this.suitAddress][i].hash,
                date: this.startEventHashes[this.suitAddress][i].date,
              });
              let amount = 0;
              let eventId;
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                          dataTransaction.logs[j].topics[0] ===
                          "0x89f2ce8dd7207e3201abd43d87d97a266345d1473e3706112c72a0108584b32e"
                  ) {
                    const decodeData = await web3.eth.abi.decodeParameters(
                            ["uint256", "uint256"],
                            dataTransaction.logs[j].data
                    )[1];
                    eventId = decodeData;
                  }
                  if (
                          dataTransaction.logs[j].topics[0] ===
                          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
                          dataTransaction.logs[j].topics[1] !==
                          "0x0000000000000000000000000000000000000000000000000000000000000000"
                  ) {
                    const decodeData = await web3.eth.abi.decodeParameters(
                            ["uint256"],
                            dataTransaction.logs[j].data
                    )[0];
                    amount += +decodeData;
                  }
                }
              }
              priceObj = {
                amount: amount / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                date: this.startEventHashes[this.suitAddress][i].date,
                eventId: eventId,
              };

              this.eventStartArray[this.suitAddress].push(priceObj);

              // if (!canceledArrayOrder.length || !canceledArrayOrder.find(item => item === decodeDataCancel)) {
              //   this.eventStartArray[this.predictionPoolAddress].push(priceObj)
              //   canceledArrayOrder.push(decodeDataCancel)
              // }
              this.count += 1;
            }
            arrayEventStart = this.eventStartArray[this.suitAddress].filter(
                    (item) =>
                            new Date(item.date).getTime() >=
                            new Date(this.sinceDate).getTime() &&
                            new Date(item.date).getTime() <= new Date(this.forDate).getTime()
            );
            let x = 0;
            let sum = arrayEventStart.map((i) => (x += i.amount), x).reverse()[0];
            const objAmount = {name: "TOTAL AMOUNT", amount: 0};
            objAmount.amount = sum;
            this.sumArray.push(objAmount);

            sessionStorage.eventStartTransactions = JSON.stringify(
                    this.eventStartArray
            );
            sessionStorage.eventStartTransactionHash =
                    JSON.stringify(hashesEventStart);
          } else {
            if (this.custom) {
              this.eventStartArray[this.suitAddress] = [];
            } else {
              this.eventStartArray[this.suitAddress] = JSON.parse(
                      this.getEventStartTransData
              )[this.suitAddress];
            }
          }
        } else if (
                this.getEventStartHashesArray &&
                this.getEventStartHashesArray !==
                JSON.stringify(this.startEventHashes[this.suitAddress])
        ) {
          let arrayEventStart = [];

          this.eventStartArray[this.suitAddress] = this.getEventStartTransData
                  ? JSON.parse(this.getEventStartTransData)[this.suitAddress]
                  : this.eventStartArray[this.suitAddress];
          let arr = [];
          for (
                  let i = 0;
                  i < this.startEventHashes[this.suitAddress].length;
                  i++
          ) {
            arr.push(
                    this.containsObj(
                            JSON.parse(this.getEventStartHashesArray)[this.suitAddress],
                            this.startEventHashes[this.suitAddress][i]
                    )
            );
          }
          arr = arr.filter((item) => item !== true);

          this.periodHashes =
                  arr.length +
                  this.allHashes.length -
                  (this.getTransData
                          ? JSON.parse(this.getTransData)[this.suitAddress].length
                          : 0);
          hashesEventStart[this.suitAddress] = JSON.parse(
                  this.getEventStartHashesArray
          )[this.suitAddress];
          this.eventStartArray[this.suitAddress] = JSON.parse(
                  this.getEventStartTransData
          )[this.suitAddress];
          for (
                  let i = 0;
                  i < this.startEventHashes[this.suitAddress].length;
                  i++
          ) {
            if (
                    !this.contains(
                            JSON.parse(this.getEventStartHashesArray)[this.suitAddress],
                            this.startEventHashes[this.suitAddress][i]
                    )
            ) {
              this.count += 1;
              let priceObj;
              // let priceCanceled
              const dataTransaction = await web3.eth.getTransactionReceipt(
                      this.startEventHashes[this.suitAddress][i].hash
              );
              hashesEventStart[this.suitAddress].push({
                hash: this.startEventHashes[this.suitAddress][i].hash,
                date: this.startEventHashes[this.suitAddress][i].date,
              });
              let amount = 0;
              let eventId;
              if (dataTransaction) {
                for (let j = 0; j < dataTransaction.logs.length; j++) {
                  if (
                          dataTransaction.logs[j].topics[0] ===
                          "0x89f2ce8dd7207e3201abd43d87d97a266345d1473e3706112c72a0108584b32e"
                  ) {
                    const decodeData = await web3.eth.abi.decodeParameters(
                            ["uint256", "uint256"],
                            dataTransaction.logs[j].data
                    )[1];
                    eventId = decodeData;
                  }
                  if (
                          dataTransaction.logs[j].topics[0] ===
                          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
                          dataTransaction.logs[j].topics[1] !==
                          "0x0000000000000000000000000000000000000000000000000000000000000000"
                  ) {
                    const decodeData = await web3.eth.abi.decodeParameters(
                            ["uint256"],
                            dataTransaction.logs[j].data
                    )[0];
                    amount += +decodeData;
                  }
                }
              }
              priceObj = {
                amount: amount / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                date: this.startEventHashes[this.suitAddress][i].date,
                eventId: eventId,
              };
              this.eventStartArray[this.suitAddress].push(priceObj);
            }
          }
          arrayEventStart = this.eventStartArray[this.suitAddress].filter(
                  (item) =>
                          new Date(item.date).getTime() >=
                          new Date(this.sinceDate).getTime() &&
                          new Date(item.date).getTime() <= new Date(this.forDate).getTime()
          );
          let x = 0;
          let sum = arrayEventStart.map((i) => (x += i.amount), x).reverse()[0];
          const objAmount = {name: "TOTAL AMOUNT", amount: 0};
          objAmount.amount = sum;
          this.sumArray.push(objAmount);
          sessionStorage.eventStartTransactions = JSON.stringify(
                  this.eventStartArray
          );
          sessionStorage.eventStartTransactionHash =
                  JSON.stringify(hashesEventStart);
        } else {
          this.eventStartArray[this.suitAddress] = JSON.parse(
                  this.getEventStartTransData
          )[this.suitAddress];
        }
        this.loadingEvents = false;
      } else {
        this.$notify.error({
          title: 'Error',
          message: 'RPC Error',
          maxWidth: 400,
        })
      }
    },
    async getValueOrdersTransaction() {
      const web3 = await checkAndInstantiateWeb3();

      this.periodEventHashes = this.allHashes;
      this.ordersArray = this.getTransData
        ? JSON.parse(this.getTransData)
        : { [this.suitAddress]: [] };

      this.loading = true;
      this.hashes[this.suitAddress] = this.allHashes;

      let hashes = this.getHashesArray
        ? JSON.parse(this.getHashesArray)
        : { [this.suitAddress]: [] };
      if (!hashes[this.suitAddress]) {
        hashes[this.suitAddress] = [];
      }

      if (!this.ordersArray[this.suitAddress]) {
        this.ordersArray[this.suitAddress] = [];
      }
      if (!this.getHashesArray || !hashes[this.suitAddress].length) {
        if (!this.getTransData || !this.ordersArray[this.suitAddress].length) {
          let arrayOrder = [];
          // let canceledArrayOrder = []
          for (let i = 0; i < this.hashes[this.suitAddress].length; i++) {
            let priceObj;
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.hashes[this.suitAddress][i].hash
            );
            hashes[this.suitAddress].push({
              hash: this.hashes[this.suitAddress][i].hash,
              date: this.hashes[this.suitAddress][i].date,
            });
            let decodeData;
            let decodeDataId;
            if (dataTransaction) {
              for (let j = 0; j < dataTransaction.logs.length; j++) {
                if (
                  dataTransaction.logs[j].topics[0] ===
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ) {
                  try {
                    decodeData = await web3.eth.abi.decodeParameters(
                      ["uint256"],
                      dataTransaction.logs[j].data
                    )[0];
                  } catch (e) {
                    console.log(e);
                  }
                }
                if (
                  dataTransaction.logs[j].topics[0] ===
                  "0x28eb86fd03c9bd96a8a83e4a46ab2ad257b70cea893d98ad6d482e96aa25fad0"
                ) {
                  try {
                    decodeDataId = await web3.eth.abi.decodeParameters(
                      ["uint256", "address", "uint256"],
                      dataTransaction.logs[j].data
                    )[0];
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
              if (this.hashes[this.suitAddress][i].methodId === "0xe44b2892") {
                let decodeDataIdEvent;
                try {
                  decodeDataIdEvent = await web3.eth.abi.decodeParameters(
                    ["uint256", "bool", "uint256"],
                    this.hashes[this.suitAddress][i].inputData.substr(10)
                  )[2];
                } catch (e) {
                  console.log(e);
                }
                priceObj = {
                  amount: decodeData / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                  wallet: dataTransaction.from,
                  date: this.hashes[this.suitAddress][i].date,
                  isCanceled: false,
                  eventId: decodeDataIdEvent,
                  orderId: decodeDataId,
                };

                this.ordersArray[this.suitAddress].push(priceObj);
              } else if (
                this.hashes[this.suitAddress][i].methodId === "0x514fcac7"
              ) {
                // const decodeDataCancel = await web3.eth.abi.decodeParameters(
                //   ['uint256'],
                //   dataTransaction.logs[1].data
                // )[0]
                let decodeDataId;
                try {
                  decodeDataId = await web3.eth.abi.decodeParameters(
                    ["uint256", "address"],
                    dataTransaction.logs[1].data
                  )[0];
                } catch (e) {
                  console.log(e);
                }
                priceObj = {
                  amount: decodeData / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                  wallet: dataTransaction.from,
                  date: this.hashes[this.suitAddress][i].date,
                  isCanceled: true,
                  orderId: decodeDataId,
                };
                this.ordersArray[this.suitAddress].push(priceObj);
              }

              // if (!canceledArrayOrder.length || !canceledArrayOrder.find(item => item === decodeDataCancel)) {
              //   this.ordersArray[this.predictionPoolAddress].push(priceObj)
              //   canceledArrayOrder.push(decodeDataCancel)
              // }
            }
            this.count += 1;
          }

          arrayOrder = this.ordersArray[this.suitAddress].filter(
            (item) =>
              new Date(item.date).getTime() >=
                new Date(this.sinceDate).getTime() &&
              new Date(item.date).getTime() <= new Date(this.forDate).getTime()
          );
          let canceledOrders = arrayOrder.filter(
            (item) => item.isCanceled === true
          );
          arrayOrder = arrayOrder.filter((item) => item.isCanceled === false);
          let eventFilter = [];
          for (let i = 0; i < arrayOrder.length; i++) {
            if (
              this.containsEvents(
                this.eventStartArray[this.suitAddress],
                arrayOrder[i]
              )
            ) {
              eventFilter.push(arrayOrder[i]);
            }
          }
          for (let i = 0; i < canceledOrders.length; i++) {
            if (this.containsOrders(eventFilter, canceledOrders[i])) {
              eventFilter = eventFilter.filter(
                (item) => item.orderId !== canceledOrders[i].orderId
              );
            }
          }
          let walletsArray = [];
          for (let i = 0; i < eventFilter.length; i++) {
            walletsArray.push(eventFilter[i].wallet);
          }
          let amountWallets = Array.from(new Set(walletsArray)).length;
          const objOrders = { name: "ORDERS", amount: 0 };
          const objUsers = { name: "USERS", amount: 0 };
          objOrders.amount = eventFilter.length;
          objUsers.amount = amountWallets;
          this.sumArray.push(objOrders, objUsers);

          sessionStorage.transactionOrders = JSON.stringify(this.ordersArray);
          sessionStorage.transactionHashOrders = JSON.stringify(hashes);
        } else {
          if (this.custom) {
            this.ordersArray[this.suitAddress] = [];
          } else {
            this.ordersArray[this.suitAddress] = JSON.parse(this.getTransData)[
              this.suitAddress
            ];
          }
        }
      } else if (
        this.getHashesArray &&
        this.getHashesArray !== JSON.stringify(this.hashes[this.suitAddress])
      ) {
        let arrayOrder = [];

        this.ordersArray[this.suitAddress] = this.getTransData
          ? JSON.parse(this.getTransData)[this.suitAddress]
          : this.ordersArray[this.suitAddress];
        let arr = [];
        for (let i = 0; i < this.hashes[this.suitAddress].length; i++) {
          arr.push(
            this.containsObj(
              JSON.parse(this.getHashesArray)[this.suitAddress],
              this.hashes[this.suitAddress][i]
            )
          );
        }
        arr = arr.filter((item) => item !== true);
        this.periodHashes = arr.length;
        this.count = 0;
        hashes[this.suitAddress] = JSON.parse(this.getHashesArray)[
          this.suitAddress
        ];
        this.ordersArray[this.suitAddress] = JSON.parse(this.getTransData)[
          this.suitAddress
        ];
        for (let i = 0; i < this.hashes[this.suitAddress].length; i++) {
          if (
            !this.contains(
              JSON.parse(this.getHashesArray)[this.suitAddress],
              this.hashes[this.suitAddress][i]
            )
          ) {
            hashes[this.suitAddress].push(this.hashes[this.suitAddress][i]);
            this.count += 1;
            let priceObj;
            // let priceCanceled
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.hashes[this.suitAddress][i].hash
            );
            hashes[this.suitAddress].push({
              hash: this.hashes[this.suitAddress][i].hash,
              date: this.hashes[this.suitAddress][i].date,
            });
            let decodeData;
            let decodeDataId;
            if (dataTransaction) {
              for (let j = 0; j < dataTransaction.logs.length; j++) {
                if (
                  dataTransaction.logs[j].topics[0] ===
                  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ) {
                  try {
                    decodeData = await web3.eth.abi.decodeParameters(
                      ["uint256"],
                      dataTransaction.logs[j].data
                    )[0];
                  } catch (e) {
                    console.log(e);
                  }
                }
                if (
                  dataTransaction.logs[j].topics[0] ===
                  "0x28eb86fd03c9bd96a8a83e4a46ab2ad257b70cea893d98ad6d482e96aa25fad0"
                ) {
                  try {
                    decodeDataId = await web3.eth.abi.decodeParameters(
                      ["uint256", "address", "uint256"],
                      dataTransaction.logs[j].data
                    )[0];
                  } catch (e) {
                    console.log(e);
                  }
                }
              }
              let decodeDataIdEvent;
              try {
                if (
                  this.hashes[this.suitAddress][i].methodId === "0xe44b2892"
                ) {
                  decodeDataIdEvent = await web3.eth.abi.decodeParameters(
                    ["uint256", "bool", "uint256"],
                    this.hashes[this.suitAddress][i].inputData.substr(10)
                  )[2];
                }
              } catch (e) {
                console.log(e);
              }
              priceObj = {
                amount: decodeData / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                wallet: dataTransaction.from,
                date: this.hashes[this.suitAddress][i].date,
                isCanceled: false,
                orderId: decodeDataId,
                eventId: decodeDataIdEvent,
              };
              this.ordersArray[this.suitAddress].push(priceObj);
            } else if (
              this.hashes[this.suitAddress][i].methodId === "0x514fcac7"
            ) {
              let decodeDataId;
              try {
                decodeDataId = await web3.eth.abi.decodeParameters(
                  ["uint256", "address"],
                  dataTransaction.logs[1].data
                )[0];
              } catch (e) {
                console.log(e);
              }
              priceObj = {
                amount: decodeData / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                wallet: dataTransaction.from,
                date: this.hashes[this.suitAddress][i].date,
                isCanceled: true,
                orderId: decodeDataId,
              };
              this.ordersArray[this.suitAddress].push(priceObj);
            }
          }
        }
        arrayOrder = this.ordersArray[this.suitAddress].filter(
          (item) =>
            new Date(item.date).getTime() >=
              new Date(this.sinceDate).getTime() &&
            new Date(item.date).getTime() <= new Date(this.forDate).getTime()
        );
        let canceledOrders = arrayOrder.filter(
          (item) => item.isCanceled === true
        );
        arrayOrder = arrayOrder.filter((item) => item.isCanceled === false);
        let eventFilter = [];
        for (let i = 0; i < arrayOrder.length; i++) {
          if (
            this.containsEvents(
              this.eventStartArray[this.suitAddress],
              arrayOrder[i]
            )
          ) {
            eventFilter.push(arrayOrder[i]);
          }
        }
        for (let i = 0; i < canceledOrders.length; i++) {
          if (this.containsOrders(eventFilter, canceledOrders[i])) {
            eventFilter = eventFilter.filter(
              (item) => item.orderId !== canceledOrders[i].orderId
            );
          }
        }
        let walletsArray = [];
        for (let i = 0; i < eventFilter.length; i++) {
          walletsArray.push(eventFilter[i].wallet);
        }
        let amountWallets = Array.from(new Set(walletsArray)).length;
        const objOrders = { name: "ORDERS", amount: 0 };
        const objUsers = { name: "USERS", amount: 0 };
        objOrders.amount = eventFilter.length;
        objUsers.amount = amountWallets;
        this.sumArray.push(objOrders, objUsers);
        sessionStorage.transactionOrders = JSON.stringify(this.ordersArray);
        sessionStorage.transactionHashOrders = JSON.stringify(hashes);
      } else {
        this.ordersArray[this.suitAddress] = JSON.parse(this.getTransData)[
          this.suitAddress
        ];
      }
      this.renderComponent = false;
      this.loading = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    countDownTimer() {
      if (this.countDown >= 0) {
        setTimeout(() => {
          this.countDown = Math.floor((this.periodHashes - this.count) / 5);
          this.countDownTimer();
        }, 500);
      }
    },
  },
  beforeDestroy() {
    this.countDown = -1;
  },
};
</script>

<style lang="scss" scoped>
.menu-list {
  position: relative;
  padding: 15px 7px 9px 9px;
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
  }
}

.date {
  font-size: 12px;
  color: var(--theme-text);
}

.menu-list-body {
  padding-top: 25px;
  background: #2b2b37;
  border-radius: 30px;
}

.menu-list-body-list {
  padding-bottom: 20px;
  font-style: normal;
  font-weight: normal;
  line-height: 92.3%;
  color: white;
  font-size: 12px;
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
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  font-size: 20px;
}
.popover_chart {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-bottom: -25px;
  @media (max-width: 600px) {
    margin-bottom: -20px;
  }
}
</style>
