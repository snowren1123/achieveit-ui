import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'

Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$cookie = Cookie

Vue.config.productionTip = false

axios.defaults.withCredentials = true;
//axios.defaults.baseURL = (process.env.NODE_ENV === 'development') ? '/api' : process.env.BASE_API;
//axios.defaults.baseURL = '/api'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const token = Cookie.get('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + Cookie.get("token")  //请求头加上token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    //拦截响应，做统一处理 
    if (!Cookie.get('token') && response.data.data) {
      router.replace({
        path: '/login'
      })
    }
    return response
  },
  //接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error.response.status) // 返回接口返回的错误信息
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
