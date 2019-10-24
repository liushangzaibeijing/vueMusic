<template>
  <div id="app">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <v-play></v-play>
    <router-view class="router-view" v-if="!isShowPlay" :id="theme"></router-view>
    <v-footer></v-footer>
    <about></about>
    <login></login>
    <register></register>
  </div>
</template>

<script>
import vHead from './components/public/head.vue'
import vFooter from './components/public/footer.vue'
import vSidebar from './components/public/sidebar.vue'
import vPlay from './components/play/play.vue'
import about from './components/about.vue'
//旧的登录页面
//import login from './components/login.vue'
//新的登录页面
import login from './components/auth/login.vue'

import register from './components/auth/register.vue'

export default {
  name: 'app',
  //子组件
  components: {
    vHead,   //页面头部
    vFooter, //页面尾部
    vSidebar, //测边框
    vPlay,    //播放页面
    about,    //关于
    login,     //登陆
    register     //注册
  },
  computed: {
    isShowPlay() {
      return this.$store.state.showPlay
    },
    theme() {
      return this.$store.state.theme
    }
  }
}
</script>

<style lang="scss">
@import 'style/app';
</style>
