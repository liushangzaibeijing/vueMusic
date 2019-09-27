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
    </div>
    <div class="albums">
      <div v-show="songVisible" class="hot-songs">
        <div class="album-logo">
          <img :src="albumUrl">
        </div>
        <div class="albums-content">
          <p class="albums-title">全部歌曲</p>
          <ul>
            <li
              v-for="(item, index) in hotSongsList.musicData"
              v-if="index < 10 || showAll"
              @click="addPlayList(item)">
              <span class="index">
                {{index + 1 > 9 ? index + 1 : `0${index + 1}`}}
              </span>
              <span><i class="fa fa-heart-o fa-fw"></i><i class="fa fa-download fa-fw"></i></span>
              <span class="song-name">{{item.name}}</span>
              <span class="time">{{formatTime(~~ item.duration)}}</span>
            </li>
          </ul>
          <div class="pagetation_info clearfix" style="margin: 0 auto;">
            <ul class="pagetation_box">
                     <li class="firstPage" @click=" songPage.page = 0 "><a href="javascript:;">首页</a></li>
                         <li class="prev" v-show=" songPage.page > 0 " @click=" songPage.page-- "><a href="javascript:;">&lt;</a></li>
                         <li v-for="d in songPage.showPageNum*2" @click=" songPage.page = d+songPage.minPage " :class=" songPage.page ==d+songPage.minPage? 'active' : '' "><a href="javascript:;">{{d+songPage.minPage}}</a></li>
                         <li class="next" v-show=" songPage.page < songPage.maxPage - 1 " @click=" songPage.page++ "><a href="javascript:;">&gt;</a></li>
                         <li class="lastPage" @click=" songPage.page = songPage.maxPage"><a href="javascript:;">尾页</a></li>
            </ul>
          </div>
        </div>

      </div>
      <div v-show="!songVisible">
        <ul class="albums">
         <li v-for="item in albumList">
          <div class="album-logo" @click="showAlbumSongList(item)">
            <img :src="item.albumImgUrl">
            <span class="albums-title" >{{item.name}}</span> &nbsp;&nbsp;&nbsp;
            <span class="publishtime">{{formatDate(item.time)}}</span>
          </div>
        </li>
        </ul>
        <div class="pagetation_info clearfix" style="margin: 0 auto;">
          <ul class="pagetation_box">
                   <li class="firstPage" @click=" albumPage.page = 0 "><a href="javascript:;">首页</a></li>
                       <li class="prev" v-show=" albumPage.page > 0 " @click=" albumPage.page-- "><a href="javascript:;">&lt;</a></li>
                       <li v-for="d in albumPage.showPageNum*2" @click=" albumPage.page = d+albumPage.minPage " :class=" albumPage.page ==d+albumPage.minPage? 'active' : '' "><a href="javascript:;">{{d+albumPage.minPage}}</a></li>
                       <li class="next" v-show=" albumPage.page < songPage.maxPage - 1 " @click=" songPage.page++ "><a href="javascript:;">&gt;</a></li>
                       <li class="lastPage" @click=" albumPage.page = albumPage.maxPage"><a href="javascript:;">尾页</a></li>
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
    getSongList,

} from "../api/api";
import storage from '../storage.js'
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
      albumUrl:"http://on99ebnkk.bkt.clouddn.com/top50.png",
      songPage : {
          "total" : 100,
          "page" : 0,
          "maxPage" : 5,
          "minPage":0,
          "size" : 25,
          "showPageNum":4,
      },
      albumPage : {
          "total" : 100,
          "page" : 0,
          "maxPage" : 5,
          "minPage":0,
          "size" : 20,
          "showPageNum":4,
      },
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
        this.getSingerInfo();
        this.getSongList(null);
    },
    getAlbumList(){
        let getParams = {
            params: {
                id :this.$route.params.id,
                currentPage:this.albumPage.page,
                pageSize:this.albumPage.size
            }
        }
        //专辑列表
        this.albumList = [];

        albumList(getParams).then(res=>{
            if (res.code == 0) {
                let  data =  JSON.parse(res.data);
                let albumList = JSON.parse(data.list);
                albumList.forEach(item => {
                    let obj = {
                        name: item.albumName,
                        time: item.pubTime,
                        albumId: item.id,
                        albumMid: item.albumMid,
                        singerMid:item.singerMid,
                        albumImgUrl: this.basePath+item.albumPic,
                        descption:item.descption,
                    }
                    this.albumList.push(obj)
                });
                //初始化页码
                this.albumPage.total = data.total;
                this.albumPage.maxPage = data.maxPage;
                this.albumPage.page = data.page;
                this.initPage(2);
            }
        })
    },
    getSingerInfo(){
        let getParams = {
            params: {
                id :this.$route.params.id,
            }
        }
        hotSongsAndRelation(getParams).then(res=>{
            if (res.code == 0) {
                let singer = JSON.parse(res.data);
                this.singerId = singer.id;
                this.singerMid = singer.singerMid;
                this.singerName = this.getSingerName(singer);
                this.singerImgUrl = this.basePath+singer.picLocal;
                this.albumUrl = this.singerImgUrl;
                this.alias = this.getAliasName(singer);
                this.musicSize = singer.musicSize;
                this.albumSize = singer.albumSize;
                this.mvSize = singer.mvSize;
            }
        });
    },
    getSongList(albumMid){
        //歌曲列表
        this.hotSongsList = {"musicData": []}
        let id  = this.$route.params.id;
        let getParams = {
            params: {
                id :id,
                albumMid: albumMid,
                currentPage:this.songPage.page,
                pageSize:this.songPage.size,
            }
        }
        getSongList(getParams).then(res=>{
            if (res.code == 0) {
                let data = JSON.parse(res.data);
                let songList = JSON.parse(data.list);
                songList.forEach(item => {
                    let obj = {
                        name: item.songName,
                        id: item.id,
                        songMid: item.songMid,
                        singerName: this.singerName,
                        singerId: this.singerId,
                        singerMid: this.singerMid,
                        duration: item.duration,
                        songUrl:item.songUrl,
                    }
                    this.hotSongsList.musicData.push(obj)
                })
                //初始化页码
                this.songPage.total = data.total;
                this.songPage.maxPage = data.maxPage;
                this.songPage.page = data.page;
                this.initPage(1);
            }
        });
      },
    formatTime(time) {
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
          this.getSongList();
      }
      if(index==1){
         this.songVisible = false;
          this.getAlbumList()
      }
    },
    //初始化页码信息
    initPage(type){
        if(type==1){
          let min = this.songPage.page-this.songPage.showPageNum;
          this.songPage.minPage = min;
          if(min < 0){
              this.songPage.minPage = 0;
          }
          let max = this.songPage.page+this.songPage.showPageNum;
          if(max>this.songPage.maxPage){
              this.songPage.minPage = this.songPage.maxPage-this.songPage.showPageNum*2;
          }
        }
        if(type==2){
            let min = this.albumPage.page-this.albumPage.showPageNum;
            this.albumPage.minPage = min;
            if(min < 0){
                this.albumPage.minPage = 0;
            }
            let max = this.albumPage.page+this.albumPage.showPageNum;
            if(max>this.albumPage.maxPage){
                this.albumPage.minPage = this.albumPage.maxPage-this.albumPage.showPageNum*2;
            }
        }

    },
    //显示专辑中的歌曲信息
    showAlbumSongList(item){
        this.getSongList(item.albumMid);
        this.albumUrl= item.albumImgUrl;
        this.songVisible = true;
    },
    addPlayList(song){
        alert("添加歌曲到播放列表")
        let musicData = storage.getMusic().musicData;
        let index = this.indexPostion(musicData,song);
        if(index==null){
            this.$store.commit('setMusic', song)
            this.$store.commit('setPlayIndex', musicData.length+1)
        }else{
            this.$store.commit('setPlayIndex', index)
        }

    },
    indexPostion(musicData,playload){

        for (let index = 0;index < musicData.length; index++) {
            alert(musicData[index].songMid +" "+playload.songMid);

            if (musicData[index].songMid == playload.songMid) {
                return index;
            }
        }
        return null;
    },
   },
  watch: {
    $route: {
      handler(to, from) {
        this.fetchData()
      }
    },

    "songPage.page" : function(val){
        var _this=this;
        _this.getSongList();
    },
    "albumPage.page" : function(val){
        var _this=this;
        _this.getAlbumList();
    },
  },
  mounted() {
    },
}
</script>

<style lang="scss" scoped>
@import "../style/singer";
</style>
