// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'
import routerFunction from './router'
import store from './store/index'
import plugins from './core/plugins'

import i18n  from './core/i18n'

import VueProgressBar from "vue-progressbar";

Vue.config.productionTip = false

//网络请求
axios.defaults.baseURL = 'http://localhost:10010';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.use(VueAxios, axios)

//e饿了么UI
Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: key => i18n.vm._t(key)
})


import VeeValidate from 'vee-validate'

const config = {
  locale: 'zh_CN',
  errorBagName: 'errorrs',
  fieldsBagName: 'veeFieldss',
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touchedd', // the control has been blurred
    untouched: 'untouchedd', // the control hasn't been blurred
    valid: 'validd', // model is valid
    invalid: 'invalidd', // model is invalid
    pristine: 'pristinedd', // control has not been interacted with
    dirty: 'dirtyd' // control has been interacted with
  },
  events: 'input|blur',
  inject: false
};
Vue.use(VeeValidate, config);

//加载自定义的 插件
Vue.use(plugins)


// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let userinfo = store.state.user.userinfo;
  if(userinfo&&userinfo.token){
    config.headers.common["Authorization"]="Bearer "+userinfo.token;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


const options = {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

//添加请求前的 header中的 token值以及请求后的 错误处理
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router:routerFunction(store),
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
