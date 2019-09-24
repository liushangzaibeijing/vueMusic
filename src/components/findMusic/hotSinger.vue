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
      <li v-for="item in hotSingers">
        <img :src="item.imgUrl" @click="$router.push({name: 'singer', params:{id: item.id}})" >
        <p><span class="name" @click="$router.push({name: 'singer', params:{id: item.id}})">{{item.name}}</span></p>
      </li>

    </ul>

    <div class="pagetation_info clearfix" style="margin: 0 auto;">
      <ul class="pagetation_box">
               <li class="firstPage" @click=" page.page = 0 "><a href="javascript:;">首页</a></li>
               <li class="prev" v-show=" page.page > 0 " @click=" page.page-- "><a href="javascript:;">&lt;</a></li>
               <li v-for="d in page.showPageNum*2" @click=" page.page = d+page.minPage " :class=" page.page ==d+page.minPage? 'active' : '' "><a href="javascript:;">{{d+page.minPage}}</a></li>
               <li class="next" v-show=" page.page < page.maxPage - 1 " @click=" page.page++ "><a href="javascript:;">&gt;</a></li>
               <li class="lastPage" @click=" page.page = page.maxPage"><a href="javascript:;">尾页</a></li>
      </ul>
    </div>
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
      hotSingers: [],
      page : {
            "total" : 100,
            "page" : 0,
            "maxPage" : 5,
            "minPage":0,
            "size" : 48,
            "showPageNum":4,
        },
    }
  },

  methods: {
    hotSingerList() {
      let getParams = {
          params: {
              currentPage:this.page.page,
              limit: this.page.size,
          }
      }
      //获取歌手信息
      hotSingerList(getParams).then(res => {
        if (res.code == 0) {
            this.hotSingers = [];
            let data = JSON.parse(res.data);
            let singerList = JSON.parse(data.list);
            singerList.forEach(item => {
                let singerName =this.getSingerName(item);

            let obj = {
              imgUrl: "http://127.0.0.1:8080"+item.picLocal,
              id: item.id,
              name: singerName
            }
            this.hotSingers.push(obj)
          });

          //初始化页码
          this.page.total = data.total;
          this.page.maxPage = data.maxPage;
          this.page.page = data.page;
          this.initPage();
        }
      });
    },
    //获取歌手信息
    getSingerName(singer){
        if(singer.fullName!=null&&singer.fullName!=''){
            return this.convertSingerName(singer.fullName);
        }
        if(singer.englishName!=null&&singer.englishName!=''){
           return  this.convertSingerName(singer.englishName)
        }else{
          return "未知";
        }
    },
    convertSingerName(name){
        let singerName = name;
        if(name.indexOf("|")!=-1){
            singerName = name.split("|")[0];
        }
        else if(name.indexOf("、")!=-1){
            singerName = name.split("、")[0];
        }
        if(name.length>15){
            singerName = name.substring(0,15)+"...";
        }
        return singerName
    } ,
    //初始化页码信息
     initPage(){
         let min = this.page.page-this.page.showPageNum;
         this.page.minPage = min;
         if(min < 0){
             this.page.minPage = 0;
         }
         let max = this.page.page+this.page.showPageNum;
         if(max>this.page.maxPage){
             this.page.minPage = this.page.maxPage-this.page.showPageNum*2;
         }
     }
    },
  mounted() {
      this.hotSingerList();
  },
  computed: {
    theme() {
      return this.$store.state.theme
    },
  },
  watch : {
      "page.page" : function(val){
          var _this=this;
          _this.hotSingerList();
      },
  },
}
</script>

<style lang='scss' scoped>
@import "../../style/hotSinger.scss";
</style>
<style type="text/css">
  @import "../../style/css/page.css";
</style>

