import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import store from './store'



Vue.use(VueAxios,axios)






new Vue({
  el: '#app',
  data: {
    showModal: false
  },
  store,
  router,
  render: h => h(App),
}).$mount('#app')

