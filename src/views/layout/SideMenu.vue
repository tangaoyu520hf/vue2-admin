<template>
  <aside class="main-sidebar animated" :class="{ slideInLeft: show, slideOutLeft: !show }">
    <div class="sidebar">
      <el-menu :default-active="onRoutes"
               :default-openeds="onRouteKeys"
               class="el-menu-vertical-demo"
               theme="dark" router>
        <template v-for="item in $store.getters.getTopMenus">
          <sub-menu :param="item"></sub-menu>
        </template>
      </el-menu>
    </div>
  </aside>
</template>
<script>
  import subMenu from "@/components/common/SubMenu.vue"

  export default {
    props: {
      show: Boolean
    },
    data() {
      return {}
    },
    components: {
      subMenu
    },
    computed: {
      onRoutes(){
        return this.$route.path;
      },
      onRouteKeys(){
        const getPath = (path,kas = []) => {
          if(path.lastIndexOf('/')>1){
            let pathTemp = path.substring(0,path.lastIndexOf('/'));
            kas.push(pathTemp)
            getPath(pathTemp,kas);
          }
          return kas;
        }
        let paths = getPath(this.$route.path);
        return paths;
      },
    },
    mounted () {
      let route = this.$route
//      console.log(route)
//      if (route.name) {
//        this.shouldExpandMatchItem(route)
//      }
    },
    created: function () {

    }
  }
</script>
<style>
  @media (max-width: 800px) {
    .main-sidebar {
      transform: translate3d(-230px, 0, 0);
    }
  }

  .slideInLeft {
    animation-duration: .377s;
    animation-name: slideInLeft;
  }

  .slideOutLeft {
    animation-duration: .377s;
    animation-name: slideOutLeft;
  }

  .main-sidebar {
    background-color: #324157;
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    min-height: 100%;
    width: 230px;
    z-index: 810;
    -webkit-transition: -webkit-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, width 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  }

  .el-menu-vertical-demo .el-submenu .el-menu-item {
    height: 45px;
    line-height: 45px;
  }

  .el-menu-vertical-demo .el-menu-item, .el-menu-vertical-demo .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }

</style>
