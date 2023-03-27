<template>
  <div class="item" >
    <div class="d-flex justify-content-between w-100 align-items-center">
      <div class="time">
        <div class="timer">
          {{ event.timeStamp }}
        </div>
      </div>
      <div class="time">
        <div class="timer">
          {{ (event.ownAmount / Math.pow(10,18)).toFixed(2) }} POL
        </div>
      </div>
      <div class="time">
        <div class="timer">
          {{ (event.orderAmount / Math.pow(10,18)).toFixed(2) }} POL
        </div>
      </div>
      <!--      <div class="teams">-->
      <!--        <div class="white">-->
      <!--          <img src="@/assets/images/white-team-ball.png" alt="" />-->
      <!--        </div>-->
      <!--        <div class="black">-->
      <!--          <img src="@/assets/images/black_ball.svg" alt="" />-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <div v-if="active" class="versus">-->
      <!--        <div class="white">-->
      <!--          {{ options.teamOne }}-->
      <!--          <img-->
      <!--            v-if="options.winner === 'white'"-->
      <!--            src="@/assets/images/trophy.svg"-->
      <!--            alt=""-->
      <!--          />-->
      <!--        </div>-->

      <!--        <div class="black">-->
      <!--          {{ options.teamTwo }}-->
      <!--          <img-->
      <!--            v-if="options.winner === 'black'"-->
      <!--            src="@/assets/images/trophy.svg"-->
      <!--            alt=""-->
      <!--          />-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <marquee v-else scrollamount="2" class="versus">-->
      <!--        <div class="white-marquee">-->
      <!--          {{ options.teamOne }}-->
      <!--          <img-->
      <!--            v-if="options.winner === 'white'"-->
      <!--            src="@/assets/images/trophy.svg"-->
      <!--            alt=""-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="black-marquee">-->
      <!--          {{ options.teamTwo }}-->
      <!--          <img-->
      <!--            v-if="options.winner === 'black'"-->
      <!--            src="@/assets/images/trophy.svg"-->
      <!--            alt=""-->
      <!--          />-->
      <!--        </div>-->
      <!--      </marquee>-->
      <div class="line"></div>
      <div class="type" @click="shotList">
        <img
          src="../assets/images/swiper.svg"
          alt=""
          :style="
            show
              ? ' transform: rotate(90deg); transition-duration: 200ms;'
              : 'transform: rotate(0deg); transition-duration: 200ms;'
          "
        />
      </div>
    </div>
    <div :class="show ? 'openList' : 'closeList'">
      <div class="d-flex flex-column list-item">
        <div class="d-flex justify-content-between">
          <span>Event ID</span>
          <span>#{{ event.eventId }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Order Time</span>
          <span> {{ event.timeStamp }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Address</span>
          <span>{{ event.user }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Hash</span>
          <span>{{ event.hash }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableItem",
  props: {
    event: Object,
  },
  data() {
    return {
      show: false,
      active: true,
    };
  },
  methods: {
    shotList() {
      this.show = !this.show
      if (this.show) {
        this.$emit('openList')
      } else {
        this.$emit('closeList')
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 18px 5px 14px;
  height: auto;
  background: linear-gradient(270deg, #1c1c25 0%, #28242d 100%);

  &:nth-child(even) {
    background: #2b2b37;
  }

  &:first-child {
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
  }

  &:last-child {
    border-bottom-left-radius: 11px;
    border-bottom-right-radius: 11px;
  }

  .time {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    @media (max-width: 600px) {
      padding-left: 3vw;
      padding-right: 3vw;
      width: 95px;
    }
    .timer {
      font-size: 10px;
      line-height: normal;
      text-align: center;
      margin-bottom: 5px;
      color: #ffffff;
    }
    .date {
      font-size: 9px;
      text-align: center;
      line-height: normal;
      color: #9b9b9b;
    }
  }

  .teams {
    margin-left: 15px;
    width: 60px;
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
      margin-left: 0;
    }

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 30px;
      height: 30px;

      @media (max-width: 1500px) {
        margin-left: -10px;
      }
    }
    .white {
      border: 1px solid #e2e2e2;
    }
    .black {
      z-index: 20;
      border: 1px solid #222429;
      background: #373740;
      transform: translateX(-5px);
      img {
        width: 10px;
        height: 10px;
      }
    }
  }

  .versus {
    display: flex;
    flex-direction: column;
    width: 5vw;
    // max-width: 70px;
    z-index: 1000;
    @media (max-width: 1200px) {
      width: 20vw;
    }
    @media (max-width: 768px) {
      width: 50vw;
    }
    @media (max-width: 600px) {
      width: 40vw;
    }

    .white {
      font-size: 10px;
      line-height: 92%;
      color: #ffffff;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 5px;
      img {
        margin-left: 5px;
      }
      @media (max-width: 768px) {
        font-size: 11px;
        padding: 1px 10px;
      }
    }

    .white-marquee {
      font-size: 10px;
      line-height: 92%;
      color: #ffffff;
      text-align: left;
      // margin-left: -7vw;
      margin-bottom: 5px;
      img {
        margin-left: 5px;
      }
      @media (max-width: 768px) {
        font-size: 11px;
        padding: 1px 10px;
      }
    }

    .black {
      font-size: 10px;
      line-height: 92%;
      color: #9b9b9b;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      img {
        margin-left: 5px;
      }
      @media (max-width: 768px) {
        font-size: 11px;
        padding: 1px 10px;
      }
    }

    .black-marquee {
      font-size: 10px;
      line-height: 92%;
      color: #9b9b9b;
      text-align: left;
      // margin-left: -7vw;
      img {
        margin-left: 5px;
      }
      @media (max-width: 768px) {
        font-size: 11px;
        padding: 1px 10px;
      }
    }
  }

  .line {
    background: #343740;
    opacity: 0.8;
    width: 1px;
    height: 34px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: -3px;
    @media (max-width: 1220px) {
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  .type {
    width: 15px;
    height: 15px;
    margin-bottom: 10px;
    position: relative;
    cursor: pointer;
    @media (max-width: 1500px) {
      margin-right: 10px;
    }
    @media (max-width: 768px) {
      margin-left: 0;
      margin-right: 2px;
    }
    img{
      position: absolute;
      top: -3px;
      left: -7px;
    }
  }
}
.openList {
  .list-item {
    opacity: 1;
    transform: none;
    transition: all 0.5s cubic-bezier(0.36, -0.64, 0.34, 1.76);
    font-size: 9px;
    line-height: 92%;
    padding: 20px 5px 0;
    color: #9b9b9b;
    height: 100px;
    visibility: visible;
    @media (max-width: 768px) {
      padding: 20px 10px 0 0;
    }
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
    color: #9b9b9b;
    height: 0;
    visibility: hidden;
    span {
      margin-top: 5px;
    }
  }
}
</style>
