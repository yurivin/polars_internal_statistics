<template>
  <div>
    <div class="event-list">
      <!--            <ActionSelector-->
      <!--              class="selector"-->
      <!--              :text="[-->
      <!--                {-->
      <!--                  title: `User Statistic`,-->
      <!--                  path: '/statistic/client',-->
      <!--                },-->
      <!--                {-->
      <!--                  title: 'Platform Statistic',-->
      <!--                  path: '/statistic/platform',-->
      <!--                },-->
      <!--              ]"-->
      <!--            />-->
      <ActionSelector
        class="selector"
        :text="[
          {
            title: 'Back to suits',
            path: '/suit-statistic',
          },
          {
            title: `W + B Price`,
            path: '/statistic/price/' + suitAddress,
          },
          {
            title: 'Orders',
            path: '/statistic/orders/' + suitAddress,
          },
        ]"
      />

      <div class="title">
        <div>PREDICTION POOL ORDERS STATISTIC</div>
      </div>
      <b-tabs v-if="hashLoad && renderComponent" class="col mt-4 date">
        <b-tab
          v-for="(item, i) in allHashes"
          :key="i"
          :title="item.name"
          :active="load && item.name === 'Custom'"
          :calc="calc"
          lazy
          @click="swapComponents()"
        >
          <div
            v-if="item.name === 'Custom'"
            class="d-flex justify-content-between dates_btn"
          >
            <div class="d-flex justify-content-between dates">
              <div class="text">From</div>
              <Datetime
                class="date"
                type="date"
                format="yyyy-MM-dd"
                placeholder="Start Time"
                @input="sinceDate = $event"
              />
              <div class="text">To</div>
              <Datetime
                class="date"
                type="date"
                format="yyyy-MM-dd"
                placeholder="End Time"
                @input="forDate = $event"
              />
            </div>

            <Button
              type="small"
              text="Calculate"
              class="btn"
              @click="addDate"
            />
          </div>
          <OrdersStatCard
            v-if="load && renderComponent && calc"
            :allHashes="hashesComputed"
            :startEventAllHashes="eventStartHashesComputed"
            :since-date="sinceDate"
            :for-date="forDate"
            :tab-name="item.name"
            :collateralAddress="contractsAddressesBySuitArray[suitAddress].collateralToken"
          />
          <OrdersStatCard
            v-show="loading && renderComponent"
            :allHashes="item.hashes"
            :startEventAllHashes="item.startEventHashes"
            :since-date="item.sinceDate"
            :for-date="item.forDate"
            :custom="item.name === 'Custom'"
            :tab-name="item.name"
            :collateralAddress="contractsAddressesBySuitArray[suitAddress].collateralToken"
          />
        </b-tab>
      </b-tabs>
      <div v-else class="loader">
        <img src="@/assets/images/loader.svg" alt="Loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BTab, BTabs } from "bootstrap-vue";
import { Datetime } from "vue-datetime";
import OrdersStatCard from "@/components/cards/OrdersStatCard";
import Button from "@/components/Button";
import ActionSelector from "@/components/tabs/ActionSelector";

export default {
  name: "Statistic",
  components: {
    Datetime,
    BTabs,
    BTab,
    OrdersStatCard,
    Button,
    ActionSelector,
  },
  layout: "default",
  data() {
    return {
      lastHashDate: Number,
      eventStartHashes: [],
      address: "",
      eventStartHashesLastDay: [],
      eventStartHashesLastWeek: [],
      eventStartHashesLastMonth: [],
      eventStartSinceForHashes: [],
      hashesLastDay: [],
      hashesLastWeek: [],
      hashesLastMonth: [],
      sinceForHashes: [],
      allHashes: [],
      load: false,
      loading: false,
      reqLoading: false,
      renderComponent: true,
      sinceDate: "",
      forDate: "",
      timeNow: new Date(),
      calc: false,
      hashLoad: false,
      contractsAddressesBySuitArray: localStorage.allSuitsContracts
        ? JSON.parse(localStorage.allSuitsContracts)
        : {},
      suitAddress:
        this.$route.path.split("/")[this.$route.path.split("/").length - 1],
    };
  },
  computed: {
    ...mapGetters({
      finalResultOrders: "getFinalResultOrders",
      finalResultEvents: "getFinalResultEvents",
    }),
    hashesComputed() {
      return this.sinceForHashes;
    },
    eventStartHashesComputed() {
      return this.eventStartSinceForHashes;
    },
    statWallet() {
      return sessionStorage.statWallet;
    },
  },
  async mounted() {
    let suitAddress =
      this.$route.path.split("/")[this.$route.path.split("/").length - 1];
    console.log(
      this.contractsAddressesBySuitArray[suitAddress].collateralToken
    );
    if (!localStorage.collateralToken || !JSON.parse(localStorage.collateralToken)[this.contractsAddressesBySuitArray[suitAddress].collateralToken]) {
      await this.$store.dispatch(
              "getCollateralContract",
              this.contractsAddressesBySuitArray[suitAddress].collateralToken
      );
    }
    await this.getHashesForOrders();
  },
  methods: {
    transformDate(date) {
      let newDate;
      if (date) {
        newDate = new Date(date);
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
    swapComponents() {
      this.load = false;
      this.loading = true;
    },
    countDownTimer() {
      if (this.countDown >= 0) {
        setTimeout(() => {
          this.countDown += 1;
          this.countDownTimer();
        }, 1000);
      }
    },

    async getHashesForOrders() {
      // if (this.ordersAddress && sessionStorage.ordersAddress) {
      //   console.log(
      //     +sessionStorage.ordersTimer + 120 * 1000,
      //     new Date().getTime(),
      //     !sessionStorage.transactionHashOrders
      //   );
      let suitAddress =
        this.$route.path.split("/")[this.$route.path.split("/").length - 1];
      let orderAddress =
        this.contractsAddressesBySuitArray[suitAddress].orderAddress;
      let eventAddress =
        this.contractsAddressesBySuitArray[suitAddress].eventAddress;

      this.hashesLastDay = [];
      this.hashesLastWeek = [];
      this.hashesLastMonth = [];
      this.eventStartHashesLastDay = [];
      this.eventStartHashesLastWeek = [];
      this.eventStartHashesLastMonth = [];
      this.allHashes = [];
      const nowDate = new Date().getTime();
      const lastDayDate = new Date().getTime() - 24 * 3600 * 1000;
      const lastWeekDate = new Date().getTime() - 7 * 24 * 3600 * 1000;
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;
      const lastDay = this.transformDate(lastDayDate);
      const lastWeek = this.transformDate(lastWeekDate);
      const lastMonth = this.transformDate(lastMonthDate);
      const thisDate = this.transformDate();

      const objMCustom = {
        name: "Custom",
        hashes: [],
        startEventHashes: [],
      };
      for (
        let i = 0;
        i < this.finalResultOrders[suitAddress][orderAddress].length;
        i++
      ) {
        const date =
          this.finalResultOrders[suitAddress][orderAddress][i].timeStamp * 1000;
        const transactionDate = new Date(date).getTime();
        const methodId =
          this.finalResultOrders[suitAddress][orderAddress][i].methodId;
        if (transactionDate <= nowDate && transactionDate >= lastDayDate) {
          this.hashesLastDay.push({
            hash: this.finalResultOrders[suitAddress][orderAddress][i].hash,
            date: this.transformDate(date),
            methodId: methodId,
            inputData:
              this.finalResultOrders[suitAddress][orderAddress][i].input,
          });
        }
        if (transactionDate <= nowDate && transactionDate >= lastWeekDate) {
          this.hashesLastWeek.push({
            hash: this.finalResultOrders[suitAddress][orderAddress][i].hash,
            date: this.transformDate(date),
            methodId: methodId,
            inputData:
              this.finalResultOrders[suitAddress][orderAddress][i].input,
          });
        }
        if (transactionDate <= nowDate && transactionDate >= lastMonthDate) {
          this.hashesLastMonth.push({
            hash: this.finalResultOrders[suitAddress][orderAddress][i].hash,
            date: this.transformDate(date),
            methodId: methodId,
            inputData:
              this.finalResultOrders[suitAddress][orderAddress][i].input,
          });
        }
      }
      for (
        let i = 0;
        i < this.finalResultEvents[suitAddress][eventAddress].length;
        i++
      ) {
        if (
                this.finalResultEvents[suitAddress][eventAddress][i].methodId === "0xe2fd38e9"
        ) {
          const date =
            this.finalResultEvents[suitAddress][eventAddress][i].timeStamp *
            1000;
          const transactionDate = new Date(date).getTime();
          const methodId =
            this.finalResultEvents[suitAddress][eventAddress][i].methodId;

          if (transactionDate <= nowDate && transactionDate >= lastDayDate) {
            this.eventStartHashesLastDay.push({
              hash: this.finalResultEvents[suitAddress][eventAddress][i].hash,
              date: this.transformDate(date),
              methodId: methodId,
            });
          }
          if (transactionDate <= nowDate && transactionDate >= lastWeekDate) {
            this.eventStartHashesLastWeek.push({
              hash: this.finalResultEvents[suitAddress][eventAddress][i].hash,
              date: this.transformDate(date),
              methodId: methodId,
            });
          }
          if (transactionDate <= nowDate && transactionDate >= lastMonthDate) {
            this.eventStartHashesLastMonth.push({
              hash: this.finalResultEvents[suitAddress][eventAddress][i].hash,
              date: this.transformDate(date),
              methodId: methodId,
            });
          }
        }
      }

      const objDay = {
        name: "Last day",
        hashes: this.hashesLastDay,
        startEventHashes: this.eventStartHashesLastDay,
        sinceDate: lastDay,
        forDate: thisDate,
      };
      const objWeek = {
        name: "Last week",
        hashes: this.hashesLastWeek,
        startEventHashes: this.eventStartHashesLastWeek,
        sinceDate: lastWeek,
        forDate: thisDate,
      };
      const objMonth = {
        name: "Last month",
        hashes: this.hashesLastMonth,
        startEventHashes: this.eventStartHashesLastMonth,
        sinceDate: lastMonth,
        forDate: thisDate,
      };

      this.allHashes.push(objDay, objWeek, objMonth, objMCustom);
      // } else {
      //   this.allHashes.push(
      //     { name: "Last day", hashes: [], startEventHashes: [] },
      //     { name: "Last week", hashes: [], startEventHashes: [] },
      //     { name: "Last month", hashes: [], startEventHashes: [] },
      //     { name: "Custom", hashes: [], startEventHashes: [] }
      //   );
      //   await this.$store.commit("events/setLoader", true);
      // }
      this.loading = true;
      this.reqLoading = true;
      this.hashLoad = true;
    },
    addDate() {
      let suitAddress =
        this.$route.path.split("/")[this.$route.path.split("/").length - 1];
      let orderAddress =
        this.contractsAddressesBySuitArray[suitAddress].orderAddress;
      let eventAddress =
        this.contractsAddressesBySuitArray[suitAddress].eventAddress;
      this.calc = true;
      this.sinceDate = this.sinceDate.substring(0, 10);
      this.forDate = this.forDate.substring(0, 10);
      if (
        this.sinceDate &&
        this.forDate &&
        new Date(this.sinceDate).getTime() <= new Date(this.forDate).getTime()
      ) {
        this.load = false;
        this.sinceForHashes = [];
        this.eventStartSinceForHashes = [];
        for (
          let i = 0;
          i < this.finalResultOrders[suitAddress][orderAddress].length;
          i++
        ) {
          const date =
            this.finalResultOrders[suitAddress][orderAddress][i].timeStamp *
            1000;
          const transactionDate = new Date(date).getTime();
          const sinceDate = new Date(this.sinceDate).getTime();
          const forDate = new Date(this.forDate).getTime();
          const methodId =
            this.finalResultOrders[suitAddress][orderAddress][i].methodId;
          if (transactionDate <= forDate && transactionDate >= sinceDate) {
            this.sinceForHashes.push({
              hash: this.finalResultOrders[suitAddress][orderAddress][i].hash,
              date: this.transformDate(date),
              methodId: methodId,
              inputData:
                this.finalResultOrders[suitAddress][orderAddress][i].input,
            });
          }
        }
        for (
          let i = 0;
          i < this.finalResultEvents[suitAddress][eventAddress].length;
          i++
        ) {
          const date =
            this.finalResultEvents[suitAddress][eventAddress][i].timeStamp *
            1000;
          const transactionDate = new Date(date).getTime();
          const sinceDate = new Date(this.sinceDate).getTime();
          const forDate = new Date(this.forDate).getTime();
          const methodId =
            this.finalResultEvents[suitAddress][eventAddress][i].methodId;
          if (transactionDate <= forDate && transactionDate >= sinceDate) {
            this.eventStartSinceForHashes.push({
              hash: this.finalResultEvents[suitAddress][eventAddress][i].hash,
              date: this.transformDate(date),
              methodId: methodId,
            });
          }
        }
        this.loading = false;
        // this.renderComponent = false
        this.calc = false;
        this.$nextTick(() => {
          // Add the component back in
          // this.renderComponent = true
          this.calc = true;
        });
        this.load = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  text-align: left;
  flex-direction: column;
  .hi {
    font-size: 26px;
    line-height: 92%;
    color: var(--theme-text);
  }

  .name {
    font-weight: 600;
    font-size: 42px;
    line-height: 92%;
    color: var(--theme-text);
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
.event-list {
  position: relative;
  z-index: 100;
  background: #2b2b37;
  max-width: 690px;
  width: 100%;
  overflow: visible;
  border-radius: 35px;
  margin: 37px auto 35px auto;
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
    color: #8c8c8c;
    margin-left: 20px;
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
  background: #1c1c25;
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
    color: #8c8c8c;
    margin-left: 10px;
    @media (max-width: 440px) {
      margin-left: 0;
    }
  }
}
.trade-top {
  max-width: 690px;
  padding: 20px 0 14px 10px;
  background: #2b2b37;
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
</style>
