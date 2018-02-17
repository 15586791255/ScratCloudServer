// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Global from '../static/global'
import Utils from '../static/utils'
import DateFormat from '../static/date'
import Home from './components/HelloFromVux'
import ShopMgr from './components/ShopMgr'
import ShopList from './components/ShopList'
import ShopDetail from './components/ShopDetail'
import axios from 'axios'
import { AlertPlugin } from 'vux'

Vue.prototype.$http = axios
Vue.use(AlertPlugin)
Vue.use(VueRouter)

Vue.prototype.$showAlert = function (title, msg) {
  this.$vux.alert.show({
    title: title,
    content: msg
  })
}
Vue.prototype.$global = Global
Vue.prototype.$utils = Utils
Vue.prototype.$dateFormat = DateFormat

const routes = [{
  path: '/',
  component: Home
}, {
  path: '/shop_mgr',
  component: ShopMgr
}, {
  path: '/shop_list',
  component: ShopList
}, {
  path: '/shop_detail',
  component: ShopDetail
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
