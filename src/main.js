// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import Cookie from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
// import router from './router'

Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$cookie = Cookie

Vue.config.productionTip = false

// Vue.http.options.emulateJSON = true
// Vue.http.options.emulateHTTP = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //router,
  components: { 
    App
  },
  template: '<App/>'
})
