import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import App from './App.vue'
import router from './router/router.js'

Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$cookie = Cookie

Vue.config.productionTip = false

axios.defaults.withCredentials = true;
//axios.defaults.baseURL = (process.env.NODE_ENV === 'development') ? '/api' : process.env.BASE_API;
//axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  config.headers.Authorization = "Bearer " + Cookie.get("token")
  return config // 返回请求对象
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
