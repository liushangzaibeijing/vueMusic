<template>
  <div class="hot-singer-container" :id="theme">
  <ul class="hot-singer-nav">
    <li @click="$router.push({name: 'findMusic'})">个性推荐</li>
    <li @click="$router.push({name: 'playList'})">歌单</li>
    <li @click="$router.push({name: 'rank'})">排行榜</li>
    <li class="active">歌手</li>
    <li @click="$router.push({name: 'newSong'})">最新音乐</li>
  </ul>
    <ul class="singers">
      <li v-for="item in hotSingerList">
        <img :src="item.imgUrl" @click="$router.push({name: 'singer', params:{id: item.id}})">
        <p><span class="name" @click="$router.push({name: 'singer', params:{id: item.id}})"></span></p>
      </li>
    </ul>
  </div>
</template>

<script>/**
 * A module that define hotSinger component
 * @exports hotSinger
 * @author oyh(Reusjs)
 */

import {
  hotSingerList,
} from "../../api/api";
export default {
  name: 'hotSinger',
  data() {
    return {
      hotSingerList: []
    }
  },

  methods: {
    hotSingerList() {
      let params = {
        limit: 50
      }
      //修改密码
      hotSingerList(params).then(res => {
        if (res.code == 0) {
          res.data.artists.forEach(item => {
            var singerName = this.getSingerName(item);
            let obj = {
              imgUrl: item.picLocal,
              id: item.id,
              name: singerName
            }
            this.hotSingerList.push(obj)
          });
        }
      });
    },
    //获取歌手信息
    getSingerName(singer){
        if(singer.fullName!=null&&singer.fullName!=''){
          return singer.fullName;
        }
        if(siner.englishName!=null&&singer.englishName!=''){
          return singer.englishName;
        }else{
          return "未知";
        }
    }
  },
  mounted() {
},
  computed: {
    theme() {
      return this.$store.state.theme
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../style/hotSinger.scss";
</style>
