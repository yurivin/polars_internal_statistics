<template>
  <div id="app">
    <router-view/>
    <notifications/>
  </div>
</template>

<script>
  import Notifications from 'vue-notification'
export default {
  name: 'App',
  components: {
    Notifications
  },
  // created() {
  //   this.$store.dispatch('initFetchTransaction')
  // },
}
</script>

<style lang="scss">
#app {
  text-align: center;
  color: #2c3e50;
  background: #1f1f27;
  min-height: 100vh;
  padding: 50px 0;
}

.vdatetime-input {
  background: #2b2b37;
  border-radius: 11px;
  min-height: 32px;
  padding-left: 10px;
  padding-top: 5px;
  height: auto;
  min-width: 80px;
  width: 100%;
  text-align: left;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  border: 1px solid #2b2b37 !important;
  color: white;
  margin-bottom: 1rem;
}
.vdatetime-popup__header,
.vdatetime-calendar__month__day--selected > span > span,
.vdatetime-calendar__month__day--selected:hover > span > span {
  background: #1f1f27 !important;
}
.vdatetime-year-picker__item--selected,
.vdatetime-time-picker__item--selected,
.vdatetime-popup__actions__button {
  color: #1f1f27 !important;
}
.vdatetime-overlay {
  background: none !important;
}
.nav-tabs {
  border-bottom: none !important;
  display: flex;
  margin: 0;
  max-width: 440px;
  height: 33px;
  background: #1c1c25;
  border-radius: 13px;
  text-align: center;
  @media (max-width: 510px) {
    max-width: 300px;
  }

  .nav-link {
    border: none;
    background: none;
    color: #8c8c8c;
    padding: 9px 0 0 0 !important;
  }

  .nav-link:hover {
    border: none;
    padding: 10px 0 0 0 !important;
  }

  .nav-item {
    background: #1c1c25;
    width: 110px;
    height: 33px;
    border-radius: 13px;
    border: none;
    font-size: 16px;
    line-height: 92%;
    color: #8c8c8c;
    text-decoration: none;

    .active {
      width: 110px;
      height: 33px;
      background: black;
      border-radius: 13px;
      border: none;
      font-size: 16px;
      line-height: 92%;
      color: white;
      padding: 9px 0 0 0 !important;

      @media (max-width: 768px) {
        width: 110px !important;
        font-size: 14px;
      }
      @media (max-width: 510px) {
        width: 75px !important;
        font-size: 13px;
      }
    }

    @media (max-width: 768px) {
      width: 110px !important;
      font-size: 14px;
    }
    @media (max-width: 510px) {
      width: 75px !important;
      font-size: 13px;
    }
  }
}
.card-body{
  background: #1c1c25;
  border-radius: 25px;
}
 .card {
   position: relative;
   display: flex;
   flex-direction: column;
   min-width: 0;
   word-wrap: break-word;
   background-color: #1c1c25!important;
   background-clip: border-box;
   border: 1px solid #2b2b37!important;
   border-radius: 25px!important;
 }
</style>
