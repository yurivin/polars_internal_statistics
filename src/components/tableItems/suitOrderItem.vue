<template>
  <div class="item">
    <div class="item_wrapper">
      <div class="col-6 volatility d-flex justify-content-between" style="padding-left: 30px">
        <div v-if="row">{{ row }}</div>
        <router-link style="text-decoration: none" :to="`/statistic/orders/${row}`"><Button text="Details" type="small"></Button></router-link>
      </div>
      <div class="col volatility">
        <div v-if="itemObject">{{ filteredByLastMonth.length }}</div>
        <div v-else class="loader">
          <img src="@/assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
      <div class="col volatility">
        <div v-if="eventItemObject">{{ filteredByLastMonthEvents.length }}</div>
        <div v-else class="loader">
          <img src="@/assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
      <div class="col volatility">
        <div v-if="itemObject">{{ filteredByLastThreeMonth.length }}</div>
        <div v-else class="loader">
          <img src="@/assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
      <div class="col volatility">
        <div v-if="eventItemObject">
          {{ filteredByLastThreeMonthEvents.length }}
        </div>
        <div v-else class="loader">
          <img src="@/assets/images/loader.svg" alt="Loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Button from "@/components/Button"

export default {
  components:{
    Button
  },
  props: {
    row: String,
    itemObject: Object,
    contractOrder: String,
    eventItemObject: Object,
    contractEvent: String,
  },
  computed: {
    ...mapGetters({}),
    filteredByLastMonthEvents() {
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;
      return this.eventItemObject[this.contractEvent].filter(
        (item) => item.timeStamp * 1000 >= lastMonthDate
      );
    },
    filteredByLastThreeMonthEvents() {
      const lastThreeMonthDate = new Date().getTime() - 92 * 24 * 3600 * 1000;
      return this.eventItemObject[this.contractEvent].filter(
        (item) => item.timeStamp * 1000 >= lastThreeMonthDate
      );
    },
    filteredByLastMonth() {
      const lastMonthDate = new Date().getTime() - 30 * 24 * 3600 * 1000;
      return this.itemObject[this.contractOrder].filter(
        (item) => item.timeStamp * 1000 >= lastMonthDate
      );
    },
    filteredByLastThreeMonth() {
      const lastThreeMonthDate = new Date().getTime() - 92 * 24 * 3600 * 1000;
      return this.itemObject[this.contractOrder].filter(
        (item) => item.timeStamp * 1000 >= lastThreeMonthDate
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.volatility {
  color: var(--theme-text);
  padding: 0;
  margin-right: 10px;
}
.openList {
  .list-item {
    opacity: 1;
    transform: none;
    transition: all 0.5s cubic-bezier(0.36, -0.64, 0.34, 1.76);
    font-size: 10px;
    line-height: 92%;
    padding: 10px 30px;
    color: #8c8c8c;
    height: 140px;
    visibility: visible;
    span {
      margin-top: 5px;
    }
  }
}
.closeList {
  .list-item {
    opacity: 0;
    transform: rotateX(-90deg);
    transition: all 0.5s cubic-bezier(0.36, -0.64, 0.34, 1.76);
    font-size: 9px;
    line-height: 92%;
    color: #8c8c8c;
    height: 0;
    visibility: hidden;
    span {
      margin-top: 5px;
    }
  }
}

.item {
  display: flex;
  flex-direction: column;
  background: var(--brand3);
  border-radius: 0;
  margin: 0;
  height: auto;

  &:nth-child(even) {
    background: linear-gradient(
      270deg,
      var(--brand3) 0%,
      rgba(89, 89, 90, 0) 100%
    );
  }
  &:first-child {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    .status {
      border-top-left-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 0;
      position: absolute;
      width: 18.64px;
      height: 62px;
      left: 0;
      .live {
        width: 30px;
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        margin-left: -5px;
        transform: rotate(-90deg);
        color: white;
        .dot {
          margin-top: 5px;
          width: 4px;
          height: 4px;
          border-radius: 100px;
          background: white;
        }
      }
    }
  }

  &:last-child {
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }
}

.item_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 62px;
}

.volatility {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  @media (max-width: 1320px) and (min-width: 1150px) {
    width: 15%;
  }

  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 35px;
    padding: 8px 22px 6px;
    margin: 18px 24px;
    background: var(--brand);
    backdrop-filter: blur(12.6647px);
    border-radius: 9px;
  }

  .percent {
    font-size: 13px;
    line-height: 92%;
    color: var(--theme-text);
  }
}

.event_id {
  max-width: 86px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
  padding: 0;
  cursor: pointer;
  color: var(--theme-text);

  .arrow {
    margin-left: 5px;
    transform: rotateZ(-90deg);
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
  img {
    width: 16px;
    height: 16px;
  }
}
</style>
