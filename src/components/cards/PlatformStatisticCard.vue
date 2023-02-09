<template>
  <div v-if="renderComponent">
    <div v-if="!loading && allHashes.length < 2" class="chart-text">
      NO EVENTS IN THIS PERIOD
    </div>
    <LineChartComponent
      v-if="!loading || (custom && !calc)"
      :arr="
        eventEndArray[suitAddress]
          ? eventEndArray[suitAddress]
          : []
      "
    />
    <div v-else class="menu-list">
      <div class="countdown">{{ countDown }}</div>
      <div class="loader">
        <img src="@/assets/images/loader.svg" alt="Loading" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChartComponent from '@/components/charts/LineChartComponent'
import { checkAndInstantiateWeb3 } from '@/util/web3'

export default {
  name: 'TradingStatisticCard',
  components: { LineChartComponent },
  props: {
    allHashes: Array,
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
      countDown: '',
      eventEndArray: {},
      hashes: {},
      loading: false,
      count: 0,
      renderComponent: true,
      periodHashes: [],
    }
  },
  computed: {
    ...mapGetters({
      collateralContract: 'getCollateralContract'

    }),
    collateralToken() {
      return sessionStorage.colleteralName
    },
    getTransData() {
      return sessionStorage.customData
    },
    getHashesArray() {
      return sessionStorage.hashesCustom
    },
    suitAddress() {
      return this.$route.path.split("/")[
      this.$route.path.split("/").length - 1
              ];
    },
  },
  created() {
    this.countDownTimer()
  },
  mounted() {
    this.getEventEndTransaction()
  },
  methods: {
    contains(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hash === elem.hash) {
          return true
        }
      }
      return false
    },
    containsObj(arr, elem) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].hash === elem.hash) {
          return true
        }
      }
      return elem
    },
    countDownTimer() {
      if (this.countDown >= 0) {
        setTimeout(() => {
          this.countDown = Math.floor(
            (this.periodHashes.length - this.count) / 5
          )
          this.countDownTimer()
        }, 500)
      }
    },
    async getEventEndTransaction() {
      let arrayEvent = []
      this.periodHashes = this.allHashes
      this.eventEndArray = this.getTransData
        ? JSON.parse(this.getTransData)
        : { [this.suitAddress]: [] }
      const web3 = await checkAndInstantiateWeb3()
      this.loading = true
      this.hashes[this.suitAddress] = this.allHashes
      let hashes = this.getHashesArray
        ? JSON.parse(this.getHashesArray)
        : { [this.suitAddress]: [] }
      if (!hashes[this.suitAddress]) {
        hashes[this.suitAddress] = []
      }
      if (!this.eventEndArray[this.suitAddress]) {
        this.eventEndArray[this.suitAddress] = []
      }
      if (!this.getHashesArray || !hashes[this.suitAddress].length) {
        if (
          !this.getTransData ||
          !this.eventEndArray[this.suitAddress].length
        ) {
          for (
            let i = 0;
            i < this.hashes[this.suitAddress].length;
            i++
          ) {
            let priceObj
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.hashes[this.suitAddress][i].hash
            )
            hashes[this.suitAddress].push({
              hash: this.hashes[this.suitAddress][i].hash,
              date: this.hashes[this.suitAddress][i].date,
            })
            let decodeTotalPrice
            for (let j = 0; j < dataTransaction.logs.length; j++) {
              if (
                dataTransaction.logs[j].topics[0] ===
                '0x414abacbc2b88d315e7f44e0b1498f61b18c51906c5ba4f0e8afe4c12cef9cdd'
              ) {
                decodeTotalPrice = await web3.eth.abi.decodeParameters(
                  ['uint256'],
                  dataTransaction.logs[j].data
                )[0]
              }
            }
            if (decodeTotalPrice) {
              priceObj = {
                price: decodeTotalPrice / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                date: this.hashes[this.suitAddress][i].date,
              }
              arrayEvent.push(priceObj)
            }
            // if (dataTransaction.logs.length >= 26) {
            //   const decodeTotalPrice = await web3.eth.abi.decodeParameters(
            //     ['uint256'],
            //     dataTransaction.logs[24].data
            //   )[0]
            //   priceObj = {
            //     price: decodeTotalPrice / Math.pow(10, this.collateralContract.decimals),
            //     date: this.hashes[this.suitAddress][i].date,
            //   }
            //   arrayEvent.push(priceObj)
            // }
            this.count += 1
          }
          this.eventEndArray[this.suitAddress] = arrayEvent
          sessionStorage.customData = JSON.stringify(this.eventEndArray)
          sessionStorage.hashesCustom = JSON.stringify(hashes)
          // }
        } else {
          if (this.custom) {
            this.eventEndArray[this.suitAddress] = []
          } else {
            this.eventEndArray[this.suitAddress] = JSON.parse(
              this.getTransData
            )[this.suitAddress]
            this.eventEndArray[this.suitAddress] = this.eventEndArray[
              this.suitAddress
            ].sort((a, b) => new Date(b.date) - new Date(a.date))
          }
        }
      } else if (
        this.getHashesArray &&
        this.getHashesArray !==
          JSON.stringify(this.hashes[this.suitAddress])
      ) {
        this.eventEndArray[this.suitAddress] = this.getTransData
          ? JSON.parse(this.getTransData)[this.suitAddress]
          : this.eventEndArray[this.suitAddress]
        this.eventEndArray[this.suitAddress] = this.eventEndArray[
          this.suitAddress
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
        let arr = []
        for (
          let i = 0;
          i < this.hashes[this.suitAddress].length;
          i++
        ) {
          arr.push(
            this.containsObj(
              JSON.parse(this.getHashesArray)[this.suitAddress],
              this.hashes[this.suitAddress][i]
            )
          )
        }
        arr = arr.filter((item) => item !== true)
        this.periodHashes = arr
        hashes[this.suitAddress] = JSON.parse(this.getHashesArray)[
          this.suitAddress
        ]
        this.eventEndArray[this.suitAddress] = JSON.parse(
          this.getTransData
        )[this.suitAddress]
        for (
          let i = 0;
          i < this.hashes[this.suitAddress].length;
          i++
        ) {
          if (
            !this.contains(
              JSON.parse(this.getHashesArray)[this.suitAddress],
              this.hashes[this.suitAddress][i]
            )
          ) {
            hashes[this.suitAddress].push(
              this.hashes[this.suitAddress][i]
            )
            this.count += 1
            let priceObj
            const dataTransaction = await web3.eth.getTransactionReceipt(
              this.hashes[this.suitAddress][i].hash
            )
            let decodeTotalPrice
            for (let j = 0; j < dataTransaction.logs.length; j++) {
              if (
                dataTransaction.logs[j].topics[0] ===
                '0x414abacbc2b88d315e7f44e0b1498f61b18c51906c5ba4f0e8afe4c12cef9cdd'
              ) {
                decodeTotalPrice = await web3.eth.abi.decodeParameters(
                  ['uint256'],
                  dataTransaction.logs[j].data
                )[0]
              }
            }
            if (decodeTotalPrice) {
              priceObj = {
                price: decodeTotalPrice / Math.pow(10, this.collateralContract[this.collateralAddress].decimals),
                date: this.hashes[this.suitAddress][i].date,
              }
              this.eventEndArray[this.suitAddress].push(priceObj)
            }
          }
        }
        this.eventEndArray[this.suitAddress] = this.eventEndArray[
          this.suitAddress
        ].sort((a, b) => new Date(b.date) - new Date(a.date))
        sessionStorage.customData = JSON.stringify(this.eventEndArray)
        sessionStorage.hashesCustom = JSON.stringify(hashes)
        this.eventEndArray[this.suitAddress] = this.eventEndArray[
          this.suitAddress
        ].filter(
          (item) =>
            new Date(item.date).getTime() >=
              new Date(this.sinceDate).getTime() &&
            new Date(item.date).getTime() <= new Date(this.forDate).getTime()
        )
      } else {
        this.eventEndArray[this.suitAddress] = JSON.parse(
          this.getTransData
        )[this.suitAddress]
      }
      this.renderComponent = false
      this.loading = false
      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
  },
  beforeDestroy() {
    this.countDown = -1
  },
}
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
  color: white;
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
.chart-text {
  position: absolute;
  color: white;
  z-index: 1;
  transform: rotate(45deg);
  font-size: 40px;
  max-width: 300px;
  max-height: 300px;
  top: 45%;
  left: 30%;
  opacity: 0.5;
  @media (max-width: 425px) {
    font-size: 25px;
    max-width: 200px;
    max-height: 200px;
    top: 50%;
    left: 30%;
  }
}
</style>
