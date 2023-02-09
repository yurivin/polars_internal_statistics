import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import store from './store'
import { Datetime } from 'vue-datetime'
import { BootstrapVue } from 'bootstrap-vue'
import Notifications from 'vue-notification'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'


Vue.use(VueAxios,axios,Datetime,BootstrapVue, Notifications)







new Vue({
  el: '#app',
  data: {
    showModal: false
  },
  store,
  router,
  render: h => h(App),
}).$mount('#app')

