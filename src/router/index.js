import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/layout/Home.vue'
import util from "../core/util";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        hidden: true,
        path: '',
        redirect: to => {
          return 'menu'
        },
      }, {
        path: '/menu',
        name: "menu",
        component: util.load("components/modules/Menu/Menu"),
        meta: {
          applicationCode: "menu",
          notRequire: true
        }
      }]
    },
    {path: '/login', component: util.load("components/common/Login")},
  ]
})
