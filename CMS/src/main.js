// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
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
Vue.prototype.$dateFormat = DateFormat

Vue.prototype.apiHost = 'http://localhost:8081'
Vue.prototype.shopType = {
  equipment: '游戏装备',
  lucky_money: '红包',
  game_around: '游戏周边',
  virtual: '虚拟物品'
}

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
