import Vue from "vue";
import Router from "vue-router";
import util from "../core/util";
Vue.use(Router)

export default store => {
  let routes = [
    {
      path: '/login',
      name: "",
      component: util.load("views/login/Login"),
      meta: {notRequire: true}
    },
    {
      path: '/',
      component: util.load("views/layout/Home"),
      children: [{
        hidden: true,
        path: '',
        redirect: to => {
          return 'welcome'
        },
      }, {
        path: '/welcome',
        name: "welcome",
        component:  util.load("components/common/Welcome"),
        meta: {
          applicationCode: "welcome",
        }
      }, {
        path: '/table',
        component: util.load("components/common/Context"),
        meta: {
          applicationCode: "application",
        },
        children: [{
          path: '',
          component: util.load("components/modules/table/table"),
        },{
          path: '/table/addOrUpdate',
          component: util.load("components/modules/table/addOrUpdate"),
        }]
      }, {
          path: '/genScheme',
          component: util.load("components/common/Context"),
          meta: {
            applicationCode: "application",
          },
          children: [{
            path: '',
            component: util.load("components/modules/genScheme/genScheme"),
          },{
            path: '/table/addOrUpdate',
            component: util.load("components/modules/table/addOrUpdate"),
          }]
        },]
    },...store.getters.getRoutes]
  const router = new Router({
    mode: 'history',
    routes: routes
  });

/*  router.beforeEach((to, from, next) => {
    if(to.meta.name){
      let menuItem = {
        menuName:to.meta.name,
        menuUrl: to.path
      }
      store.commit("addCardMenu",menuItem);
    }
    let token = store.state.user.userinfo.token;
    //如果直接是公开的 则直接就 next
    if(to.matched.some(record => record.meta.notRequire)){
      next();
    }else{
      //用户没有登录 但是访问的页面又不是登录页面 则跳转到登录
      if (!token && to.path !== '/login') {
        next({
          path: '/login',
          params: {redirect: to.path}
        })
      }else{
        //如果已经登录 但是访问页面又是 登录 则直接跳转到 欢迎页
        if ( to.path === '/login') {
          next({
            path: '/welcome'
          });
        } else {
          next();
        }
      }
    }
  })*/
  return router;
}
