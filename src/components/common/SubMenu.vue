<template>
  <el-submenu :index="'/'+item.applicationCode+item.fullPath" v-if="item.children && item.children.length>0">
    <template slot="title"><i :class="item.icon"></i>{{item.menuName}}</template>
    <template v-for="child in item.children">
      <sub-menu v-if="child.children && child.children.length>0" :param="child"></sub-menu>
      <el-menu-item @click="handleClick(child)" :index="'/'+child.applicationCode+child.fullPath" v-else><i :class="child.icon"></i>{{child.menuName}}</el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item :name="item.name" :index="'/'+item.applicationCode+item.fullPath" v-else><i :class="item.icon"></i>{{item.name}}</el-menu-item>
</template>
<script>
  import subMenu from "./SubMenu.vue"
  import {mapMutations} from 'vuex'
  export default {
    name: 'subMenu',
    props: ['param'],
    data: function () {
      return {item: this.param}
    },
    components: {
      subMenu
    },
    methods: {
      ...mapMutations({
        addCardMenu: "addCardMenu"
      }),
      handleClick(item) {
        let cardMenu = {
          menuName: item.menuName,
          menuUrl: '/'+item.applicationCode+item.fullPath
        };
        this.addCardMenu(cardMenu);
        this.$router.push('/'+item.applicationCode+item.fullPath);
      }
    },
  }
</script>
<style>
  .el-menu .fa {
    margin-right: 10px;
  }
</style>
