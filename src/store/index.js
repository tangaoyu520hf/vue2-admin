/**
 * Created by tangaoyu on 2017/4/20.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import menu from './modules/menu';
import user from './modules/user';
import * as types from "./mutation-types";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    menu,
    user
  },
  getters: {
    loading: state => state.loading,
    sidebar: state => state.sidebar,
    menuList: state => state.menuList,
    userInfo:state => state.userInfo
  },
  state: {
    menuList: {},
    loading: false,
    sidebar: {
      opened: true
    },
    device: {
      isMobile: false
    },
    userInfo:{name:'佚名'}
  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE] (state, isMobile) {
      state.device.isMobile = isMobile
    },
    [types.TOGGLE_LOADING] (state) {
      state.loading = !state.loading
    },
    [types.LOAD_MENU] (state, menu) {
      state.menuList = menu;
    },
    [types.SET_USER_INFO] (state, info) {
      state.userInfo = info;
    },
    [types.TOGGLE_SIDEBAR] (state, open) {
      if (open == null) open = !state.sidebar.opened;
      state.sidebar.opened = open;
    }
  }, actions: {
  //异步的函数
  toggleLoading: ({commit}) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({commit}) => {
    Vue.axios.get("./static/data/data.json").then(res => {
      commit(types.LOAD_MENU, res.data.menuList);
    }).catch(exp => commit(types.LOAD_MENU, defaultMenu));
  }
}
});
