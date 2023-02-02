<template>
  <div>
    <div class="event-list">
      <div class="menu-list">
        <div class="row menu-list-title">
          <span class="col-6">Suit Address </span>
          <div
            @click="orders1Month"
            :class="ordersOneMonth ? 'title-tab' : ''"
            class="col tab"
          >
            Orders made last month
          </div>
          <div
            @click="events1Month"
            :class="eventsOneMonth ? 'title-tab' : ''"
            class="col tab"
          >
            Events started last month
          </div>
          <div
            @click="orders3Month"
            :class="ordersThreeMonth ? 'title-tab' : ''"
            class="col tab"
          >
            Orders made last 3 month
          </div>
          <div
            @click="events3Month"
            :class="eventsThreeMonth ? 'title-tab' : ''"
            class="col tab"
          >
            Events started 3 month
          </div>
        </div>
        <div
          v-if="renderComponent && rows.length && contractItemObject"
          class="menu-list-body"
        >
          <SuitOrderItem
            v-for="(match, i) in rows"
            :key="i"
            :row="match"
            :itemObject="itemObject[match]"
            :eventItemObject="eventItemObject[match]"
            :contractOrder="contractItemObject[match].orderAddress"
            :contractEvent="contractItemObject[match].eventAddress"
          />
        </div>
        <div v-else class="list">
          <div class="no-data">Nothing to show</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuitOrderItem from "@/components/tableItems/suitOrderItem";
export default {
  name: "Table",
  components: { SuitOrderItem },
  props: {
    rows: Array,
    itemObject: Object,
    contractItemObject: Object,
    eventItemObject: Object,
  },
  data() {
    return {
      isLoading: false,
      selectedRowIndex: null,
      renderComponent: true,
      ordersOneMonth: false,
      eventsOneMonth: false,
      ordersThreeMonth: false,
      eventsThreeMonth: false,
    };
  },
  mounted() {
    console.log(this.ordersOneMonth)
  },
  // watch: {
  //   rows() {
  //     this.renderComponent = false;
  //     this.$nextTick(() => {
  //       // Add the component back in
  //       this.renderComponent = true;
  //     });
  //   },
  // },
  methods: {
    orders1Month() {
      this.ordersOneMonth = true;
      this.eventsOneMonth = false;
      this.ordersThreeMonth = false;
      this.eventsThreeMonth = false;
      this.$emit("sortByMonthOrder");
    },
    events1Month() {
      this.$emit("sortByMonthEvent");
      this.ordersOneMonth = false;
      this.eventsOneMonth = true;
      this.ordersThreeMonth = false;
      this.eventsThreeMonth = false;
    },
    orders3Month() {
      this.$emit("sortBy3MonthOrder");
      this.ordersOneMonth = false;
      this.eventsOneMonth = false;
      this.ordersThreeMonth = true;
      this.eventsThreeMonth = false;
    },
    events3Month() {
      this.$emit("sortBy3MonthEvent");
      this.ordersOneMonth = false;
      this.eventsOneMonth = false;
      this.ordersThreeMonth = false;
      this.eventsThreeMonth = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.title-tab {
  color: white !important;
}
.tab{
  cursor: pointer;
}
.tab:hover{
  color: white;
  opacity: 0.5;
}


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
  /*max-width: 890px;*/
  width: 90%;
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
  padding: 10px 25px 25px 25px;
  background: #1c1c25;
  border-radius: 30px;
  width: 100%;
  /*max-height: 497px;*/
  margin-top: 20px;
  height: auto;

  .menu-list-title {
    padding-bottom: 10px;
    font-style: normal;
    font-weight: normal;
    line-height: 92.3%;
    color: #5a5e66;
    font-size: 15px;
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
