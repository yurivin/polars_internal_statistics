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
        <div v-if="storeLoader" class="row menu-list-body">
          <span class="col-4"> {{lastMonthSuits.length}}</span>
          <span class="col-4"> {{lastThreeMonthSuits.length}} </span>
          <span class="col-4"> {{lastYearSuits.length}} </span>

        </div>
        <div v-else class="loader">
          <img src="../assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
  name: "suit-statistic",
  data() {
    return {
      isLoading: true,
      lastMonthSuits: [],
      lastThreeMonthSuits: [],
      lastYearSuits: [],
    };
  },
  computed:{
    ...mapGetters({
      createdSuits: 'getSuits',
      storeLoader: 'getLoader'
    }),
  },
    watch: {
      storeLoader(){
        this.getSuits()
      }
    },
    methods: {
      async getSuits(){
        this.isLoading = true
        await this.$store.dispatch('getCreatedSuits')
        let currentTime = new Date().getTime()
        const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000
        const lastThreeMonthDate = new Date().getTime() - 92 * 24 * 3600 * 1000
        const lastYearDate = new Date().getTime() - 365 * 24 * 3600 * 1000
        for (let i = 0; i < this.createdSuits.length; i++) {
          const date = this.createdSuits[i].timeStamp * 1000
          const transactionDate = new Date(date).getTime()
          if (transactionDate <= currentTime && transactionDate >= lastMonthDate){
            this.lastMonthSuits.push(this.createdSuits[i])
          }
          if (transactionDate <= currentTime && transactionDate >= lastThreeMonthDate){
            this.lastThreeMonthSuits.push(this.createdSuits[i])
          }
          if (transactionDate <= currentTime && transactionDate >= lastYearDate){
            this.lastYearSuits.push(this.createdSuits[i])
          }
        }
        this.isLoading = false
      }
    },
  mounted(){
    this.getSuits()
  }
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
  filter: invert(0%) sepia(0%) saturate(7486%) hue-rotate(179deg) brightness(111%) contrast(100%);
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
