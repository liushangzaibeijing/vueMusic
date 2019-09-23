<template>
  <div class="singer-container" :id="theme">
    <div class="singer-head">
      <div class="singer-img">
        <img :src="singerImgUrl">
      </div>
      <div class="detail">
        <p>
          <span class="tag">歌手</span>
          <span class="singer">{{singerName}}</span>
        </p>
        <p class="alias">{{alias}}</p>
        <p>单曲数:&nbsp;&nbsp;<span class="detail-num">{{musicSize}}</span></p>
        <p>专辑数:&nbsp;&nbsp;<span class="detail-num">{{albumSize}}</span></p>
        <p>MV数:&nbsp;&nbsp;<span class="detail-num">{{mvSize}}</span></p>
      </div>
    </div>
    <div class="hot-singer-nav">
        <li  @click="activeNav(index)"  v-for="(item,index) in navs"
               :class="{active:currentIndex===index}">{{item}}
        </li>
<!--        <li id="nav_one" class="active" @click="activeNav($event)">歌曲</li>-->
<!--        <li id="nav_two" class="noactive" v-bind:class="{on:index=active}" @click="activeNav($event)">专辑</li>-->
    </div>
    <div class="albums">
      <div v-show="songVisible" class="hot-songs">
        <div class="album-logo">
          <img src="http://on99ebnkk.bkt.clouddn.com/top50.png">
        </div>
        <div class="albums-content">
          <p class="albums-title">热门50首</p>
          <ul>
            <li
              v-for="(item, index) in hotSongsList.musicData"
              v-if="index < 10 || showAll"
              @dblclick="$store.commit('setMusicList', hotSongsList),
              $store.commit('setPlayIndex', index)"
            >
              <span class="index">
                {{index + 1 > 9 ? index + 1 : `0${index + 1}`}}
              </span>
              <span><i class="fa fa-heart-o fa-fw"></i><i class="fa fa-download fa-fw"></i></span>
              <span class="song-name">{{item.name}}</span>
              <span class="time">{{formatTime(~~ item.duration)}}</span>
            </li>
          </ul>
          <p class="show-all" v-if="!showAll"><span @click="showAll = true">查看全部50首&nbsp;<i class="fa fa-angle-right"></i></span></p>
        </div>
      </div>
      <div v-show="!songVisible" v-for="item in albumList" class="album-songs">
        <div class="album-logo">
          <img :src="item.albumImgUrl">
          <p class="publishtime">{{formatDate(item.time)}}</p>
        </div>
        <div class="albums-content">
          <p class="albums-title"><span @click="$router.push({name: 'album', params: {id: item.albumId}})">{{item.name}}</span></p>
          <ul>
            <li
              v-for="(songs, index) in item.musicData.musicData"
              @dblclick="$store.commit('setMusicList', item.musicData),
              $store.commit('setPlayIndex', index)"
            >
              <span class="index">
                {{index + 1 > 9 ? index + 1 : `0${index + 1}`}}
              </span>
              <span><i class="fa fa-heart-o fa-fw"></i><i class="fa fa-download fa-fw"></i></span>
              <span class="song-name">{{songs.name}}</span>
              <span class="time">{{formatTime(~~ songs.duration)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * A module that define singer component
 * @exports singer
 * @author oyh(Reusjs)
 */
import {
    hotSongsAndRelation,
    albumList,
} from "../api/api";
export default {
  name: 'singer',
  data() {
    return {
      //资源根路径
      basePath:"http://127.0.0.1:8080",
      //热门歌曲
      hotSongsList: {"musicData":[]},
      //专辑列表
      albumList: [],
      //歌曲图片
      singerImgUrl: '',
      //歌手名字
      singerName: '',
      //歌手id
      singerId: '',
      //歌手关联关系mid
      singerMid:'',
      //歌手别名
      alias: '',
      //音乐个数
      musicSize: 0,
      //专辑个数
      albumSize: 0,
      //mv个数
      mvSize: 0,
      showAll: false,
      songVisible:true,
      navs:["歌曲","专辑"],
      currentIndex:0,
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    theme() {
      return this.$store.state.theme
    }
  },
  methods: {
    fetchData: function () {
          //歌曲列表
          this.hotSongsList = {"musicData": []}

          let getParams = {
              params: {
                  id :this.$route.params.id
              }
          }

          hotSongsAndRelation(getParams).then(res=>{
              if (res.code == 0) {

                  let data = JSON.parse(res.data);

                  let  singer = data.singer;

                  this.singerId = singer.id;
                  this.singerMid = singer.singerMid;
                  this.singerName = this.getSingerName(singer);
                  this.singerImgUrl = this.basePath+singer.picLocal;

                  this.alias = this.getAliasName(singer);
                  this.musicSize = singer.musicSize;
                  this.albumSize = singer.albumSize;
                  this.mvSize = singer.mvSize;

                  let  hotSongs =  data.hotSongs;
                  hotSongs.forEach(item => {
                      let obj = {
                          name: item.songName,
                          id: item.id,
                          songMid: item.songMid,
                          singerName: this.singerName,
                          singerId: this.singerId,
                          singerMid: this.singerMid,
                          duration: item.duration
                      }
                      this.hotSongsList.musicData.push(obj)
                  })
              }

          });
          //专辑列表
          this.albumList = [];

          albumList(getParams).then(res=>{
              if (res.code == 0) {
                  debugger
                  let  data =  JSON.parse(res.data);
                  data.forEach(item => {
                      let obj = {
                          name: item.albumName,
                          time: item.pubTime,
                          albumId: item.id,
                          albumMid: item.albumMid,
                          singerMid:item.singerMid,
                          albumImgUrl: this.basePath+item.albumPic,
                          descption:item.descption,
                          musicData: item.songData,

                      }
                      this.albumList.push(obj)
              });
          }
      })
    },
    formatTime(time) {
      time = Math.floor(time / 1000)
      let second = time % 60
      let min = (time - second) / 60
      second = second > 9 ? second : `0${second}`
      min = min > 9 ? min : `0${min}`
      return `${min}:${second}`
    },
    formatDate(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month > 9 ? month : `0${month}`
      day = day > 9 ? day : `0${day}`
      return `${year}-${month}-${day}`
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
    getAliasName(singer){
        if(singer.shortName!=null&&singer.shortName!=''){
            return this.convertSingerName(singer.shortName);
        }
        return this.singerName;
    },
    //nav 切换
    activeNav(index){
      this.currentIndex = index;
      if(index==0){
         this.songVisible = true
      }
      if(index==1){
         this.songVisible = false;
      }
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.fetchData()
      }
    }
  },
  mounted() {
    },
}
</script>

<style lang="scss" scoped>
@import "../style/singer";
</style>
