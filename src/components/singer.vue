<template>
  <div class="singer-container" :id="theme">
    <ul class="menu-nav">
      <li @click="$router.push({name: 'findMusic'})">个性推荐</li>
      <li @click="$router.push({name: 'playList'})">歌单</li>
      <li @click="$router.push({name: 'rank'})">排行榜</li>
      <li class="active">歌手</li>
      <li @click="$router.push({name: 'newSong'})">最新音乐</li>
    </ul>
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
          <el-popover
            placement="right"
            width="300"
            trigger="hover">
              <div class="popup-data-detail">
                <h3 class="popup-data-detail-tit">专辑简介</h3>
                <p>那时雨后春前，你与我说，要去游园踏春，语气里怡悦而又满是憧憬。回来时，你膝盖青了一块，却告诉我，有了喜欢的人。</p>
                <p>我倏地一惊，却也只能，应声听你描述那个人的好。</p><p>十几年竹马青梅的感情，好像也就从那时候开始，慢慢变得疏远起来。</p>
                <p>后来，后来怎么样了呢。烽烟滚滚倾覆了无数的城池，你同那个人远走，而我迁离。</p><p>我不敢说，我在很后来的地方，见过你，也见过你的那个人，更见过，另一个旁边不是你的人。</p><p>我更不敢说，直到如今，我还在等。</p>
             </div>
              <img slot="reference" :src="albumUrl">
          </el-popover>

          <ul class="data-info">
            <li class="data-info-item">流派：Pop 流行</li>
            <li class="data-info-item">语种：国语</li>
            <li class="data-info-item">流派：Pop 流行</li>
            <li class="data-info-item">语种：国语</li>
            <li class="data-info-item">流派：Pop 流行</li>
            <li class="data-info-item">语种：国语</li>
          </ul>


        </div>
        <div class="albums-content">
          <p class="albums-title">全部歌曲</p>
          <ul>
            <li
              v-for="(item, index) in hotSongsList.musicData"
              @click="addPlayList(item)">
              <span class="index">
                {{index + 1 > 9 ? index + 1 : `0${index + 1}`}}
              </span>
              <span><i class="fa fa-heart-o fa-fw"></i><i class="fa fa-download fa-fw"></i></span>
              <span class="song-name">{{item.name}}</span>
              <span class="time">{{formatTime(~~ item.duration)}}</span>
            </li>
          </ul>
          <div class="pagetation_info clearfix" style="margin: 0 auto; border:none;">
            <ul id="page" class="pagetation_box" style="border:none;">
                     <li class="firstPage" @click="songPage.page = 0 "><a href="javascript:;">首页</a></li>
                         <li class="prev" v-show=" songPage.page > 0 " @click=" songPage.page-- "><a href="javascript:;">&lt;</a></li>
                         <li v-show="!songPage.pageSongShow" v-for="d in songPage.maxPage" @click=" songPage.page = d " :class=" songPage.page ==d? 'active' : '' "><a href="javascript:;">{{d}}</a></li>
                         <li v-show="songPage.pageSongShow" v-for="d in songPage.showPageNum*2" @click=" songPage.page = d+songPage.minPage " :class=" songPage.page ==d+songPage.minPage? 'active' : '' "><a href="javascript:;">{{d+songPage.minPage}}</a></li>
                         <li class="next" v-show=" songPage.page < songPage.maxPage - 1 " @click=" songPage.page++ "><a href="javascript:;">&gt;</a></li>
                         <li class="lastPage" @click=" songPage.page = songPage.maxPage"><a href="javascript:;">尾页</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div v-show="!songVisible">
        <ul class="albums-list">
         <li v-for="item in albumList">
          <div class="album-logo" @click="showAlbumSongList(item)">
            <img :src="item.albumImgUrl">
            <span class="albums-title" >{{item.name}}</span> &nbsp;&nbsp;&nbsp;
            <span class="publishtime">{{formatDate(item.time)}}</span>
          </div>
        </li>
        </ul>
        <div class="pagetation_info clearfix" style="margin: 0 auto;">
          <ul id="pageAlbum" class="pagetation_box" style=" border:none;">
                   <li class="firstPage" @click=" albumPage.page = 0 "><a href="javascript:;">首页</a></li>
                       <li class="prev" v-show=" albumPage.page > 0 " @click=" albumPage.page-- "><a href="javascript:;">&lt;</a></li>
                       <li v-if="!albumPage.pageAlbumShow" v-for="d in albumPage.maxPage" @click=" albumPage.page = d" :class=" albumPage.page ==d? 'active' : '' "><a href="javascript:;">{{d}}</a></li>
                       <li v-if="albumPage.pageAlbumShow" v-for="d in albumPage.showPageNum*2" @click=" albumPage.page = d+albumPage.minPage " :class=" albumPage.page ==d+albumPage.minPage? 'active' : '' "><a href="javascript:;">{{d+albumPage.minPage}}</a></li>
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
      // basePath:"http://127.0.0.1:8080",
      basePath:"http://utopiaxiu.cn:8088",
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
          "pageSongShow":true,
      },
      albumPage : {
          "total" : 100,
          "page" : 0,
          "maxPage" : 5,
          "minPage":0,
          "size" : 20,
          "showPageNum":4,
          "pageAlbumShow":true,
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
    //获取歌手信息
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
    //获取歌曲信息
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
                        singerId: id,
                        singerMid: item.singerMid,
                        duration: item.duration,
                        songUrl:item.songUrl,
                    }
                    this.hotSongsList.musicData.push(obj)
                });
                //console.log("热门歌曲信息：%s",JSON.stringify(this.hotSongsList.musicData))
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
        //歌曲分页
        if(type==1){
            if(this.songPage.maxPage<this.songPage.showPageNum){
                this.songPage.pageSongShow = false;
                return;
            }
           //最小值小于0 则为第一页
          let min = this.songPage.page-this.songPage.showPageNum;
          this.songPage.minPage = min;
          if(min < 0){
              this.songPage.minPage = 0;
          }
          let max = this.songPage.page+this.songPage.showPageNum;
          if(max>this.songPage.maxPage){
              this.songPage.minPage = this.songPage.maxPage-this.songPage.showPageNum*2;
          }
          this.songPage.pageSongShow = true;
        }
        if(type==2){
            if(this.albumPage.maxPage<this.albumPage.showPageNum){
                this.albumPage.pageAlbumShow = false;
                return;
            }
            let min = this.albumPage.page-this.albumPage.showPageNum;
            this.albumPage.minPage = min;
            if(min < 0){
                this.albumPage.minPage = 0;
            }
            let max = this.albumPage.page+this.albumPage.showPageNum;
            if(max>this.albumPage.maxPage){
                this.albumPage.minPage = this.albumPage.maxPage-this.albumPage.showPageNum*2;
            }
            this.albumPage.pageAlbumShow = true;
        }

    },
    //显示专辑中的歌曲信息
    showAlbumSongList(item){
        this.getSongList(item.albumMid);
        this.albumUrl= item.albumImgUrl;
        this.songVisible = true;
    },
    addPlayList(song){
        debugger
        let music = storage.getMusic();

        console.log("添加歌曲信息:%s",JSON.stringify(song))
        let index = null;
        if(music !=null){
            let musicData = music.musicData;
            index = this.indexPostion(musicData,song);
        }

        if(index==null){
            this.$store.commit('setMusic', song)
            this.$store.commit('setPlayIndex', musicData.length+1)
        }else{
            this.$store.commit('setPlayIndex', index)
        }

    },
    indexPostion(musicData,playload){

        for (let index = 0;index < musicData.length; index++) {
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
<style type="text/css">
  @import "../style/css/page.css";
</style>
