import axios from 'axios';
let base = '/utopia';
import errmsg from './catchErr'

//post请求测试
export const login = params => axios.post(base + '/login/checkLogin', params).then(res => res.data).catch(err => {errmsg(err.response.status)});
//get请求测试
export const  getMusic = params => axios.get(url,params).then(res=>res.data).catch(err => {errmsg(err.response.status)});

//获取歌手信息
export const hotSingerList = params => axios.get(base+"/music/singer/hotSingerListByPage",params).then(res=>res.data).catch(err => {errmsg(err.response.status)});


//获取歌手的热门歌曲 以及相关信息
export const hotSongsAndRelation = params => axios.get(base+"/music/singer/hotSongsAndRelation",params).then(res=>res.data).catch(err => {errmsg(err.response.status)});

//获取歌手对应的专辑信息 使用分页
export const albumList = params => axios.get(base+"/music/album/albumList",params).then(res=>res.data).catch(err => {errmsg(err.response.status)});


//获取专辑对应的歌曲信息
export const songListByAlbum = params => axios.get(base+"/music/song/songListByAblum",params).then(res=>res.data).catch(err => {errmsg(err.response.status)});


