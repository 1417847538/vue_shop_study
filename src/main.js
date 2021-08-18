import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_0dr10iby4u67/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
